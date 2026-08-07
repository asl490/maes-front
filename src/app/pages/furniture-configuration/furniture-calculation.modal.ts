import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { CalculatedMelaminePiece } from '../../core/api/generated/model/calculatedMelaminePiece';
import { FurnitureCalculationResponse } from '../../core/api/generated/model/furnitureCalculationResponse';
import { FurnitureParameterDTO } from '../../core/api/generated/model/furnitureParameterDTO';
import { ModalComponent } from '../../shared/modal/modal.component';
import { FurnitureConfigurationService } from './furniture-configuration.service';

export interface FurnitureCalculationModalData {
  furnitureId: number;
  furnitureName: string;
  parameters: FurnitureParameterDTO[];
}

@Component({
  selector: 'app-furniture-calculation-modal',
  imports: [ModalComponent],
  styleUrl: '../../shared/admin-feature.css',
  template: `<app-modal title="Probar cálculo">
    <div class="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
      <section>
        <p class="text-sm font-bold text-slate-900">Valores de entrada</p>
        <p class="mt-1 text-xs text-slate-500">{{ data.furnitureName }}</p>
        <div class="mt-4 space-y-4">
          @for (item of data.parameters; track item.id) {
            <div>
              <label class="mb-1.5 flex justify-between text-xs font-medium text-slate-600"
                ><span>{{ item.parameter?.name }}</span
                ><span
                  >{{ item.minValue }} – {{ item.maxValue }} {{ item.parameter?.unit || '' }}</span
                ></label
              ><input
                class="input w-full"
                type="number"
                [min]="item.minValue"
                [max]="item.maxValue"
                step="any"
                [value]="valueFor(item)"
                (input)="setValue(item, $event)"
              />
            </div>
          } @empty {
            <p class="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
              El mueble no tiene parámetros configurados.
            </p>
          }
        </div>
        <button
          class="btn-primary mt-5 w-full"
          (click)="calculate()"
          [disabled]="calculating() || !data.parameters.length"
        >
          {{ calculating() ? 'Calculando...' : 'Ejecutar cálculo' }}
        </button>
        @if (error()) {
          <p class="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {{ error() }}
          </p>
        }
      </section>
      <section class="min-h-80 min-w-0 rounded-2xl bg-slate-50 p-4">
        @if (!result() && !calculating()) {
          <div
            class="flex min-h-72 flex-col items-center justify-center text-center text-slate-400"
          >
            <span class="text-3xl">ƒ</span>
            <p class="mt-3 text-sm font-bold text-slate-600">Resultado del motor de fórmulas</p>
            <p class="mt-1 text-xs">Ejecuta el cálculo para validar dimensiones y variables.</p>
          </div>
        }
        @if (result(); as response) {
          <div class="space-y-6">
            <div>
              <h3 class="text-sm font-black text-slate-900">
                Piezas de Melamina{{ thicknessLabel(response) }}
              </h3>
              <div class="mt-2 overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table class="w-full min-w-[850px] text-xs">
                  <thead class="table-header">
                    <tr>
                      <th class="text-center">ID</th>
                      <th>Nombre</th>
                      <th>Categoría</th>
                      <th class="text-center">Largo</th>
                      <th class="text-center">Anchura</th>
                      <th class="text-center">Cantidad</th>
                      <th class="text-center">Veta</th>
                      <th class="text-center">L1</th>
                      <th class="text-center">L2</th>
                      <th class="text-center">D1</th>
                      <th class="text-center">D2</th>
                      <th class="text-center">Aux 1</th>
                      <th class="text-center">Aux 2</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (
                      piece of melaminePieces(response);
                      track piece.templateId;
                      let index = $index
                    ) {
                      <tr class="table-row">
                        <td class="text-center">{{ piece.templateId ?? index + 1 }}</td>
                        <td>{{ piece.pieceName || '—' }}</td>
                        <td>{{ piece.category || '—' }}</td>
                        <td class="text-center font-bold text-red-700">{{ piece.length }}</td>
                        <td class="text-center font-bold text-red-700">{{ piece.width }}</td>
                        <td class="text-center font-bold">{{ piece.quantity }}</td>
                        <td class="text-center">{{ piece.hasGrain ? 'Sí' : 'No' }}</td>
                        <td class="text-center">{{ piece.edgeL1 || '' }}</td>
                        <td class="text-center">{{ piece.edgeL2 || '' }}</td>
                        <td class="text-center">{{ piece.edgeA1 || '' }}</td>
                        <td class="text-center">{{ piece.edgeA2 || '' }}</td>
                        <td class="text-center">{{ piece.auxiliaryValue1 ?? '' }}</td>
                        <td class="text-center">{{ piece.auxiliaryValue2 ?? '' }}</td>
                      </tr>
                    } @empty {
                      <tr>
                        <td colspan="13" class="py-6 text-center text-slate-500">
                          No se calcularon piezas de melamina.
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
            @if (mdfPieces(response).length) {
              <div>
                <h3 class="text-sm font-black text-slate-900">Piezas de MDF (Fondo)</h3>
                <div class="mt-2 overflow-x-auto rounded-xl border border-slate-200 bg-white">
                  <table class="w-full min-w-[550px] text-xs">
                    <thead class="table-header">
                      <tr>
                        <th class="text-center">ID</th>
                        <th>Nombre</th>
                        <th>Categoría</th>
                        <th class="text-center">Largo</th>
                        <th class="text-center">Anchura</th>
                        <th class="text-center">Cantidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (
                        piece of mdfPieces(response);
                        track piece.templateId;
                        let index = $index
                      ) {
                        <tr class="table-row">
                          <td class="text-center">{{ piece.templateId ?? index + 1 }}</td>
                          <td>{{ piece.pieceName || '—' }}</td>
                          <td>{{ piece.category || '—' }}</td>
                          <td class="text-center font-bold text-red-700">{{ piece.length }}</td>
                          <td class="text-center font-bold text-red-700">{{ piece.width }}</td>
                          <td class="text-center font-bold">{{ piece.quantity }}</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }
            <div>
              <h3 class="text-sm font-black text-slate-900">Lista de Accesorios y Quincallería</h3>
              <div class="mt-2 overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table class="w-full min-w-[550px] text-xs">
                  <thead class="table-header">
                    <tr>
                      <th class="text-center">Ítem</th>
                      <th>Descripción del material</th>
                      <th class="text-center">Cantidad</th>
                      <th>Unidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (
                      article of response.complementaryArticles;
                      track article.articleId;
                      let index = $index
                    ) {
                      <tr class="table-row">
                        <td class="text-center">{{ index + 1 }}</td>
                        <td>{{ article.name }}</td>
                        <td class="text-center font-bold text-red-700">{{ article.quantity }}</td>
                        <td>{{ article.unit || '—' }}</td>
                      </tr>
                    } @empty {
                      <tr>
                        <td colspan="4" class="py-6 text-center text-slate-500">Sin accesorios.</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        }
      </section>
    </div>
    <div modal-footer class="modal-footer">
      <button class="btn-secondary" (click)="close()">Cerrar</button>
    </div></app-modal
  >`,
})
export class FurnitureCalculationModal {
  private readonly ref = inject<DialogRef<void>>(DialogRef);
  private readonly management = inject(FurnitureConfigurationService);
  readonly data = inject<FurnitureCalculationModalData>(DIALOG_DATA);
  readonly calculating = signal(false);
  readonly error = signal('');
  readonly result = signal<FurnitureCalculationResponse | null>(null);
  private readonly values = new Map<number, number>(
    this.data.parameters.filter((i) => i.id).map((i) => [i.id!, i.defaultValue ?? i.minValue ?? 0]),
  );
  valueFor(item: FurnitureParameterDTO): number {
    return item.id ? (this.values.get(item.id) ?? 0) : 0;
  }
  setValue(item: FurnitureParameterDTO, event: Event): void {
    if (item.id) this.values.set(item.id, Number((event.target as HTMLInputElement).value));
  }
  calculate(): void {
    const invalid = this.data.parameters.find((i) => {
      const v = i.id ? this.values.get(i.id) : undefined;
      return v === undefined || v < (i.minValue ?? -Infinity) || v > (i.maxValue ?? Infinity);
    });
    if (invalid) {
      this.error.set(
        `${invalid.parameter?.name ?? 'El valor'} debe estar dentro del rango permitido.`,
      );
      return;
    }
    this.calculating.set(true);
    this.error.set('');
    this.result.set(null);
    this.management
      .calculate({
        furniture: this.data.furnitureId,
        values: this.data.parameters
          .filter((i) => i.id)
          .map((i) => ({ furnitureParameter: i.id!, value: this.values.get(i.id!)! })),
      })
      .pipe(finalize(() => this.calculating.set(false)))
      .subscribe({
        next: (r) => this.result.set(r),
        error: (e) => this.error.set(this.errorMessage(e)),
      });
  }
  melaminePieces(r: FurnitureCalculationResponse): CalculatedMelaminePiece[] {
    return (r.melaminePieces ?? []).filter((p) => !this.isMdf(p));
  }
  mdfPieces(r: FurnitureCalculationResponse): CalculatedMelaminePiece[] {
    return (r.melaminePieces ?? []).filter((p) => this.isMdf(p));
  }
  thicknessLabel(r: FurnitureCalculationResponse): string {
    const entry = Object.entries(r.constants ?? {}).find(([key]) =>
      ['MELAMINE_THICKNESS', 'ESPESOR_MELAMINA', 'MELAMINE_WIDTH'].includes(key.toUpperCase()),
    );
    return entry ? ` (${entry[1]} mm)` : '';
  }
  close(): void {
    this.ref.close();
  }
  private isMdf(p: CalculatedMelaminePiece): boolean {
    return [p.description, p.category, p.pieceName].some((v) => /MDF|FONDO/i.test(v ?? ''));
  }
  private errorMessage(e: unknown): string {
    if (e instanceof HttpErrorResponse) {
      if (e.status === 0) return 'No se pudo conectar con el servidor.';
      if (typeof e.error?.message === 'string') return e.error.message;
    }
    return 'El motor no pudo evaluar la configuración. Revisa las fórmulas y variables.';
  }
}
