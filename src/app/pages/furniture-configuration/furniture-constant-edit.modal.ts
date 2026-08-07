import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from '../../shared/modal/modal.component';

export interface FurnitureConstantFormValue {
  name: string;
  symbol: string;
  value: number;
  unit?: string;
  description?: string;
}

export interface FurnitureConstantModalData extends Partial<FurnitureConstantFormValue> {
  mode: 'create' | 'edit';
  usedSymbols: string[];
}

@Component({
  selector: 'app-furniture-constant-edit-modal',
  imports: [ReactiveFormsModule, ModalComponent],
  styleUrl: '../../shared/admin-feature.css',
  template: `<app-modal [title]="data.mode === 'create' ? 'Agregar constante' : 'Editar constante'">
    <form [formGroup]="form" class="grid gap-4 sm:grid-cols-2" (ngSubmit)="save()">
      <div>
        <label class="mb-1.5 block text-xs font-medium text-muted">Nombre *</label
        ><input class="input w-full" formControlName="name" placeholder="Espesor de melamina" />
      </div>
      <div>
        <label class="mb-1.5 block text-xs font-medium text-muted">Símbolo *</label
        ><input
          class="input w-full uppercase"
          formControlName="symbol"
          placeholder="MELAMINE_THICKNESS"
        />
        <p class="mt-1.5 text-xs text-slate-500">Se utilizará posteriormente en las fórmulas.</p>
      </div>
      <div>
        <label class="mb-1.5 block text-xs font-medium text-muted">Valor *</label
        ><input class="input w-full" type="number" step="any" formControlName="value" />
      </div>
      <div>
        <label class="mb-1.5 block text-xs font-medium text-muted">Unidad</label
        ><input class="input w-full" formControlName="unit" placeholder="mm, cm, %, PEN..." />
      </div>
      <div class="sm:col-span-2">
        <label class="mb-1.5 block text-xs font-medium text-muted">Descripción</label
        ><textarea
          class="input min-h-24 w-full"
          formControlName="description"
          placeholder="Explica dónde se utiliza esta constante."
        ></textarea>
      </div>
      @if (symbolError()) {
        <p class="sm:col-span-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
          {{ symbolError() }}
        </p>
      }
    </form>
    <div modal-footer class="modal-footer">
      <button class="btn-secondary" (click)="close()">Cancelar</button
      ><button class="btn-primary" (click)="save()" [disabled]="form.invalid">
        Guardar constante
      </button>
    </div>
  </app-modal>`,
})
export class FurnitureConstantEditModal {
  private readonly ref = inject<DialogRef<FurnitureConstantFormValue>>(DialogRef);
  private readonly fb = inject(FormBuilder);
  readonly data = inject<FurnitureConstantModalData>(DIALOG_DATA);
  readonly form = this.fb.nonNullable.group({
    name: [this.data.name ?? '', [Validators.required, Validators.maxLength(100)]],
    symbol: [
      this.data.symbol ?? '',
      [Validators.required, Validators.pattern(/^[A-Za-z][A-Za-z0-9_]*$/)],
    ],
    value: [this.data.value ?? 0, Validators.required],
    unit: [this.data.unit ?? '', Validators.maxLength(30)],
    description: [this.data.description ?? '', Validators.maxLength(500)],
  });

  symbolError(): string {
    const control = this.form.controls.symbol;
    const symbol = control.value.trim().toUpperCase();
    if (!control.touched) return '';
    if (control.hasError('required')) return 'El símbolo es obligatorio.';
    if (control.hasError('pattern'))
      return 'Usa letras, números y guion bajo; debe iniciar con una letra.';
    if (this.data.usedSymbols.includes(symbol)) return 'Ya existe una constante con este símbolo.';
    return '';
  }

  close(): void {
    this.ref.close();
  }
  save(): void {
    this.form.markAllAsTouched();
    const value = this.form.getRawValue();
    const symbol = value.symbol.trim().toUpperCase();
    if (this.form.invalid || this.data.usedSymbols.includes(symbol)) return;
    this.ref.close({
      name: value.name.trim(),
      symbol,
      value: value.value,
      unit: value.unit.trim() || undefined,
      description: value.description.trim() || undefined,
    });
  }
}
