import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DemoDimensions, FurnitureType, FurnitureModel } from '../../models/demo-selection.model';

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
export class StepDimensionsComponent implements OnChanges {
  @Input() furnitureType: FurnitureType | null = null;
  @Input() selectedModel: FurnitureModel | null = null;
  @Input() dimensions: DemoDimensions = { width: null, height: null, depth: null };
  @Output() dimensionsChanged = new EventEmitter<DemoDimensions>();
  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  dimensionFields: DimensionField[] = [
    { key: 'width',  label: 'Ancho',       placeholder: 'Ej: 1800', icon: '↔️', hint: 'Medida horizontal del espacio disponible', min: 1, max: 5000 },
    { key: 'height', label: 'Alto',        placeholder: 'Ej: 2400', icon: '↕️', hint: 'Desde el piso hasta donde llegará el mueble', min: 1, max: 5000 },
    { key: 'depth',  label: 'Profundidad', placeholder: 'Ej: 600',  icon: '↗️', hint: 'Cuánto espacio ocupará hacia adentro de la pared', min: 1, max: 5000 },
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedModel'] && this.selectedModel) {
      if (this.selectedModel.id === 'ropero-2p') {
        // Límites específicos para ropero-2p
        this.dimensionFields[0].min = 350;
        this.dimensionFields[0].max = 600;
        this.dimensionFields[1].min = 2200;
        this.dimensionFields[1].max = 2600;
        this.dimensionFields[2].min = 400;
        this.dimensionFields[2].max = 650;
      } else {
        // Límites por defecto
        this.dimensionFields[0].min = 1;
        this.dimensionFields[0].max = 5000;
        this.dimensionFields[1].min = 1;
        this.dimensionFields[1].max = 5000;
        this.dimensionFields[2].min = 1;
        this.dimensionFields[2].max = 5000;
      }
    }
  }

  isComplete(): boolean {
    const wOk = this.dimensions.width !== null && this.dimensions.width >= this.dimensionFields[0].min && this.dimensions.width <= this.dimensionFields[0].max;
    const hOk = this.dimensions.height !== null && this.dimensions.height >= this.dimensionFields[1].min && this.dimensions.height <= this.dimensionFields[1].max;
    const dOk = this.dimensions.depth !== null && this.dimensions.depth >= this.dimensionFields[2].min && this.dimensions.depth <= this.dimensionFields[2].max;
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
