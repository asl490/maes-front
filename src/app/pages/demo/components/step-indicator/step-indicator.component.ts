import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type WizardStep = 1 | 2 | 3 | 4;

@Component({
  selector: 'app-step-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-indicator.component.html',
  styleUrls: ['./step-indicator.component.css'],
})
export class StepIndicatorComponent {
  @Input() currentStep: WizardStep = 1;
  @Output() stepClicked = new EventEmitter<WizardStep>();

  steps = [
    { number: 1 as WizardStep, label: 'Tipo' },
    { number: 2 as WizardStep, label: 'Modelo' },
    { number: 3 as WizardStep, label: 'Color' },
    { number: 4 as WizardStep, label: 'Medidas' },
  ];

  onStepClick(step: WizardStep, event: Event): void {
    if (step < this.currentStep) {
      this.stepClicked.emit(step);
    }
  }
}
