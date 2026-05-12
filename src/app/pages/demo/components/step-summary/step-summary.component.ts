import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
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
      `📏 Medidas: ${dimensions.width}cm × ${dimensions.height}cm × ${dimensions.depth}cm\n\n` +
      `Por favor, ¿pueden enviarme la cotización?`
    );
    return `https://wa.me/51914497074?text=${msg}`;
  }

  onReset(): void {
    this.reset.emit();
  }
}
