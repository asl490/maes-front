import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DemoSelection } from '../../models/demo-selection.model';

@Component({
  selector: 'app-step-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-summary.component.html',
  styleUrls: ['./step-summary.component.css'],
})
export class StepSummaryComponent {
  @Input() selection!: DemoSelection;
  @Output() reset = new EventEmitter<void>();

  get whatsappUrl(): string {
    const { furnitureType, model, color, dimensions } = this.selection;
    const msg = encodeURIComponent(
      `Hola, me interesa cotizar un mueble con Maes IA:\n\n` +
        `🪑 Tipo: ${furnitureType?.name}\n` +
        `📐 Modelo: ${model?.name}\n` +
        `🎨 Color: ${color?.name}\n` +
        `📏 Medidas: ${dimensions.width}mm × ${dimensions.height}mm × ${dimensions.depth}mm\n\n` +
        `Por favor, ¿pueden enviarme la cotización?`,
    );
    return `https://wa.me/51914497074?text=${msg}`;
  }

  onReset(): void {
    this.reset.emit();
  }

  // --- LÓGICA DE DESPIECE ---
  showDespiece = false;
  despieceMelamina: any[] = [];
  despieceMdf: any[] = [];

  generarDespiece(): void {
    if (this.selection.model?.id !== 'ropero-2p') {
      return;
    }

    const W = this.selection.dimensions.width || 0;
    const H = this.selection.dimensions.height || 0;
    const D = this.selection.dimensions.depth || 0;

    // Constantes
    const ESPESOR_MELAMINA = 18;
    const ZOCALO_ALTURA = 100;

    // Fórmulas de Ancho
    const anchoAmarre = W - ESPESOR_MELAMINA * 2;
    const anchoZocalo = W - ESPESOR_MELAMINA * 2;
    const anchoMdf = W - 1;
    const anchoPuerta = W - 8;

    // Fórmulas de Largo (provisionales, coinciden con la muestra)
    // El usuario proveerá las reales posteriormente
    const largoLateralTecho = 400;
    const largoLateralCuerpo = 1854;
    const largoPuertaSuperior = 401;
    const largoPuertaCuerpo = 1837;
    const largoMdfSuperior = 399;
    const largoMdfCuerpo = 1853;

    this.despieceMelamina = [
      {
        id: 1,
        descripcion: 'Panela',
        color: 'Cuerpo',
        categoria: 'Lateral',
        largo: largoLateralCuerpo + ZOCALO_ALTURA,
        anchura: D,
        cantidad: 2,
        veta: 'si',
        l1: 'D',
        l2: '',
        d1: 'D',
        d2: 'D',
        aux1: '',
        aux2: '',
      },
      {
        id: 2,
        descripcion: 'Panela',
        color: 'Cuerpo',
        categoria: 'Amarre',
        largo: W - 2 * ESPESOR_MELAMINA,
        anchura: D,
        cantidad: 5,
        veta: 'si',
        l1: 'D',
        l2: '',
        d1: '',
        d2: '',
        aux1: '',
        aux2: '',
      },
      {
        id: 3,
        descripcion: 'Panela',
        color: 'Zocalo',
        categoria: 'Zocalo',
        largo: W - 2 * ESPESOR_MELAMINA,
        anchura: ZOCALO_ALTURA,
        cantidad: 2,
        veta: 'si',
        l1: 'D',
        l2: '',
        d1: '',
        d2: '',
        aux1: '',
        aux2: '',
      },
      {
        id: 4,
        descripcion: 'Panela',
        color: 'Techo',
        categoria: 'Lateral',
        largo: H - (largoLateralCuerpo + ZOCALO_ALTURA),
        anchura: D,
        cantidad: 2,
        veta: 'si',
        l1: 'D',
        l2: '',
        d1: 'D',
        d2: 'D',
        aux1: '',
        aux2: '',
      },
      {
        id: 5,
        descripcion: 'Panela',
        color: 'Techo',
        categoria: 'Amarre',
        largo: W - 2 * ESPESOR_MELAMINA,
        anchura: D,
        cantidad: 1,
        veta: 'si',
        l1: 'D',
        l2: '',
        d1: '',
        d2: '',
        aux1: '',
        aux2: '',
      },
      {
        id: 6,
        descripcion: 'Panela',
        color: 'Puerta',
        categoria: 'Superior',
        largo: H - largoLateralCuerpo - ZOCALO_ALTURA - 8 + ESPESOR_MELAMINA / 2,
        anchura: W - 8,
        cantidad: 1,
        veta: 'si',
        l1: 'G',
        l2: 'G',
        d1: 'G',
        d2: 'G',
        aux1: '',
        aux2: 'BIS2HL',
      },
      {
        id: 7,
        descripcion: 'Panela',
        color: 'Puerta',
        categoria: 'Cuerpo',
        largo: largoLateralCuerpo - 8 - ESPESOR_MELAMINA / 2,
        anchura: W - 8,
        cantidad: 1,
        veta: 'si',
        l1: 'G',
        l2: 'G',
        d1: 'G',
        d2: 'G',
        aux1: '',
        aux2: 'BIS3HL',
      },
    ];

    this.despieceMdf = [
      {
        id: 1,
        descripcion: 'MDF',
        color: 'Superior',
        categoria: '',
        pieza: '',
        largo: largoMdfSuperior,
        anchura: anchoMdf,
        cantidad: 1,
        veta: '',
        l1: '',
        l2: '',
        d1: '',
        d2: '',
        aux1: '',
        aux2: '',
      },
      {
        id: 2,
        descripcion: 'MDF',
        color: 'Cuerpo',
        categoria: '',
        pieza: '',
        largo: largoMdfCuerpo,
        anchura: anchoMdf,
        cantidad: 1,
        veta: '',
        l1: '',
        l2: '',
        d1: '',
        d2: '',
        aux1: '',
        aux2: '',
      },
    ];

    this.showDespiece = true;
  }
}
