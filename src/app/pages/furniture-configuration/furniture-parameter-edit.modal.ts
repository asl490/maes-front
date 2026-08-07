import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, computed, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ParameterDTO } from '../../core/api/generated/model/parameterDTO';
import { ModalComponent } from '../../shared/modal/modal.component';
import { NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';

export interface FurnitureParameterFormValue {
  parameter: number;
  minValue: number;
  maxValue: number;
  defaultValue: number;
}

export interface FurnitureParameterModalData extends Partial<FurnitureParameterFormValue> {
  mode: 'create' | 'edit';
  parameters: ParameterDTO[];
}

function valueRange(control: AbstractControl): ValidationErrors | null {
  const min = Number(control.get('minValue')?.value);
  const max = Number(control.get('maxValue')?.value);
  const value = Number(control.get('defaultValue')?.value);
  return min <= value && value <= max ? null : { valueRange: true };
}

@Component({
  selector: 'app-furniture-parameter-edit-modal',
  imports: [ReactiveFormsModule, ModalComponent, NgSelectComponent, NgOptionTemplateDirective],
  styleUrl: '../../shared/admin-feature.css',
  template: `<app-modal [title]="data.mode === 'create' ? 'Agregar parámetro' : 'Editar parámetro'">
    <form [formGroup]="form" class="space-y-5" (ngSubmit)="save()">
      <div>
        <label class="mb-1.5 block text-xs font-medium text-muted">Parámetro *</label>
        <ng-select
          class="maes-select"
          formControlName="parameter"
          [items]="data.parameters"
          bindValue="id"
          bindLabel="name"
          placeholder="Buscar parámetro"
          notFoundText="No se encontraron parámetros"
          [clearable]="false"
          [searchFn]="searchParameter"
          [popover]="true"
        >
          <ng-template ng-option-tmp let-item="item"
            ><div class="py-1">
              <p class="text-sm font-bold text-slate-800">{{ item.name }}</p>
              <p class="text-xs text-slate-500">
                {{ item.abbreviation || 'Sin abreviatura' }} · {{ item.type || 'Sin tipo' }} ·
                {{ item.unit || 'Sin unidad' }}
              </p>
            </div></ng-template
          >
        </ng-select>
        @if (!data.parameters.length && data.mode === 'create') {
          <p class="mt-2 text-xs text-amber-700">
            Todos los parámetros del catálogo ya están asociados.
          </p>
        }
      </div>
      <div class="grid gap-4 sm:grid-cols-3">
        <div>
          <label class="mb-1.5 block text-xs font-medium text-muted">Mínimo *</label
          ><input class="input w-full" type="number" formControlName="minValue" />
        </div>
        <div>
          <label class="mb-1.5 block text-xs font-medium text-muted">Predeterminado *</label
          ><input class="input w-full" type="number" formControlName="defaultValue" />
        </div>
        <div>
          <label class="mb-1.5 block text-xs font-medium text-muted">Máximo *</label
          ><input class="input w-full" type="number" formControlName="maxValue" />
        </div>
      </div>
      @if (form.hasError('valueRange') && form.touched) {
        <p class="rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
          El valor predeterminado debe encontrarse entre el mínimo y el máximo.
        </p>
      }
    </form>
    <div modal-footer class="modal-footer">
      <button class="btn-secondary" (click)="close()">Cancelar</button>
      <button
        class="btn-primary"
        (click)="save()"
        [disabled]="form.invalid || !data.parameters.length"
      >
        Guardar parámetro
      </button>
    </div>
  </app-modal>`,
})
export class FurnitureParameterEditModal {
  private readonly ref = inject<DialogRef<FurnitureParameterFormValue>>(DialogRef);
  private readonly fb = inject(FormBuilder);
  readonly data = inject<FurnitureParameterModalData>(DIALOG_DATA);
  readonly form = this.fb.nonNullable.group(
    {
      parameter: [this.data.parameter ?? 0, [Validators.required, Validators.min(1)]],
      minValue: [this.data.minValue ?? 0, Validators.required],
      maxValue: [this.data.maxValue ?? 0, Validators.required],
      defaultValue: [this.data.defaultValue ?? 0, Validators.required],
    },
    { validators: valueRange },
  );
  readonly searchParameter = (term: string, item: ParameterDTO): boolean => {
    const query = term.toLowerCase().trim();
    return [item.name, item.abbreviation, item.type, item.unit].some((value) =>
      value?.toLowerCase().includes(query),
    );
  };

  close(): void {
    this.ref.close();
  }
  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.ref.close(this.form.getRawValue());
  }
}
