import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubcategoryDTO } from '../../core/api/generated/model/subcategoryDTO';
import { ModalComponent } from '../../shared/modal/modal.component';

export interface FurnitureFormValue { subcategory: number; name: string; description?: string; status: string; basePrice?: number; note?: string; }
export interface FurnitureModalData extends Partial<FurnitureFormValue> { mode: 'create' | 'edit'; subcategories: SubcategoryDTO[]; }

@Component({ selector: 'app-furniture-edit-modal', imports: [ReactiveFormsModule, ModalComponent], styleUrl: '../../shared/admin-feature.css', template: `
  <app-modal [title]="data.mode === 'create' ? 'Crear mueble' : 'Editar mueble'"><form [formGroup]="form" class="grid gap-4 sm:grid-cols-2" (ngSubmit)="save()">
    <div class="sm:col-span-2"><label class="mb-1.5 block text-xs font-medium text-muted">Subcategoría *</label><select class="input" formControlName="subcategory"><option [ngValue]="0">Selecciona una subcategoría</option>@for (item of data.subcategories; track item.id) {<option [ngValue]="item.id">{{ item.category?.name }} · {{ item.name }}</option>}</select><p class="mt-1 text-xs text-muted">El SKU se generará automáticamente con la categoría seleccionada.</p></div>
    <div><label class="mb-1.5 block text-xs font-medium text-muted">Nombre *</label><input class="input" formControlName="name" /></div>
    <div><label class="mb-1.5 block text-xs font-medium text-muted">Precio base</label><input class="input" type="number" min="0" step="0.01" formControlName="basePrice" /></div><div><label class="mb-1.5 block text-xs font-medium text-muted">Estado</label><select class="input" formControlName="status"><option value="ACTIVE">Activo</option><option value="INACTIVE">Inactivo</option></select></div>
    <div class="sm:col-span-2"><label class="mb-1.5 block text-xs font-medium text-muted">Descripción</label><textarea class="input min-h-20" formControlName="description"></textarea></div><div class="sm:col-span-2"><label class="mb-1.5 block text-xs font-medium text-muted">Nota</label><textarea class="input min-h-20" formControlName="note"></textarea></div>
  </form><div modal-footer class="modal-footer"><button class="btn-secondary" type="button" (click)="close()">Cancelar</button><button class="btn-primary" type="button" (click)="save()" [disabled]="form.invalid">{{ data.mode === 'create' ? 'Crear mueble' : 'Guardar cambios' }}</button></div></app-modal>` })
export class FurnitureEditModal {
  private readonly ref = inject<DialogRef<FurnitureFormValue>>(DialogRef); private readonly fb = inject(FormBuilder); readonly data = inject<FurnitureModalData>(DIALOG_DATA);
  readonly form = this.fb.nonNullable.group({ subcategory: [this.data.subcategory ?? 0, Validators.min(1)], name: [this.data.name ?? '', Validators.required], description: [this.data.description ?? ''], status: [this.data.status ?? 'ACTIVE'], basePrice: [this.data.basePrice ?? 0, Validators.min(0)], note: [this.data.note ?? ''] });
  close(): void { this.ref.close(); }
  save(): void { this.form.markAllAsTouched(); if (this.form.invalid) return; const value = this.form.getRawValue(); this.ref.close({ subcategory: value.subcategory, name: value.name.trim(), description: value.description.trim() || undefined, status: value.status, basePrice: value.basePrice, note: value.note.trim() || undefined }); }
}
