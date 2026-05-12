import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FurnitureType, FURNITURE_TYPES } from '../../models/demo-selection.model';

@Component({
  selector: 'app-step-furniture-type',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-furniture-type.component.html',
  styleUrls: ['./step-furniture-type.component.css'],
})
export class StepFurnitureTypeComponent {
  @Input() selectedType: FurnitureType | null = null;
  @Output() typeSelected = new EventEmitter<FurnitureType>();
  @Output() next = new EventEmitter<void>();

  furnitureTypes = FURNITURE_TYPES;

  selectType(type: FurnitureType): void {
    this.typeSelected.emit(type);
  }

  onNext(): void {
    if (this.selectedType) {
      this.next.emit();
    }
  }
}
