import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from '../../shared/modal/modal.component';

export interface PersonFormValue {
  name: string;
  lastName: string;
  dni: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
}

export interface PersonModalData extends Partial<PersonFormValue> {
  mode: 'create' | 'edit';
}

@Component({
  selector: 'app-person-edit-modal',
  imports: [ReactiveFormsModule, ModalComponent],
  styleUrl: '../../shared/admin-feature.css',
  template: `
    <app-modal [title]="data.mode === 'create' ? 'Crear persona' : 'Editar persona'">
      <form [formGroup]="form" class="grid gap-4 sm:grid-cols-2" (ngSubmit)="save()">
        <div><label class="mb-1.5 block text-xs font-medium text-muted">Nombres *</label><input class="input" formControlName="name" autocomplete="given-name" /></div>
        <div><label class="mb-1.5 block text-xs font-medium text-muted">Apellidos *</label><input class="input" formControlName="lastName" autocomplete="family-name" /></div>
        <div><label class="mb-1.5 block text-xs font-medium text-muted">DNI *</label><input class="input" formControlName="dni" inputmode="numeric" maxlength="20" /></div>
        <div><label class="mb-1.5 block text-xs font-medium text-muted">Teléfono</label><input class="input" formControlName="phoneNumber" autocomplete="tel" /></div>
        <div class="sm:col-span-2"><label class="mb-1.5 block text-xs font-medium text-muted">Correo</label><input class="input" type="email" formControlName="email" autocomplete="email" /></div>
        <div class="sm:col-span-2"><label class="mb-1.5 block text-xs font-medium text-muted">Dirección</label><input class="input" formControlName="address" autocomplete="street-address" /></div>
      </form>
      <div modal-footer class="modal-footer">
        <button class="btn-secondary" type="button" (click)="close()">Cancelar</button>
        <button class="btn-primary" type="button" (click)="save()" [disabled]="form.invalid">{{ data.mode === 'create' ? 'Crear persona' : 'Guardar cambios' }}</button>
      </div>
    </app-modal>
  `,
})
export class PersonEditModal {
  private readonly ref = inject<DialogRef<PersonFormValue>>(DialogRef);
  private readonly formBuilder = inject(FormBuilder);
  readonly data = inject<PersonModalData>(DIALOG_DATA);
  readonly form = this.formBuilder.nonNullable.group({
    name: [this.data.name ?? '', Validators.required],
    lastName: [this.data.lastName ?? '', Validators.required],
    dni: [this.data.dni ?? '', Validators.required],
    address: [this.data.address ?? ''],
    phoneNumber: [this.data.phoneNumber ?? ''],
    email: [this.data.email ?? '', Validators.email],
  });

  close(): void { this.ref.close(); }

  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    this.ref.close({
      name: value.name.trim(), lastName: value.lastName.trim(), dni: value.dni.trim(),
      address: value.address.trim() || undefined, phoneNumber: value.phoneNumber.trim() || undefined,
      email: value.email.trim() || undefined,
    });
  }
}
