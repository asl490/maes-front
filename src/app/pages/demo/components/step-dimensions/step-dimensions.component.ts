import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DemoDimensions, FurnitureModel, FurnitureType } from '../../models/demo-selection.model';

interface DimensionField {
  key: keyof DemoDimensions;
  label: string;
  placeholder: string;
  icon: string;
  hint: string;
  min: number;
  max: number;
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
  @Input() selectedModel: FurnitureModel | null = null;
  @Input() dimensions: DemoDimensions = { width: null, height: null, depth: null };
  @Output() dimensionsChanged = new EventEmitter<DemoDimensions>();
  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  dimensionFields: DimensionField[] = [
    {
      key: 'width',
      label: 'Ancho',
      placeholder: 'Ej: 500',
      icon: '↔️',
      hint: 'Medida horizontal del espacio disponible',
      min: 350,
      max: 600,
    },
    {
      key: 'height',
      label: 'Alto',
      placeholder: 'Ej: 2400',
      icon: '↕️',
      hint: 'Desde el piso hasta donde llegará el mueble',
      min: 2200,
      max: 2600,
    },
    {
      key: 'depth',
      label: 'Profundidad',
      placeholder: 'Ej: 500',
      icon: '↗️',
      hint: 'Cuánto espacio ocupará hacia adentro de la pared',
      min: 400,
      max: 650,
    },
  ];

  isFieldValid(field: DimensionField): boolean {
    const val = this.dimensions[field.key];
    if (val === null || val === undefined) return true; // not invalid if empty
    return val >= field.min && val <= field.max;
  }

  isComplete(): boolean {
    const wOk =
      this.dimensions.width !== null &&
      this.dimensions.width >= this.dimensionFields[0].min &&
      this.dimensions.width <= this.dimensionFields[0].max;
    const hOk =
      this.dimensions.height !== null &&
      this.dimensions.height >= this.dimensionFields[1].min &&
      this.dimensions.height <= this.dimensionFields[1].max;
    const dOk =
      this.dimensions.depth !== null &&
      this.dimensions.depth >= this.dimensionFields[2].min &&
      this.dimensions.depth <= this.dimensionFields[2].max;
    return wOk && hOk && dOk;
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
