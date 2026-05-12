import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DemoDimensions, FurnitureType } from '../../models/demo-selection.model';

interface DimensionField {
  key: keyof DemoDimensions;
  label: string;
  placeholder: string;
  icon: string;
  hint: string;
}

@Component({
  selector: 'app-step-dimensions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step-dimensions.component.html',
  styleUrls: ['./step-dimensions.component.css'],
})
export class StepDimensionsComponent {
  @Input() furnitureType: FurnitureType | null = null;
  @Input() dimensions: DemoDimensions = { width: null, height: null, depth: null };
  @Output() dimensionsChanged = new EventEmitter<DemoDimensions>();
  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  dimensionFields: DimensionField[] = [
    { key: 'width',  label: 'Ancho',       placeholder: 'Ej: 180', icon: '↔️', hint: 'Medida horizontal del espacio disponible' },
    { key: 'height', label: 'Alto',        placeholder: 'Ej: 240', icon: '↕️', hint: 'Desde el piso hasta donde llegará el mueble' },
    { key: 'depth',  label: 'Profundidad', placeholder: 'Ej: 60',  icon: '↗️', hint: 'Cuánto espacio ocupará hacia adentro de la pared' },
  ];

  isComplete(): boolean {
    return (
      this.dimensions.width !== null && this.dimensions.width > 0 &&
      this.dimensions.height !== null && this.dimensions.height > 0 &&
      this.dimensions.depth !== null && this.dimensions.depth > 0
    );
  }

  getVolume(): string {
    if (!this.isComplete()) return '0';
    const v = this.dimensions.width! * this.dimensions.height! * this.dimensions.depth!;
    return v.toLocaleString('es-PE');
  }

  onDimensionChange(): void {
    this.dimensionsChanged.emit({ ...this.dimensions });
  }

  onNext(): void {
    if (this.isComplete()) this.next.emit();
  }

  onBack(): void {
    this.back.emit();
  }
}
