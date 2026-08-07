import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from '../../shared/modal/modal.component';

export interface SystemConstantFormValue { name: string; abbreviation: string; description?: string; type?: string; value?: string; }
export interface SystemConstantModalData extends Partial<SystemConstantFormValue> { mode: 'create' | 'edit'; }

@Component({
  selector: 'app-system-constant-edit-modal',
  imports: [ReactiveFormsModule, ModalComponent],
  styleUrl: '../../shared/admin-feature.css',
  template: `
    <app-modal [title]="data.mode === 'create' ? 'Crear constante del sistema' : 'Editar constante del sistema'">
      <form [formGroup]="form" class="grid gap-4 sm:grid-cols-2" (ngSubmit)="save()">
        <div><label class="mb-1.5 block text-xs font-medium text-muted">Nombre *</label><input class="input" formControlName="name" /></div>
        <div><label class="mb-1.5 block text-xs font-medium text-muted">Abreviatura *</label><input class="input" formControlName="abbreviation" /></div>
        <div><label class="mb-1.5 block text-xs font-medium text-muted">Tipo</label><input class="input" formControlName="type" placeholder="Ej. NUMBER" /></div>
        <div><label class="mb-1.5 block text-xs font-medium text-muted">Valor</label><input class="input" formControlName="value" /></div>
        <div class="sm:col-span-2"><label class="mb-1.5 block text-xs font-medium text-muted">Descripción</label><textarea class="input min-h-24 resize-y" formControlName="description"></textarea></div>
      </form>
      <div modal-footer class="modal-footer"><button class="btn-secondary" type="button" (click)="close()">Cancelar</button><button class="btn-primary" type="button" (click)="save()" [disabled]="form.invalid">{{ data.mode === 'create' ? 'Crear constante' : 'Guardar cambios' }}</button></div>
    </app-modal>
  `,
})
export class SystemConstantEditModal {
  private readonly ref = inject<DialogRef<SystemConstantFormValue>>(DialogRef);
  private readonly formBuilder = inject(FormBuilder);
  readonly data = inject<SystemConstantModalData>(DIALOG_DATA);
  readonly form = this.formBuilder.nonNullable.group({
    name: [this.data.name ?? '', Validators.required], abbreviation: [this.data.abbreviation ?? '', Validators.required],
    type: [this.data.type ?? ''], value: [this.data.value ?? ''], description: [this.data.description ?? ''],
  });
  close(): void { this.ref.close(); }
  save(): void {
    this.form.markAllAsTouched(); if (this.form.invalid) return;
    const value = this.form.getRawValue();
    this.ref.close({ name: value.name.trim(), abbreviation: value.abbreviation.trim(), type: value.type.trim() || undefined, value: value.value.trim() || undefined, description: value.description.trim() || undefined });
  }
}
