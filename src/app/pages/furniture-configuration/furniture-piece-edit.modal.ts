import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from '../../shared/modal/modal.component';
import { FormulaInput, FormulaVariable } from './formula-input';

export interface FurniturePieceFormValue {
  description?: string;
  category: string;
  pieceName: string;
  quantity: number;
  hasGrain: boolean;
  edgeL1?: string;
  edgeL2?: string;
  edgeA1?: string;
  edgeA2?: string;
  lengthFormula: string;
  widthFormula: string;
  auxiliaryFormula1?: string;
  auxiliaryFormula2?: string;
}
export interface FurniturePieceModalData extends Partial<FurniturePieceFormValue> {
  mode: 'create' | 'edit';
  variables: FormulaVariable[];
}

@Component({
  selector: 'app-furniture-piece-edit-modal',
  imports: [ReactiveFormsModule, ModalComponent, FormulaInput],
  styleUrl: '../../shared/admin-feature.css',
  template: `<app-modal [title]="data.mode === 'create' ? 'Agregar pieza' : 'Editar pieza'">
    <form [formGroup]="form" class="grid gap-4 sm:grid-cols-2" (ngSubmit)="save()">
      <div>
        <label class="mb-1.5 block text-xs font-medium text-muted">Nombre de pieza *</label
        ><input class="input w-full" formControlName="pieceName" placeholder="Lateral izquierdo" />
      </div>
      <div>
        <label class="mb-1.5 block text-xs font-medium text-muted">Categoría *</label
        ><input class="input w-full" formControlName="category" placeholder="ESTRUCTURA" />
      </div>
      <div>
        <label class="mb-1.5 block text-xs font-medium text-muted">Cantidad *</label
        ><input class="input w-full" type="number" min="1" step="1" formControlName="quantity" />
      </div>
      <label
        class="flex items-center gap-3 self-end rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
        ><input type="checkbox" formControlName="hasGrain" />La pieza tiene sentido de veta</label
      >
      <div>
        <label class="mb-1.5 block text-xs font-medium text-muted">Fórmula de largo *</label
        ><app-formula-input
          formControlName="lengthFormula"
          [variables]="data.variables"
          placeholder="HEIGHT - DOOR_GAP"
        />
      </div>
      <div>
        <label class="mb-1.5 block text-xs font-medium text-muted">Fórmula de ancho *</label
        ><app-formula-input
          formControlName="widthFormula"
          [variables]="data.variables"
          placeholder="DEPTH"
        />
      </div>
      <div>
        <label class="mb-1.5 block text-xs font-medium text-muted"
          >Detalle de corte auxiliar 1</label
        ><input
          class="input w-full"
          formControlName="auxiliaryFormula1"
          placeholder="Indicaciones para el corte"
        />
      </div>
      <div>
        <label class="mb-1.5 block text-xs font-medium text-muted"
          >Detalle de corte auxiliar 2</label
        ><input
          class="input w-full"
          formControlName="auxiliaryFormula2"
          placeholder="Detalle adicional"
        />
      </div>
      @if (formulaError()) {
        <p class="sm:col-span-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
          {{ formulaError() }}
        </p>
      }
      <div class="sm:col-span-2">
        <label class="mb-1.5 block text-xs font-medium text-muted">Descripción</label
        ><textarea class="input min-h-20 w-full" formControlName="description"></textarea>
      </div>
      <div class="sm:col-span-2">
        <p class="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          Tapacantos por lado
        </p>
        <p class="mb-3 text-xs text-slate-500">Vacío = sin tapacanto · D = delgado · G = grueso</p>
        <div class="grid gap-3 sm:grid-cols-4">
          <label class="text-xs font-medium text-slate-600"
            >L1<select class="input mt-1 w-full" formControlName="edgeL1">
              <option value="">Vacío</option>
              <option value="D">D · Delgado</option>
              <option value="G">G · Grueso</option>
            </select></label
          >
          <label class="text-xs font-medium text-slate-600"
            >L2<select class="input mt-1 w-full" formControlName="edgeL2">
              <option value="">Vacío</option>
              <option value="D">D · Delgado</option>
              <option value="G">G · Grueso</option>
            </select></label
          >
          <label class="text-xs font-medium text-slate-600"
            >D1<select class="input mt-1 w-full" formControlName="edgeA1">
              <option value="">Vacío</option>
              <option value="D">D · Delgado</option>
              <option value="G">G · Grueso</option>
            </select></label
          >
          <label class="text-xs font-medium text-slate-600"
            >D2<select class="input mt-1 w-full" formControlName="edgeA2">
              <option value="">Vacío</option>
              <option value="D">D · Delgado</option>
              <option value="G">G · Grueso</option>
            </select></label
          >
        </div>
      </div>
    </form>
    <div modal-footer class="modal-footer">
      <button class="btn-secondary" (click)="close()">Cancelar</button
      ><button class="btn-primary" (click)="save()" [disabled]="form.invalid">Guardar pieza</button>
    </div></app-modal
  >`,
})
export class FurniturePieceEditModal {
  private readonly ref = inject<DialogRef<FurniturePieceFormValue>>(DialogRef);
  private readonly fb = inject(FormBuilder);
  readonly data = inject<FurniturePieceModalData>(DIALOG_DATA);
  readonly form = this.fb.nonNullable.group({
    pieceName: [this.data.pieceName ?? '', Validators.required],
    category: [this.data.category ?? '', Validators.required],
    quantity: [
      this.data.quantity ?? 1,
      [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)],
    ],
    hasGrain: [this.data.hasGrain ?? false],
    lengthFormula: [(this.data.lengthFormula ?? '').toUpperCase(), Validators.required],
    widthFormula: [(this.data.widthFormula ?? '').toUpperCase(), Validators.required],
    auxiliaryFormula1: [this.data.auxiliaryFormula1 ?? ''],
    auxiliaryFormula2: [this.data.auxiliaryFormula2 ?? ''],
    description: [this.data.description ?? ''],
    edgeL1: [(this.data.edgeL1 ?? '').toUpperCase(), Validators.pattern(/^[DG]?$/)],
    edgeL2: [(this.data.edgeL2 ?? '').toUpperCase(), Validators.pattern(/^[DG]?$/)],
    edgeA1: [(this.data.edgeA1 ?? '').toUpperCase(), Validators.pattern(/^[DG]?$/)],
    edgeA2: [(this.data.edgeA2 ?? '').toUpperCase(), Validators.pattern(/^[DG]?$/)],
  });
  formulaError(): string {
    const known = new Set(this.data.variables.map((v) => v.symbol.toUpperCase()));
    for (const name of ['lengthFormula', 'widthFormula'] as const) {
      const formula = this.form.controls[name].value;
      const tokens = formula.match(/[A-Za-z_][A-Za-z0-9_]*/g) ?? [];
      const unknown = tokens.find((token) => !known.has(token.toUpperCase()));
      if (unknown)
        return `La variable ${unknown} no pertenece a los parámetros ni a las constantes efectivas del mueble o su categoría.`;
    }
    return '';
  }
  close(): void {
    this.ref.close();
  }
  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.formulaError()) return;
    const v = this.form.getRawValue();
    this.ref.close({
      ...v,
      pieceName: v.pieceName.trim(),
      category: v.category.trim().toUpperCase(),
      lengthFormula: v.lengthFormula.trim().toUpperCase(),
      widthFormula: v.widthFormula.trim().toUpperCase(),
      description: v.description.trim() || undefined,
      auxiliaryFormula1: v.auxiliaryFormula1.trim() || undefined,
      auxiliaryFormula2: v.auxiliaryFormula2.trim() || undefined,
      edgeL1: v.edgeL1.trim().toUpperCase() || undefined,
      edgeL2: v.edgeL2.trim().toUpperCase() || undefined,
      edgeA1: v.edgeA1.trim().toUpperCase() || undefined,
      edgeA2: v.edgeA2.trim().toUpperCase() || undefined,
    });
  }
}
