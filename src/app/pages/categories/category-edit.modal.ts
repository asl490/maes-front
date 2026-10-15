import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ModalComponent } from '../../shared/modal/modal.component';

export interface CategoryFormValue { code: string; name: string; description?: string; status: string; image?: File; }
export interface CategoryModalData extends Partial<CategoryFormValue> { mode: 'create' | 'edit'; imageUrl?: string; }

@Component({
  selector: 'app-category-edit-modal',
  imports: [ReactiveFormsModule, ModalComponent, LucideAngularModule],
  styleUrl: '../../shared/admin-feature.css',
  template: `
    <app-modal [title]="data.mode === 'create' ? 'Crear categoría' : 'Editar categoría'">
      <form [formGroup]="form" class="space-y-4" (ngSubmit)="save()">
        <div><label class="mb-1.5 block text-xs font-medium text-muted">Código *</label><input class="input uppercase" formControlName="code" maxlength="10" [readonly]="data.mode === 'edit'" /><p class="mt-1 text-xs text-muted">De 2 a 10 letras, números o guiones. Se usará en el SKU y no podrá modificarse.</p></div>
        <div><label class="mb-1.5 block text-xs font-medium text-muted">Nombre *</label><input class="input" formControlName="name" /></div>
        <div><label class="mb-1.5 block text-xs font-medium text-muted">Descripción</label><textarea class="input min-h-24 resize-y" formControlName="description"></textarea></div>
        <div>
          <label class="mb-1.5 block text-xs font-medium text-muted">Imagen</label>
          @if (previewUrl()) {
            <div class="mb-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-3">
              <img [src]="previewUrl()" alt="Vista previa completa de la imagen" class="mx-auto max-h-80 w-full object-contain" />
            </div>
          }
          <label class="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-5 text-center transition hover:border-red-400 hover:bg-red-50/40">
            <input class="sr-only" type="file" accept="image/jpeg,image/png,image/webp" (change)="selectImage($event)" />
            <span class="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition group-hover:text-red-600">
              <lucide-icon name="upload" [size]="20" />
            </span>
            <span class="mt-2 max-w-full truncate text-sm font-semibold text-slate-700">{{ selectedFileName() || (previewUrl() ? 'Cambiar imagen' : 'Seleccionar imagen') }}</span>
            <span class="mt-1 text-xs text-slate-500">{{ selectedFileName() ? 'Haz clic para seleccionar otro archivo' : 'Haz clic para buscar una imagen' }}</span>
          </label>
          <p class="mt-1 text-xs text-muted">JPG, PNG o WebP. Máximo 10 MB.</p>
          @if (imageError()) { <p class="mt-1 text-xs text-red-600">{{ imageError() }}</p> }
        </div>
        <div><label class="mb-1.5 block text-xs font-medium text-muted">Estado</label><select class="input" formControlName="status"><option value="ACTIVE">Activa</option><option value="INACTIVE">Inactiva</option></select></div>
      </form>
      <div modal-footer class="modal-footer"><button class="btn-secondary" type="button" (click)="close()">Cancelar</button><button class="btn-primary" type="button" (click)="save()" [disabled]="form.invalid">{{ data.mode === 'create' ? 'Crear categoría' : 'Guardar cambios' }}</button></div>
    </app-modal>
  `,
})
export class CategoryEditModal {
  private readonly ref = inject<DialogRef<CategoryFormValue>>(DialogRef);
  private readonly formBuilder = inject(FormBuilder);
  readonly data = inject<CategoryModalData>(DIALOG_DATA);
  readonly previewUrl = signal(this.data.imageUrl ?? '');
  readonly selectedFileName = signal('');
  readonly imageError = signal('');
  private image?: File;
  readonly form = this.formBuilder.nonNullable.group({
    code: [this.data.code ?? '', [Validators.required, Validators.pattern(/^[A-Za-z0-9-]{2,10}$/)]], name: [this.data.name ?? '', Validators.required], description: [this.data.description ?? ''], status: [this.data.status ?? 'ACTIVE', Validators.required],
  });
  close(): void { this.ref.close(); }
  selectImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.imageError.set('');
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      this.imageError.set('Selecciona una imagen JPG, PNG o WebP.'); this.selectedFileName.set(''); input.value = ''; return;
    }
    if (file.size > 10 * 1024 * 1024) {
      this.imageError.set('La imagen no puede superar los 10 MB.'); this.selectedFileName.set(''); input.value = ''; return;
    }
    this.image = file;
    this.selectedFileName.set(file.name);
    const reader = new FileReader();
    reader.onload = () => this.previewUrl.set(String(reader.result ?? ''));
    reader.readAsDataURL(file);
  }
  save(): void {
    this.form.markAllAsTouched(); if (this.form.invalid || this.imageError()) return;
    const value = this.form.getRawValue();
    this.ref.close({ code: value.code.trim().toUpperCase(), name: value.name.trim(), description: value.description.trim() || undefined, status: value.status, image: this.image });
  }
}
