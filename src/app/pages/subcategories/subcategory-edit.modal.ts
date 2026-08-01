import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryDTO } from '../../core/api/generated/model/categoryDTO';
import { ModalComponent } from '../../shared/modal/modal.component';

export interface SubcategoryFormValue { category: number; name: string; description?: string; status: string; }
export interface SubcategoryModalData extends Partial<SubcategoryFormValue> { mode: 'create' | 'edit'; categories: CategoryDTO[]; }

@Component({
  selector: 'app-subcategory-edit-modal', imports: [ReactiveFormsModule, ModalComponent], styleUrl: '../../shared/admin-feature.css',
  template: `
    <app-modal [title]="data.mode === 'create' ? 'Crear subcategoría' : 'Editar subcategoría'">
      <form [formGroup]="form" class="space-y-4" (ngSubmit)="save()">
        <div><label class="mb-1.5 block text-xs font-medium text-muted">Categoría *</label><select class="input" formControlName="category"><option [ngValue]="0" disabled>Selecciona una categoría</option>@for (category of data.categories; track category.id) {<option [ngValue]="category.id">{{ category.name }}</option>}</select></div>
        <div><label class="mb-1.5 block text-xs font-medium text-muted">Nombre *</label><input class="input" formControlName="name" /></div>
        <div><label class="mb-1.5 block text-xs font-medium text-muted">Descripción</label><textarea class="input min-h-24 resize-y" formControlName="description"></textarea></div>
        <div><label class="mb-1.5 block text-xs font-medium text-muted">Estado</label><select class="input" formControlName="status"><option value="ACTIVE">Activa</option><option value="INACTIVE">Inactiva</option></select></div>
      </form>
      <div modal-footer class="modal-footer"><button class="btn-secondary" type="button" (click)="close()">Cancelar</button><button class="btn-primary" type="button" (click)="save()" [disabled]="form.invalid">{{ data.mode === 'create' ? 'Crear subcategoría' : 'Guardar cambios' }}</button></div>
    </app-modal>
  `,
})
export class SubcategoryEditModal {
  private readonly ref = inject<DialogRef<SubcategoryFormValue>>(DialogRef);
  private readonly formBuilder = inject(FormBuilder);
  readonly data = inject<SubcategoryModalData>(DIALOG_DATA);
  readonly form = this.formBuilder.nonNullable.group({
    category: [this.data.category ?? 0, Validators.min(1)], name: [this.data.name ?? '', Validators.required],
    description: [this.data.description ?? ''], status: [this.data.status ?? 'ACTIVE', Validators.required],
  });
  close(): void { this.ref.close(); }
  save(): void {
    this.form.markAllAsTouched(); if (this.form.invalid) return;
    const value = this.form.getRawValue(); this.ref.close({ ...value, name: value.name.trim(), description: value.description.trim() || undefined });
  }
}
