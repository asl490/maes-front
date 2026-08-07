import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from '../../shared/modal/modal.component';
export interface ParameterFormValue {
  name: string;
  description?: string;
  abbreviation: string;
  type?: string;
  unit?: string;
}
export interface ParameterModalData extends Partial<ParameterFormValue> {
  mode: 'create' | 'edit';
}
@Component({
  selector: 'app-parameter-edit-modal',
  imports: [ReactiveFormsModule, ModalComponent],
  styleUrl: '../../shared/admin-feature.css',
  template: `<app-modal [title]="data.mode === 'create' ? 'Crear parámetro' : 'Editar parámetro'"
    ><form [formGroup]="form" class="grid gap-4 sm:grid-cols-2" (ngSubmit)="save()">
      <div>
        <label class="mb-1.5 block text-xs font-medium text-muted">Nombre *</label
        ><input class="input" formControlName="name" />
      </div>
      <div>
        <label class="mb-1.5 block text-xs font-medium text-muted">Abreviatura *</label
        ><input class="input" formControlName="abbreviation" placeholder="ALT" />
      </div>
      <div>
        <label class="mb-1.5 block text-xs font-medium text-muted">Tipo</label
        ><input
          class="input"
          formControlName="type"
          list="parameter-types"
          placeholder="NUMBER"
        /><datalist id="parameter-types">
          <option value="NUMBER"></option>
          <option value="TEXT"></option>
          <option value="BOOLEAN"></option>
        </datalist>
      </div>
      <div>
        <label class="mb-1.5 block text-xs font-medium text-muted">Unidad</label
        ><input class="input" formControlName="unit" placeholder="mm, cm, kg..." />
      </div>
      <div class="sm:col-span-2">
        <label class="mb-1.5 block text-xs font-medium text-muted">Descripción</label
        ><textarea class="input min-h-24" formControlName="description"></textarea>
      </div>
    </form>
    <div modal-footer class="modal-footer">
      <button class="btn-secondary" (click)="close()">Cancelar</button
      ><button class="btn-primary" (click)="save()" [disabled]="form.invalid">
        {{ data.mode === 'create' ? 'Crear parámetro' : 'Guardar cambios' }}
      </button>
    </div></app-modal
  >`,
})
export class ParameterEditModal {
  private readonly ref = inject<DialogRef<ParameterFormValue>>(DialogRef);
  private readonly fb = inject(FormBuilder);
  readonly data = inject<ParameterModalData>(DIALOG_DATA);
  readonly form = this.fb.nonNullable.group({
    name: [this.data.name ?? '', Validators.required],
    abbreviation: [this.data.abbreviation ?? '', Validators.required],
    description: [this.data.description ?? ''],
    type: [this.data.type ?? ''],
    unit: [this.data.unit ?? ''],
  });
  close() {
    this.ref.close();
  }
  save() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    this.ref.close({
      name: v.name.trim(),
      abbreviation: v.abbreviation.trim(),
      description: v.description.trim() || undefined,
      type: v.type.trim() || undefined,
      unit: v.unit.trim() || undefined,
    });
  }
}
