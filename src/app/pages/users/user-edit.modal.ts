import { Component, inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ModalComponent } from '../../shared/modal/modal.component';

@Component({
  selector: 'app-user-edit-modal',
  imports: [ReactiveFormsModule, ModalComponent],
  template: `
    <app-modal title="Edit User">

      <form [formGroup]="form" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium mb-1.5 text-muted">First Name</label>
            <input type="text" formControlName="firstName" class="input" />
          </div>
          <div>
            <label class="block text-xs font-medium mb-1.5 text-muted">Last Name</label>
            <input type="text" formControlName="lastName" class="input" />
          </div>
        </div>
        <div>
          <label class="block text-xs font-medium mb-1.5 text-muted">Email</label>
          <input type="email" formControlName="email" class="input" />
        </div>
        <div>
          <label class="block text-xs font-medium mb-1.5 text-muted">Role</label>
          <select formControlName="role" class="input">
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
            <option value="Viewer">Viewer</option>
          </select>
        </div>
      </form>

      <div modal-footer class="modal-footer">
        <button (click)="close()" class="btn-secondary">Cancel</button>
        <button (click)="save()" class="btn-primary">Save Changes</button>
      </div>

    </app-modal>
  `,
})
export class UserEditModal {
  private ref = inject(DialogRef);
  data = inject(DIALOG_DATA);

  form = inject(FormBuilder).group({
    firstName: [this.data?.name?.split(' ')[0] ?? '', Validators.required],
    lastName:  [this.data?.name?.split(' ')[1] ?? '', Validators.required],
    email:     [this.data?.email ?? '', [Validators.required, Validators.email]],
    role:      [this.data?.role ?? 'Viewer'],
  });

  close() { this.ref.close(); }
  save()  { if (this.form.valid) this.ref.close(this.form.value); }
}
