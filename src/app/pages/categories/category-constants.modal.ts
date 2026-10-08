import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { CategoryConstantsService } from '../../core/api/generated/api/categoryConstants.service';
import { CategoryConstantDTO } from '../../core/api/generated/model/categoryConstantDTO';
import { AlertService } from '../../shared/alert/alert.service';
import { Loading } from '../../shared/loading/loading';
import { ModalComponent } from '../../shared/modal/modal.component';

interface CategoryConstantsModalData { categoryId: number; categoryName: string; }

@Component({
  selector: 'app-category-constants-modal',
  imports: [ReactiveFormsModule, ModalComponent, Loading],
  styleUrl: '../../shared/admin-feature.css',
  template: `<app-modal [title]="'Constantes de ' + data.categoryName">
    <p class="mb-4 text-sm text-slate-500">Estos valores serán heredados por todos los muebles de la categoría.</p>
    @if (loading()) { <app-loading message="Cargando constantes..." /> } @else {
      <div class="mb-5 max-h-64 divide-y divide-slate-100 overflow-y-auto rounded-xl border border-slate-200">
        @for (item of constants(); track item.id) {
          <div class="flex items-center justify-between gap-3 p-3">
            <div><p class="font-semibold text-slate-900">{{ item.name }}</p><p class="text-xs text-slate-500"><code>{{ item.symbol }}</code> · {{ item.value }} {{ item.unit || '' }}</p></div>
            <div class="flex gap-1"><button class="btn-action-info" type="button" (click)="edit(item)">Editar</button><button class="btn-action-danger" type="button" (click)="remove(item)">Quitar</button></div>
          </div>
        } @empty { <p class="p-5 text-center text-sm text-slate-500">No hay constantes configuradas.</p> }
      </div>
      <form [formGroup]="form" class="grid gap-3 sm:grid-cols-2" (ngSubmit)="save()">
        <input class="input" formControlName="name" placeholder="Nombre *" />
        <input class="input uppercase" formControlName="symbol" placeholder="SÍMBOLO *" />
        <input class="input" type="number" step="any" formControlName="value" placeholder="Valor *" />
        <input class="input" formControlName="unit" placeholder="Unidad" />
        <textarea class="input sm:col-span-2" formControlName="description" placeholder="Descripción"></textarea>
        @if (symbolError()) { <p class="sm:col-span-2 text-xs font-medium text-red-700">{{ symbolError() }}</p> }
      </form>
    }
    <div modal-footer class="modal-footer"><button class="btn-secondary" type="button" (click)="close()">Cerrar</button><button class="btn-primary" type="button" (click)="save()" [disabled]="saving() || loading()">{{ editingId() ? 'Guardar cambios' : 'Agregar constante' }}</button></div>
  </app-modal>`,
})
export class CategoryConstantsModal {
  private readonly ref = inject<DialogRef<void>>(DialogRef);
  private readonly api = inject(CategoryConstantsService);
  private readonly alert = inject(AlertService);
  private readonly fb = inject(FormBuilder);
  readonly data = inject<CategoryConstantsModalData>(DIALOG_DATA);
  readonly constants = signal<CategoryConstantDTO[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly editingId = signal<number | null>(null);
  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    symbol: ['', [Validators.required, Validators.pattern(/^[A-Za-z][A-Za-z0-9_]*$/)]],
    value: [0, Validators.required], unit: ['', Validators.maxLength(30)], description: ['', Validators.maxLength(500)],
  });
  constructor() { this.load(); }
  close(): void { this.ref.close(); }
  edit(item: CategoryConstantDTO): void { this.editingId.set(item.id ?? null); this.form.reset({ name: item.name ?? '', symbol: item.symbol ?? '', value: item.value ?? 0, unit: item.unit ?? '', description: item.description ?? '' }); }
  symbolError(): string { const c = this.form.controls.symbol; const symbol = c.value.trim().toUpperCase(); if (!c.touched) return ''; if (c.invalid) return 'El símbolo debe iniciar con una letra y usar solo letras, números o guion bajo.'; if (this.constants().some(x => x.id !== this.editingId() && x.symbol?.toUpperCase() === symbol)) return 'Ya existe una constante con este símbolo.'; return ''; }
  save(): void {
    this.form.markAllAsTouched(); if (this.form.invalid || this.symbolError()) return;
    const raw = this.form.getRawValue(); const payload = { category: this.data.categoryId, name: raw.name.trim(), symbol: raw.symbol.trim().toUpperCase(), value: raw.value, unit: raw.unit.trim() || undefined, description: raw.description.trim() || undefined };
    const id = this.editingId(); this.saving.set(true);
    (id ? this.api.categoryConstantUpdate(id, payload) : this.api.categoryConstantCreate(payload)).pipe(finalize(() => this.saving.set(false))).subscribe({ next: () => { this.alert.success(id ? 'Constante actualizada' : 'Constante agregada'); this.reset(); this.load(); }, error: e => this.showError(e) });
  }
  async remove(item: CategoryConstantDTO): Promise<void> { if (!item.id || !(await this.alert.confirmDelete(item.name ?? 'Sin nombre', 'la constante de categoría'))) return; this.saving.set(true); this.api.categoryConstantDelete(item.id).pipe(finalize(() => this.saving.set(false))).subscribe({ next: () => { this.alert.success('Constante eliminada'); this.load(); }, error: e => this.showError(e) }); }
  private reset(): void { this.editingId.set(null); this.form.reset({ name: '', symbol: '', value: 0, unit: '', description: '' }); }
  private load(): void { this.loading.set(true); this.api.categoryConstantGetAllByCategoryId(this.data.categoryId).pipe(finalize(() => this.loading.set(false))).subscribe({ next: v => this.constants.set(v), error: e => this.showError(e) }); }
  private showError(error: unknown): void { const message = error instanceof HttpErrorResponse && typeof error.error?.message === 'string' ? error.error.message : 'No se pudo completar la operación.'; this.alert.error(message); }
}
