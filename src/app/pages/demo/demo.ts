import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  DemoSelection,
  FurnitureType,
  FurnitureModel,
  MelaminaColor,
  DemoDimensions,
} from './models/demo-selection.model';

import { StepIndicatorComponent, WizardStep } from './components/step-indicator/step-indicator.component';
import { StepFurnitureTypeComponent } from './components/step-furniture-type/step-furniture-type.component';
import { StepModelComponent } from './components/step-model/step-model.component';
import { StepColorComponent } from './components/step-color/step-color.component';
import { StepDimensionsComponent } from './components/step-dimensions/step-dimensions.component';
import { StepSummaryComponent } from './components/step-summary/step-summary.component';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    StepIndicatorComponent,
    StepFurnitureTypeComponent,
    StepModelComponent,
    StepColorComponent,
    StepDimensionsComponent,
    StepSummaryComponent,
  ],
  templateUrl: './demo.html',
  styleUrls: ['./demo.css'],
})
export class Demo {
  // Estado del wizard
  currentStep = signal<WizardStep | 5>(1);
  isComplete = computed(() => this.currentStep() === 5);

  // Selecciones del usuario
  selection: DemoSelection = {
    furnitureType: null,
    model: null,
    color: null,
    dimensions: { width: null, height: null, depth: null },
  };

  // Getters para el step indicator (solo muestra steps 1-4)
  get indicatorStep(): WizardStep {
    const s = this.currentStep();
    return s >= 4 ? 4 : (s as WizardStep);
  }

  // Navegación
  goToStep(step: WizardStep): void {
    this.currentStep.set(step);
  }

  // Handlers de selección
  onTypeSelected(type: FurnitureType): void {
    this.selection.furnitureType = type;
    // Reset selecciones dependientes
    if (this.selection.model?.furnitureTypeId !== type.id) {
      this.selection.model = null;
    }
  }

  onModelSelected(model: FurnitureModel): void {
    this.selection.model = model;
  }

  onColorSelected(color: MelaminaColor): void {
    this.selection.color = color;
  }

  onDimensionsChanged(dims: DemoDimensions): void {
    this.selection.dimensions = dims;
  }

  // Avanzar steps
  nextStep(): void {
    const s = this.currentStep();
    if (s < 5) {
      this.currentStep.set((s + 1) as WizardStep | 5);
    }
  }

  prevStep(): void {
    const s = this.currentStep();
    if (s > 1) {
      this.currentStep.set((s - 1) as WizardStep);
    }
  }

  // Reiniciar
  resetWizard(): void {
    this.selection = {
      furnitureType: null,
      model: null,
      color: null,
      dimensions: { width: null, height: null, depth: null },
    };
    this.currentStep.set(1);
  }
}
