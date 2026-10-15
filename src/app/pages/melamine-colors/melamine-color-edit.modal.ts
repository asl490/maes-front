import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from '../../shared/modal/modal.component';
import { MelamineColorPayload } from './melamine-colors.service';

export interface MelamineColorFormValue extends MelamineColorPayload { thumbnail?: File; texture?: File; }
export interface MelamineColorModalData extends Partial<MelamineColorFormValue> { mode: 'create' | 'edit'; thumbnailUrl?: string; textureUrl?: string; }

@Component({ selector: 'app-melamine-color-edit-modal', imports: [ReactiveFormsModule, ModalComponent], styleUrl: '../../shared/admin-feature.css', template: `
<app-modal [title]="data.mode === 'create' ? 'Crear melamina' : 'Editar melamina'"><form [formGroup]="form" class="grid gap-4 sm:grid-cols-2">
  <div><label class="mb-1.5 block text-xs font-medium text-muted">Código *</label><input class="input uppercase" formControlName="code" maxlength="30" /></div>
  <div><label class="mb-1.5 block text-xs font-medium text-muted">Nombre *</label><input class="input" formControlName="name" maxlength="120" /></div>
  <div><label class="mb-1.5 block text-xs font-medium text-muted">Marca *</label><input class="input" formControlName="brand" maxlength="120" /></div>
  <div><label class="mb-1.5 block text-xs font-medium text-muted">Estado</label><select class="input" formControlName="status"><option value="ACTIVE">Activo</option><option value="INACTIVE">Inactivo</option></select></div>
  <div class="sm:col-span-2"><label class="mb-1.5 block text-xs font-medium text-muted">Color de referencia *</label><div class="flex gap-3"><input type="color" formControlName="hexColor" class="h-11 w-16 rounded-lg border border-slate-200 bg-white p-1" /><input class="input uppercase" formControlName="hexColor" maxlength="7" /></div></div>
  <div><label class="mb-1.5 block text-xs font-medium text-muted">Miniatura</label>@if (thumbnailPreview()) {<img [src]="thumbnailPreview()" class="mb-2 h-28 w-full rounded-xl object-cover" alt="Miniatura" />}<input class="input" type="file" accept="image/jpeg,image/png,image/webp" (change)="selectFile($event, 'thumbnail')" /><p class="mt-1 text-xs text-muted">Para tarjetas y selectores.</p></div>
  <div><label class="mb-1.5 block text-xs font-medium text-muted">Textura</label>@if (texturePreview()) {<img [src]="texturePreview()" class="mb-2 h-28 w-full rounded-xl object-cover" alt="Textura" />}<input class="input" type="file" accept="image/jpeg,image/png,image/webp" (change)="selectFile($event, 'texture')" /><p class="mt-1 text-xs text-muted">Imagen repetible y de buena resolución.</p></div>
  @if (fileError()) {<p class="sm:col-span-2 text-xs text-red-600">{{ fileError() }}</p>}
</form><div modal-footer class="modal-footer"><button class="btn-secondary" type="button" (click)="close()">Cancelar</button><button class="btn-primary" type="button" (click)="save()" [disabled]="form.invalid">{{ data.mode === 'create' ? 'Crear melamina' : 'Guardar cambios' }}</button></div></app-modal>` })
export class MelamineColorEditModal {
  private readonly ref = inject<DialogRef<MelamineColorFormValue>>(DialogRef); private readonly fb = inject(FormBuilder); readonly data = inject<MelamineColorModalData>(DIALOG_DATA);
  readonly thumbnailPreview = signal(this.data.thumbnailUrl ?? ''); readonly texturePreview = signal(this.data.textureUrl ?? ''); readonly fileError = signal('');
  private thumbnail?: File; private texture?: File;
  readonly form = this.fb.nonNullable.group({ code: [this.data.code ?? '', [Validators.required, Validators.pattern(/^[A-Za-z0-9_-]+$/)]], name: [this.data.name ?? '', Validators.required], brand: [this.data.brand ?? '', Validators.required], hexColor: [this.data.hexColor ?? '#FFFFFF', [Validators.required, Validators.pattern(/^#[0-9A-Fa-f]{6}$/)]], status: [this.data.status ?? 'ACTIVE', Validators.required] });
  close(): void { this.ref.close(); }
  selectFile(event: Event, target: 'thumbnail' | 'texture'): void { const file = (event.target as HTMLInputElement).files?.[0]; this.fileError.set(''); if (!file) return; if (!['image/jpeg','image/png','image/webp'].includes(file.type)) { this.fileError.set('Solo se permiten imágenes JPG, PNG o WebP.'); return; } if (file.size > 10 * 1024 * 1024) { this.fileError.set('La imagen no puede superar los 10 MB.'); return; } const reader = new FileReader(); reader.onload = () => target === 'thumbnail' ? this.thumbnailPreview.set(String(reader.result)) : this.texturePreview.set(String(reader.result)); reader.readAsDataURL(file); if (target === 'thumbnail') this.thumbnail = file; else this.texture = file; }
  save(): void { this.form.markAllAsTouched(); if (this.form.invalid || this.fileError()) return; const v = this.form.getRawValue(); this.ref.close({ code: v.code.trim().toUpperCase(), name: v.name.trim(), brand: v.brand.trim(), hexColor: v.hexColor.toUpperCase(), status: v.status, thumbnail: this.thumbnail, texture: this.texture }); }
}
