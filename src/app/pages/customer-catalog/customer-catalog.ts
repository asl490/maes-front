import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, afterNextRender, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { catchError, finalize, forkJoin, map, of, switchMap } from 'rxjs';
import { FurnitureService } from '../../core/api/generated/api/furniture.service';
import { FurnitureDTO } from '../../core/api/generated/model/furnitureDTO';
import { FurnitureParameterDTO } from '../../core/api/generated/model/furnitureParameterDTO';
import {
  DemoDimensions,
  DemoSelection,
  FurnitureModel,
  FurnitureType,
  MelaminaColor,
} from '../demo/models/demo-selection.model';
import { StepColorComponent } from '../demo/components/step-color/step-color.component';
import { StepDimensionsComponent } from '../demo/components/step-dimensions/step-dimensions.component';
import { StepSummaryComponent } from '../demo/components/step-summary/step-summary.component';
import { FurnitureAsset, FurnitureAssetsService } from '../furniture-configuration/furniture-assets.service';
import { FurnitureConfigurationService } from '../furniture-configuration/furniture-configuration.service';

type CatalogStep = 1 | 2 | 3 | 4;

@Component({
  selector: 'app-customer-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, StepColorComponent, StepDimensionsComponent, StepSummaryComponent],
  templateUrl: './customer-catalog.html',
  styleUrl: './customer-catalog.css',
})
export class CustomerCatalog {
  private readonly furnitureApi = inject(FurnitureService);
  private readonly furnitureAssetsApi = inject(FurnitureAssetsService);
  private readonly furnitureConfiguration = inject(FurnitureConfigurationService);

  readonly loading = signal(true);
  readonly error = signal('');
  readonly furniture = signal<FurnitureDTO[]>([]);
  readonly furnitureImages = signal<Record<number, string>>({});
  readonly selectedFurnitureId = signal<number | null>(null);
  readonly furnitureParameters = signal<FurnitureParameterDTO[] | null>(null);
  readonly parametersLoading = signal(false);
  readonly parametersError = signal('');
  readonly currentStep = signal<CatalogStep>(1);
  readonly search = signal('');
  readonly category = signal('');
  readonly subcategory = signal('');
  readonly maxPrice = signal<number | null>(null);
  readonly sort = signal<'name' | 'price-asc' | 'price-desc'>('name');

  selection: DemoSelection = {
    furnitureType: null,
    model: null,
    color: null,
    dimensions: { width: null, height: null, depth: null },
  };

  readonly categories = computed(() =>
    [...new Set(this.furniture().map((item) => item.subcategory?.category?.name).filter((value): value is string => !!value))].sort(),
  );
  readonly subcategories = computed(() => {
    const selectedCategory = this.category();
    return [...new Set(this.furniture()
      .filter((item) => !selectedCategory || item.subcategory?.category?.name === selectedCategory)
      .map((item) => item.subcategory?.name)
      .filter((value): value is string => !!value))].sort();
  });
  readonly filteredFurniture = computed(() => {
    const term = this.normalize(this.search());
    const category = this.category();
    const subcategory = this.subcategory();
    const maxPrice = this.maxPrice();
    const items = this.furniture().filter((item) => {
      const searchable = this.normalize([item.name, item.code, item.description, item.subcategory?.name, item.subcategory?.category?.name].filter(Boolean).join(' '));
      return (!term || searchable.includes(term))
        && (!category || item.subcategory?.category?.name === category)
        && (!subcategory || item.subcategory?.name === subcategory)
        && (maxPrice === null || (item.basePrice ?? 0) <= maxPrice);
    });
    return [...items].sort((a, b) => {
      if (this.sort() === 'price-asc') return (a.basePrice ?? 0) - (b.basePrice ?? 0);
      if (this.sort() === 'price-desc') return (b.basePrice ?? 0) - (a.basePrice ?? 0);
      return (a.name ?? '').localeCompare(b.name ?? '', 'es');
    });
  });
  readonly hasFilters = computed(() => !!(this.search() || this.category() || this.subcategory() || this.maxPrice()));

  constructor() { afterNextRender(() => this.loadFurniture()); }

  loadFurniture(): void {
    this.loading.set(true);
    this.error.set('');
    this.furnitureApi.furnitureGetAll().pipe(
      map((items) => items.filter((item) => item.status?.toUpperCase() === 'ACTIVE')),
      switchMap((items) => {
        const imageRequests = items
          .filter((item): item is FurnitureDTO & { id: number } => item.id !== undefined)
          .map((item) => this.furnitureAssetsApi.list(item.id).pipe(
            map((assets) => [item.id, this.primaryProductImage(assets)] as const),
            catchError(() => of([item.id, undefined] as const)),
          ));
        return (imageRequests.length ? forkJoin(imageRequests) : of([])).pipe(
          map((images) => ({ items, images })),
        );
      }),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: ({ items, images }) => {
        this.furniture.set(items);
        this.furnitureImages.set(Object.fromEntries(
          images.filter((entry): entry is readonly [number, string] => !!entry[1]),
        ));
      },
      error: (error) => this.error.set(this.errorMessage(error)),
    });
  }

  selectFurniture(item: FurnitureDTO): void {
    this.selectedFurnitureId.set(item.id ?? null);
    this.loadFurnitureParameters(item.id);
    const type: FurnitureType = {
      id: String(item.subcategory?.id ?? item.id ?? 'mueble'),
      name: item.subcategory?.name ?? item.subcategory?.category?.name ?? 'Mueble',
      description: item.subcategory?.description ?? item.description ?? '',
      imageUrl: this.imageFor(item),
    };
    const model: FurnitureModel = {
      id: String(item.id ?? item.code ?? item.name),
      name: item.name ?? 'Mueble sin nombre',
      description: item.description ?? 'Modelo disponible para personalizar.',
      imageUrl: this.imageFor(item),
      furnitureTypeId: type.id,
    };
    this.selection = { furnitureType: type, model, color: null, dimensions: { width: null, height: null, depth: null } };
    this.currentStep.set(2);
    this.scrollTop();
  }

  onColorSelected(color: MelaminaColor): void { this.selection.color = color; }
  onDimensionsChanged(dimensions: DemoDimensions): void { this.selection.dimensions = dimensions; }
  nextStep(): void { if (this.currentStep() < 4) { this.currentStep.update((step) => (step + 1) as CatalogStep); this.scrollTop(); } }
  prevStep(): void { if (this.currentStep() > 1) { this.currentStep.update((step) => (step - 1) as CatalogStep); this.scrollTop(); } }
  goToCatalog(): void { this.currentStep.set(1); this.scrollTop(); }
  reset(): void { this.selection = { furnitureType: null, model: null, color: null, dimensions: { width: null, height: null, depth: null } }; this.selectedFurnitureId.set(null); this.furnitureParameters.set(null); this.parametersError.set(''); this.goToCatalog(); }

  updateCategory(value: string): void { this.category.set(value); this.subcategory.set(''); }
  clearFilters(): void { this.search.set(''); this.category.set(''); this.subcategory.set(''); this.maxPrice.set(null); this.sort.set('name'); }
  formatPrice(price?: number): string { return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', maximumFractionDigits: 0 }).format(price ?? 0); }
  imageFor(item: FurnitureDTO): string {
    return item.id !== undefined
      ? this.furnitureImages()[item.id] ?? '/furniture/entretenimiento.webp'
      : '/furniture/entretenimiento.webp';
  }
  trackFurniture(_index: number, item: FurnitureDTO): number | string { return item.id ?? item.code ?? item.name ?? _index; }
  private normalize(value: string): string { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim(); }
  private primaryProductImage(assets: FurnitureAsset[]): string | undefined {
    return assets
      .filter((asset) => asset.assetType === 'PRODUCT_IMAGE'
        && asset.status?.toUpperCase() === 'ACTIVE'
        && asset.contentType?.toLowerCase().startsWith('image/'))
      .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary)
        || a.displayOrder - b.displayOrder
        || a.id - b.id)[0]?.url;
  }
  private loadFurnitureParameters(furnitureId?: number): void {
    this.furnitureParameters.set(null);
    this.parametersError.set('');
    if (!furnitureId) {
      this.parametersError.set('El mueble seleccionado no tiene un identificador válido.');
      return;
    }
    this.parametersLoading.set(true);
    this.furnitureConfiguration.listParameters(furnitureId)
      .pipe(finalize(() => this.parametersLoading.set(false)))
      .subscribe({
        next: (parameters) => this.furnitureParameters.set(parameters),
        error: () => this.parametersError.set('No se pudieron cargar los rangos permitidos para este mueble.'),
      });
  }
  private scrollTop(): void { globalThis.scrollTo?.({ top: 0, behavior: 'smooth' }); }
  private errorMessage(error: unknown): string {
    if (!(error instanceof HttpErrorResponse) || error.status === 0) return 'No pudimos conectar con el catálogo. Revisa tu conexión e inténtalo nuevamente.';
    if (error.status === 401 || error.status === 403) return 'Tu sesión no tiene acceso al catálogo. Vuelve a iniciar sesión.';
    return 'No fue posible cargar los muebles en este momento.';
  }
}
