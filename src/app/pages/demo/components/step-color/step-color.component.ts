import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FurnitureModel, MELAMINA_COLORS, MelaminaColor } from '../../models/demo-selection.model';

// type ColorCategory = 'Neutros' | 'Madera' | 'Colores';
type ColorCategory = 'Neutros' | 'Madera';

@Component({
  selector: 'app-step-color',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-color.component.html',
  styleUrls: ['./step-color.component.css'],
})
export class StepColorComponent {
  private _selectedColor: MelaminaColor | null = null;
  @Input()
  set selectedColor(value: MelaminaColor | null) {
    this._selectedColor = value;
    this.updatePreview();
  }
  get selectedColor(): MelaminaColor | null {
    return this._selectedColor;
  }

  private _selectedModel: FurnitureModel | null = null;
  @Input()
  set selectedModel(value: FurnitureModel | null) {
    this._selectedModel = value;
    this.updatePreview();
  }
  get selectedModel(): FurnitureModel | null {
    return this._selectedModel;
  }

  @Output() colorSelected = new EventEmitter<MelaminaColor>();
  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  // categories: ColorCategory[] = ['Neutros', 'Madera', 'Colores'];
  categories: ColorCategory[] = ['Neutros', 'Madera'];
  allColors = MELAMINA_COLORS;

  currentPreviewUrl: string | null = null;
  isAnimating = false;

  constructor(private cdr: ChangeDetectorRef) {}

  updatePreview(): void {
    const newUrl = this.getModelPreviewUrl();
    if (this.currentPreviewUrl !== newUrl) {
      if (this.currentPreviewUrl) {
        this.isAnimating = true;

        setTimeout(() => {
          this.currentPreviewUrl = newUrl;
          this.cdr.detectChanges();

          setTimeout(() => {
            this.isAnimating = false;
            this.cdr.detectChanges();
          }, 50);
        }, 300);
      } else {
        this.currentPreviewUrl = newUrl;
        this.isAnimating = false;
      }
    }
  }

  getModelPreviewUrl(): string | null {
    if (!this.selectedModel) return null;

    if (
      this.selectedModel.id === 'ropero-2p' &&
      this.selectedColor &&
      this.selectedColor.available !== false
    ) {
      return `/furniture/models/r_clasico_${this.selectedColor.id}_r.webp`;
    }

    const baseImageUrl = this.selectedModel.imageUrl;
    return baseImageUrl.startsWith('/') ? baseImageUrl : `/${baseImageUrl}`;
  }

  getColorsByCategory(category: ColorCategory): MelaminaColor[] {
    return this.allColors.filter((c) => c.category === category);
  }

  selectColor(color: MelaminaColor): void {
    if (this.selectedColor?.id === color.id) return;
    this.colorSelected.emit(color);
  }

  onNext(): void {
    if (this.selectedColor) this.next.emit();
  }

  onBack(): void {
    this.back.emit();
  }
}
