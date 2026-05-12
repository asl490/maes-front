import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FurnitureModel, FurnitureType, FURNITURE_MODELS } from '../../models/demo-selection.model';

@Component({
  selector: 'app-step-model',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-model.component.html',
  styleUrls: ['./step-model.component.css'],
})
export class StepModelComponent implements OnChanges {
  @Input() furnitureType: FurnitureType | null = null;
  @Input() selectedModel: FurnitureModel | null = null;
  @Output() modelSelected = new EventEmitter<FurnitureModel>();
  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  filteredModels: FurnitureModel[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['furnitureType'] && this.furnitureType) {
      this.filteredModels = FURNITURE_MODELS.filter(
        (m) => m.furnitureTypeId === this.furnitureType!.id
      );
    }
  }

  selectModel(model: FurnitureModel): void {
    this.modelSelected.emit(model);
  }

  onNext(): void {
    if (this.selectedModel) this.next.emit();
  }

  onBack(): void {
    this.back.emit();
  }
}
