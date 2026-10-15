import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { finalize, switchMap } from 'rxjs';
import { FurnitureCalculationResponse } from '../../../../core/api/generated/model/furnitureCalculationResponse';
import { FurnitureParameterDTO } from '../../../../core/api/generated/model/furnitureParameterDTO';
import { FurnitureConfigurationService } from '../../../furniture-configuration/furniture-configuration.service';
import { DemoSelection } from '../../models/demo-selection.model';

@Component({
  selector: 'app-step-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-summary.component.html',
  styleUrls: ['./step-summary.component.css'],
})
export class StepSummaryComponent {
  private readonly furnitureConfiguration = inject(FurnitureConfigurationService);
  @Input() selection!: DemoSelection;
  @Input() furnitureId: number | null = null;
  @Output() reset = new EventEmitter<void>();

  showDespiece = false;
  calculating = false;
  calculationError = '';
  despieceMelamina: any[] = [];
  despieceMdf: any[] = [];
  materialesExtra: any[] = [];

  get modelPreviewUrls(): string[] {
    const { model, color } = this.selection;
    if (model?.id === 'ropero-2p' && color && color.available !== false) {
      return [
        `/furniture/models/r_clasico_${color.id}_r.webp`,
        `/furniture/models/r_clasico_${color.id}_s.webp`,
        `/furniture/models/r_clasico_${color.id}_c.webp`,
      ];
    }
    return model?.imageUrl ? [model.imageUrl.startsWith('/') ? model.imageUrl : `/${model.imageUrl}`] : [];
  }

  get whatsappUrl(): string {
    const { furnitureType, model, color, dimensions } = this.selection;
    const msg = encodeURIComponent(
      `Hola, me interesa cotizar un mueble con Maes IA:\n\n` +
        `🪑 Tipo: ${furnitureType?.name}\n📐 Modelo: ${model?.name}\n🎨 Color: ${color?.name}\n` +
        `📏 Medidas: ${dimensions.width}mm × ${dimensions.height}mm × ${dimensions.depth}mm\n\n` +
        `Por favor, ¿pueden enviarme la cotización?`,
    );
    return `https://wa.me/51914497074?text=${msg}`;
  }

  onReset(): void { this.reset.emit(); }

  generarDespiece(): void {
    if (!this.furnitureId) {
      this.calculationError = 'No se pudo identificar el mueble seleccionado.';
      return;
    }
    this.calculating = true;
    this.calculationError = '';
    this.showDespiece = false;
    this.furnitureConfiguration.listParameters(this.furnitureId).pipe(
      switchMap((parameters) => this.furnitureConfiguration.calculate({
        furniture: this.furnitureId!,
        values: parameters.filter((parameter) => parameter.id).map((parameter) => ({
          furnitureParameter: parameter.id!,
          value: this.valueForParameter(parameter),
        })),
      })),
      finalize(() => this.calculating = false),
    ).subscribe({
      next: (response) => this.applyCalculation(response),
      error: (error) => this.calculationError = this.errorMessage(error),
    });
  }

  private valueForParameter(parameter: FurnitureParameterDTO): number {
    const key = this.normalize(`${parameter.parameter?.abbreviation ?? ''} ${parameter.parameter?.name ?? ''}`);
    if (/^(w|ancho|width)( |$)/.test(key) || key.includes(' ancho')) return this.selection.dimensions.width!;
    if (/^(h|alto|altura|height)( |$)/.test(key) || key.includes(' alto') || key.includes(' altura')) return this.selection.dimensions.height!;
    if (/^(d|profundidad|depth)( |$)/.test(key) || key.includes(' profundidad')) return this.selection.dimensions.depth!;
    return parameter.defaultValue ?? parameter.minValue ?? 0;
  }

  private applyCalculation(response: FurnitureCalculationResponse): void {
    const pieces = (response.melaminePieces ?? []).map((piece, index) => ({
      id: piece.templateId ?? index + 1,
      descripcion: piece.description || this.selection.color?.name || '',
      color: this.selection.color?.name || '',
      categoria: piece.category || piece.pieceName || '',
      largo: piece.length,
      anchura: piece.width,
      cantidad: piece.quantity,
      veta: piece.hasGrain ? 'Sí' : 'No',
      l1: piece.edgeL1 || '', l2: piece.edgeL2 || '',
      d1: piece.edgeA1 || '', d2: piece.edgeA2 || '',
      aux1: piece.auxiliaryValue1 ?? '', aux2: piece.auxiliaryValue2 ?? '',
    }));
    this.despieceMdf = pieces.filter((piece) => /mdf|fondo/i.test(`${piece.descripcion} ${piece.categoria}`));
    this.despieceMelamina = pieces.filter((piece) => !this.despieceMdf.includes(piece));
    this.materialesExtra = (response.complementaryArticles ?? []).map((article) => ({
      descripcion: article.name || article.code || 'Accesorio',
      cantidad: article.quantity,
      unidad: article.unit || '',
    }));
    this.showDespiece = true;
  }

  private normalize(value: string): string {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
  }

  private errorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) return 'No se pudo conectar con el servidor de cálculo.';
      if (typeof error.error?.message === 'string') return error.error.message;
    }
    return 'No se pudo generar el despiece. Revisa la configuración y las medidas del mueble.';
  }
}
