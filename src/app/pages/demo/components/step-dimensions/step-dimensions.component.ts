import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FurnitureParameterDTO } from '../../../../core/api/generated/model/furnitureParameterDTO';
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
  private _selectedModel: FurnitureModel | null = null;
  
  @Input() set selectedModel(model: FurnitureModel | null) {
    this._selectedModel = model;
  }
  get selectedModel(): FurnitureModel | null {
    return this._selectedModel;
  }

  get modelImageUrl(): string {
    if (this._selectedModel?.id === 'ropero-2p') {
      return '/furniture/models/r_clasico_plano.webp';
    }
    if (this._selectedModel?.imageUrl) {
      return this._selectedModel.imageUrl.startsWith('/') 
        ? this._selectedModel.imageUrl 
        : '/' + this._selectedModel.imageUrl;
    }
    return '/furniture/models/r_clasico.webp'; // Fallback final
  }

  @Input() dimensions: DemoDimensions = { width: null, height: null, depth: null };
  @Input() parameters: FurnitureParameterDTO[] | null = null;
  @Input() parametersLoading = false;
  @Input() parametersError = '';
  @Output() dimensionsChanged = new EventEmitter<DemoDimensions>();
  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  private readonly defaultDimensionFields: DimensionField[] = [
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

  get dimensionFields(): DimensionField[] {
    if (!this.parameters?.length) return this.defaultDimensionFields;
    return this.defaultDimensionFields.map((field) => {
      const parameter = this.findDimensionParameter(field.key);
      if (!parameter) return field;
      return {
        ...field,
        placeholder: parameter.defaultValue !== undefined ? `Ej: ${parameter.defaultValue}` : field.placeholder,
        min: parameter.minValue ?? 0,
        max: parameter.maxValue ?? Number.MAX_SAFE_INTEGER,
      };
    });
  }

  isFieldValid(field: DimensionField): boolean {
    const val = this.dimensions[field.key];
    if (val === null || val === undefined) return true; // not invalid if empty
    return val >= field.min && val <= field.max;
  }

  isComplete(): boolean {
    if (this.parametersLoading || this.parametersError) return false;
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

  onDimensionChange(): void {
    this.dimensionsChanged.emit({ ...this.dimensions });
  }

  onNext(): void {
    if (this.isComplete()) this.next.emit();
  }

  onBack(): void {
    this.back.emit();
  }

  private findDimensionParameter(key: keyof DemoDimensions): FurnitureParameterDTO | undefined {
    const aliases: Record<keyof DemoDimensions, string[]> = {
      width: ['w', 'ancho', 'width'],
      height: ['h', 'alto', 'altura', 'height'],
      depth: ['d', 'profundidad', 'depth'],
    };
    return this.parameters?.find((parameter) => {
      const abbreviation = this.normalize(parameter.parameter?.abbreviation ?? '');
      const name = this.normalize(parameter.parameter?.name ?? '');
      return aliases[key].some((alias) => abbreviation === alias || name === alias || name.includes(alias));
    });
  }

  private normalize(value: string): string {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
  }
}
