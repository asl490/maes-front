import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MelaminaColor, MELAMINA_COLORS } from '../../models/demo-selection.model';

type ColorCategory = 'Neutros' | 'Madera' | 'Colores';

@Component({
  selector: 'app-step-color',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-color.component.html',
  styleUrls: ['./step-color.component.css'],
})
export class StepColorComponent {
  @Input() selectedColor: MelaminaColor | null = null;
  @Output() colorSelected = new EventEmitter<MelaminaColor>();
  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  categories: ColorCategory[] = ['Neutros', 'Madera', 'Colores'];
  allColors = MELAMINA_COLORS;

  getColorsByCategory(category: ColorCategory): MelaminaColor[] {
    return this.allColors.filter((c) => c.category === category);
  }

  selectColor(color: MelaminaColor): void {
    this.colorSelected.emit(color);
  }

  onNext(): void {
    if (this.selectedColor) this.next.emit();
  }

  onBack(): void {
    this.back.emit();
  }
}
