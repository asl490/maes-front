import { Component, inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from '../../shared/modal/modal.component';

export interface UserModalData {
  mode: 'create' | 'edit';
  username?: string;
  roles?: string[];
}

export interface UserFormValue {
  username: string;
  password?: string;
  roleNames: string[];
}

@Component({
  selector: 'app-user-edit-modal',
  imports: [ReactiveFormsModule, ModalComponent],
  styleUrl: '../../shared/admin-feature.css',
  template: `
    <app-modal [title]="data.mode === 'create' ? 'Crear usuario' : 'Editar usuario'">
      <form [formGroup]="form" class="space-y-4" (ngSubmit)="save()">
        <div>
          <label class="block text-xs font-medium mb-1.5 text-muted">Usuario</label>
          <input type="text" formControlName="username" autocomplete="off" class="input" />
        </div>
        <div>
          <label class="block text-xs font-medium mb-1.5 text-muted">
            Contraseña {{ data.mode === 'edit' ? '(opcional)' : '' }}
          </label>
          <input type="password" formControlName="password" autocomplete="new-password" class="input" />
          @if (data.mode === 'edit') {
            <p class="mt-1 text-xs text-faint">Déjala vacía para conservar la contraseña actual.</p>
          }
        </div>
        <div>
          <label class="block text-xs font-medium mb-1.5 text-muted">Roles</label>
          <input type="text" formControlName="roles" placeholder="ADMIN, USER" class="input" />
          <p class="mt-1 text-xs text-faint">Separa varios roles con comas.</p>
        </div>
      </form>

      <div modal-footer class="modal-footer">
        <button type="button" (click)="close()" class="btn-secondary">Cancelar</button>
        <button type="button" (click)="save()" class="btn-primary" [disabled]="form.invalid">
          {{ data.mode === 'create' ? 'Crear usuario' : 'Guardar cambios' }}
        </button>
      </div>
    </app-modal>
  `,
})
export class UserEditModal {
  private readonly ref = inject<DialogRef<UserFormValue>>(DialogRef);
  readonly data = inject<UserModalData>(DIALOG_DATA);
  private readonly formBuilder = inject(FormBuilder);

  readonly form = this.formBuilder.nonNullable.group({
    username: [this.data.username ?? '', Validators.required],
    password: ['', this.data.mode === 'create' ? [Validators.required, Validators.minLength(6)] : []],
    roles: [(this.data.roles ?? []).join(', ')],
  });

  close(): void {
    this.ref.close();
  }

  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    this.ref.close({
      username: value.username.trim(),
      password: value.password.trim() || undefined,
      roleNames: value.roles.split(',').map((role) => role.trim()).filter(Boolean),
    });
  }
}
