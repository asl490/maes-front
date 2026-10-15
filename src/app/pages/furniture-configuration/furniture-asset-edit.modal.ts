import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from '../../shared/modal/modal.component';
import { FurnitureAssetUpload } from './furniture-assets.service';

@Component({
  selector: 'app-furniture-asset-edit-modal',
  imports: [ReactiveFormsModule, ModalComponent],
  styleUrl: '../../shared/admin-feature.css',
  template: `
    <app-modal title="Agregar imagen o plano">
      <form [formGroup]="form" class="grid gap-4 sm:grid-cols-2">
        <div class="sm:col-span-2"><label class="mb-1.5 block text-xs font-medium text-muted">Archivo *</label><input class="input" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" (change)="selectFile($event)" /><p class="mt-1 text-xs text-muted">JPG, PNG, WebP o PDF para planos. Máximo 10 MB.</p>@if (fileError()) { <p class="mt-1 text-xs text-red-600">{{ fileError() }}</p> }</div>
        <div><label class="mb-1.5 block text-xs font-medium text-muted">Tipo *</label><select class="input" formControlName="assetType"><option value="PRODUCT_IMAGE">Imagen del producto</option><option value="TECHNICAL_PLAN">Plano técnico</option><option value="ASSEMBLY_DIAGRAM">Diagrama de armado</option><option value="COLOR_MASK">Máscara de color</option></select></div>
        <div><label class="mb-1.5 block text-xs font-medium text-muted">Vista *</label><select class="input" formControlName="viewType"><option value="PERSPECTIVE">Perspectiva</option><option value="FRONT">Frontal</option><option value="BACK">Posterior</option><option value="LEFT">Lateral izquierda</option><option value="RIGHT">Lateral derecha</option><option value="TOP">Superior</option><option value="INTERIOR">Interior</option><option value="DETAIL">Detalle</option><option value="NONE">Sin vista</option></select></div>
        <div><label class="mb-1.5 block text-xs font-medium text-muted">Título</label><input class="input" formControlName="title" maxlength="150" /></div>
        <div><label class="mb-1.5 block text-xs font-medium text-muted">Orden</label><input class="input" type="number" min="0" formControlName="displayOrder" /></div>
        <div class="sm:col-span-2"><label class="mb-1.5 block text-xs font-medium text-muted">Descripción</label><textarea class="input min-h-20" formControlName="description" maxlength="500"></textarea></div>
        <label class="sm:col-span-2 flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" formControlName="isPrimary" /> Usar como principal para este tipo</label>
      </form>
      <div modal-footer class="modal-footer"><button class="btn-secondary" type="button" (click)="close()">Cancelar</button><button class="btn-primary" type="button" (click)="save()" [disabled]="form.invalid || !file">Subir archivo</button></div>
    </app-modal>
  `,
})
export class FurnitureAssetEditModal {
  private readonly ref = inject<DialogRef<FurnitureAssetUpload>>(DialogRef);
  private readonly fb = inject(FormBuilder);
  readonly data = inject(DIALOG_DATA, { optional: true });
  readonly fileError = signal('');
  file?: File;
  readonly form = this.fb.nonNullable.group({
    assetType: ['PRODUCT_IMAGE' as const, Validators.required],
    viewType: ['PERSPECTIVE' as const, Validators.required],
    displayOrder: [0, [Validators.required, Validators.min(0)]],
    title: [''], description: [''], isPrimary: [false],
  });

  selectFile(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.fileError.set('');
    if (!file) { this.file = undefined; return; }
    if (file.size > 10 * 1024 * 1024) { this.fileError.set('El archivo no puede superar los 10 MB.'); this.file = undefined; return; }
    if (!['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(file.type)) { this.fileError.set('Selecciona una imagen válida o un PDF.'); this.file = undefined; return; }
    this.file = file;
  }
  close(): void { this.ref.close(); }
  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || !this.file) return;
    const value = this.form.getRawValue();
    this.ref.close({ ...value, file: this.file, title: value.title.trim() || undefined, description: value.description.trim() || undefined });
  }
}
