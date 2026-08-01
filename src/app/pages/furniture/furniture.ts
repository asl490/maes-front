import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, afterNextRender, computed, inject, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { finalize } from 'rxjs';
import { FiltersFurnitureDTO } from '../../core/api/generated/model/filtersFurnitureDTO';
import { FurnitureDTO } from '../../core/api/generated/model/furnitureDTO';
import { SubcategoryDTO } from '../../core/api/generated/model/subcategoryDTO';
import { Loading } from '../../shared/loading/loading'; import { ModalService } from '../../shared/modal/modal.service'; import { Paginator } from '../../shared/paginator/paginator';
import { FurnitureEditModal, FurnitureFormValue } from './furniture-edit.modal'; import { FurnitureManagementService } from './furniture-management.service';

@Component({ selector: 'app-furniture', imports: [LucideAngularModule, Loading, Paginator], templateUrl: './furniture.html', styleUrl: '../../shared/admin-feature.css' })
export class Furniture {
  private readonly management = inject(FurnitureManagementService); private readonly modal = inject(ModalService); private readonly cd = inject(ChangeDetectorRef);
  readonly loading = signal(true); readonly saving = signal(false); readonly error = signal(''); readonly furniture = signal<FurnitureDTO[]>([]); readonly subcategories = signal<SubcategoryDTO[]>([]); readonly page = signal(1); readonly pageSize = signal(10); readonly total = signal(0); readonly filters = signal<FiltersFurnitureDTO>({});
  readonly activeCount = computed(() => this.furniture().filter((item) => item.status?.toUpperCase() === 'ACTIVE').length);
  constructor() { afterNextRender(() => { this.loadSubcategories(); this.load(); }); }
  applyFilters(name: string, code: string, subcategory: string, status: string): void { this.filters.set({ name, code, subcategory: Number(subcategory) || undefined, status }); this.page.set(1); this.load(); }
  clearFilters(): void { this.filters.set({}); this.page.set(1); this.load(); } changePage(page: number): void { this.page.set(page); this.load(); } changePageSize(size: number): void { this.pageSize.set(size); this.page.set(1); this.load(); } retry(): void { this.loadSubcategories(); this.load(); }
  isActive(item: FurnitureDTO): boolean { return item.status?.toUpperCase() === 'ACTIVE'; }
  formatPrice(value?: number): string { return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value ?? 0); }
  createFurniture(): void { const ref = this.modal.open<FurnitureEditModal, FurnitureFormValue>(FurnitureEditModal, { size: 'lg', data: { mode: 'create', subcategories: this.subcategories() } }); ref.closed.subscribe((value) => { if (value) this.create(value); }); }
  editFurniture(item: FurnitureDTO): void { const ref = this.modal.open<FurnitureEditModal, FurnitureFormValue>(FurnitureEditModal, { size: 'lg', data: { mode: 'edit', subcategories: this.subcategories(), subcategory: item.subcategory?.id, code: item.code, name: item.name, description: item.description, status: item.status, basePrice: item.basePrice, note: item.note } }); ref.closed.subscribe((value) => { if (value && item.id) this.update(item.id, value); }); }
  deleteFurniture(item: FurnitureDTO): void { if (!item.id || !confirm(`¿Eliminar el mueble “${item.name ?? ''}”?`)) return; this.saving.set(true); this.management.delete(item.id).pipe(finalize(() => this.saving.set(false))).subscribe({ next: () => this.load(), error: (e) => this.setError(e) }); }
  private loadSubcategories(): void { this.management.listSubcategories().subscribe({ next: (items) => { this.subcategories.set(items); this.cd.markForCheck(); }, error: (e) => this.setError(e) }); }
  private load(): void { this.loading.set(true); this.error.set(''); this.management.list(this.filters(), this.page() - 1, this.pageSize()).pipe(finalize(() => this.loading.set(false))).subscribe({ next: (r) => { this.furniture.set(r.content ?? []); this.total.set(r.totalElements ?? 0); this.cd.markForCheck(); }, error: (e) => this.setError(e) }); }
  private create(v: FurnitureFormValue): void { this.saving.set(true); this.management.create(v).pipe(finalize(() => this.saving.set(false))).subscribe({ next: () => { this.page.set(1); this.load(); }, error: (e) => this.setError(e) }); }
  private update(id: number, v: FurnitureFormValue): void { this.saving.set(true); this.management.update(id, v).pipe(finalize(() => this.saving.set(false))).subscribe({ next: () => this.load(), error: (e) => this.setError(e) }); }
  private setError(e: unknown): void { this.error.set(this.errorMessage(e)); this.cd.markForCheck(); }
  private errorMessage(e: unknown): string { if (!(e instanceof HttpErrorResponse)) return 'No se pudo completar la operación.'; if (e.status === 0) return 'No se pudo conectar con el servidor.'; if (e.status === 401) return 'La sesión expiró.'; if (e.status === 403) return 'No tienes permisos para administrar muebles.'; const m = e.error && typeof e.error === 'object' && 'message' in e.error ? e.error.message : null; return typeof m === 'string' ? m : 'No se pudo completar la operación.'; }
}
