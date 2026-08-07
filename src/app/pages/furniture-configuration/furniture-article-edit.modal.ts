import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComplementaryArticleDTO } from '../../core/api/generated/model/complementaryArticleDTO';
import { ModalComponent } from '../../shared/modal/modal.component';
import { NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';

export interface FurnitureArticleFormValue {
  complementaryArticle: number;
  quantity: number;
}
export interface FurnitureArticleModalData extends Partial<FurnitureArticleFormValue> {
  mode: 'create' | 'edit';
  articles: ComplementaryArticleDTO[];
}

@Component({
  selector: 'app-furniture-article-edit-modal',
  imports: [ReactiveFormsModule, ModalComponent, NgSelectComponent, NgOptionTemplateDirective],
  styleUrl: '../../shared/admin-feature.css',
  template: `<app-modal [title]="data.mode === 'create' ? 'Agregar accesorio' : 'Editar accesorio'">
    <form [formGroup]="form" class="space-y-5" (ngSubmit)="save()">
      <div>
        <label class="mb-1.5 block text-xs font-medium text-muted">Artículo complementario *</label
        ><ng-select
          class="maes-select"
          formControlName="complementaryArticle"
          [items]="data.articles"
          bindValue="id"
          bindLabel="name"
          placeholder="Buscar artículo por nombre o código"
          notFoundText="No se encontraron artículos"
          [clearable]="false"
          [searchFn]="searchArticle"
          [popover]="true"
        >
          <ng-template ng-option-tmp let-item="item"
            ><div class="py-1">
              <p class="text-sm font-bold text-slate-800">{{ item.name }}</p>
              <p class="text-xs text-slate-500">
                {{ item.code || 'Sin código' }} · {{ item.unit || 'Sin unidad' }}
              </p>
            </div></ng-template
          >
        </ng-select>
        @if (!data.articles.length && data.mode === 'create') {
          <p class="mt-2 text-xs text-amber-700">
            No hay artículos activos disponibles para asociar.
          </p>
        }
      </div>
      <div>
        <label class="mb-1.5 block text-xs font-medium text-muted">Cantidad fija *</label>
        <div class="flex items-center gap-3">
          <input
            class="input w-full"
            type="number"
            min="0.000001"
            step="any"
            formControlName="quantity"
          /><span class="min-w-16 text-sm font-medium text-slate-500">{{ selectedUnit() }}</span>
        </div>
        <p class="mt-1.5 text-xs text-slate-500">El contrato actual admite cantidades fijas.</p>
      </div>
    </form>
    <div modal-footer class="modal-footer">
      <button class="btn-secondary" (click)="close()">Cancelar</button
      ><button
        class="btn-primary"
        (click)="save()"
        [disabled]="form.invalid || !data.articles.length"
      >
        Guardar accesorio
      </button>
    </div></app-modal
  >`,
})
export class FurnitureArticleEditModal {
  private readonly ref = inject<DialogRef<FurnitureArticleFormValue>>(DialogRef);
  private readonly fb = inject(FormBuilder);
  readonly data = inject<FurnitureArticleModalData>(DIALOG_DATA);
  readonly form = this.fb.nonNullable.group({
    complementaryArticle: [
      this.data.complementaryArticle ?? 0,
      [Validators.required, Validators.min(1)],
    ],
    quantity: [this.data.quantity ?? 1, [Validators.required, Validators.min(0.000001)]],
  });
  readonly searchArticle = (term: string, item: ComplementaryArticleDTO): boolean => {
    const query = term.toLowerCase().trim();
    return [item.name, item.code, item.description, item.unit].some((value) =>
      value?.toLowerCase().includes(query),
    );
  };
  selectedUnit(): string {
    return (
      this.data.articles.find((item) => item.id === this.form.controls.complementaryArticle.value)
        ?.unit || 'unidades'
    );
  }
  close(): void {
    this.ref.close();
  }
  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.ref.close(this.form.getRawValue());
  }
}
