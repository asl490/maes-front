import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, afterNextRender, computed, inject, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { finalize } from 'rxjs';
import { CategoryDTO } from '../../core/api/generated/model/categoryDTO';
import { FiltersCategoryDTO } from '../../core/api/generated/model/filtersCategoryDTO';
import { Loading } from '../../shared/loading/loading';
import { ModalService } from '../../shared/modal/modal.service';
import { Paginator } from '../../shared/paginator/paginator';
import { CategoriesManagementService } from './categories-management.service';
import { CategoryEditModal, CategoryFormValue } from './category-edit.modal';

@Component({
  selector: 'app-categories', imports: [LucideAngularModule, Loading, Paginator],
  templateUrl: './categories.html', styleUrl: '../../shared/admin-feature.css',
})
export class Categories {
  private readonly management = inject(CategoriesManagementService);
  private readonly modal = inject(ModalService);
  private readonly changeDetector = inject(ChangeDetectorRef);
  readonly loading = signal(true); readonly saving = signal(false); readonly error = signal('');
  readonly categories = signal<CategoryDTO[]>([]); readonly page = signal(1); readonly pageSize = signal(10); readonly total = signal(0);
  readonly filters = signal<FiltersCategoryDTO>({});
  readonly activeCount = computed(() => this.categories().filter((category) => category.status?.toUpperCase() === 'ACTIVE').length);

  constructor() { afterNextRender(() => this.load()); }
  applyFilters(name: string, status: string): void { this.filters.set({ name, status }); this.page.set(1); this.load(); }
  clearFilters(): void { this.filters.set({}); this.page.set(1); this.load(); }
  changePage(page: number): void { this.page.set(page); this.load(); }
  changePageSize(size: number): void { this.pageSize.set(size); this.page.set(1); this.load(); }
  retry(): void { this.load(); }
  isActive(category: CategoryDTO): boolean { return category.status?.toUpperCase() === 'ACTIVE'; }

  createCategory(): void {
    const ref = this.modal.open<CategoryEditModal, CategoryFormValue>(CategoryEditModal, { size: 'md', data: { mode: 'create' } });
    ref.closed.subscribe((value) => { if (value) this.create(value); });
  }
  editCategory(category: CategoryDTO): void {
    const ref = this.modal.open<CategoryEditModal, CategoryFormValue>(CategoryEditModal, { size: 'md', data: { mode: 'edit', ...category } });
    ref.closed.subscribe((value) => { if (value && category.id) this.update(category.id, value); });
  }
  deleteCategory(category: CategoryDTO): void {
    if (!category.id || !confirm(`¿Eliminar la categoría “${category.name ?? ''}”?`)) return;
    this.saving.set(true);
    this.management.delete(category.id).pipe(finalize(() => this.saving.set(false))).subscribe({ next: () => this.load(), error: (error) => this.setError(error) });
  }

  private load(): void {
    this.loading.set(true); this.error.set('');
    this.management.list(this.filters(), this.page() - 1, this.pageSize()).pipe(finalize(() => this.loading.set(false))).subscribe({
      next: (response) => { this.categories.set(response.content ?? []); this.total.set(response.totalElements ?? 0); this.changeDetector.markForCheck(); },
      error: (error) => this.setError(error),
    });
  }
  private create(value: CategoryFormValue): void {
    this.saving.set(true); this.error.set('');
    this.management.create(value).pipe(finalize(() => this.saving.set(false))).subscribe({ next: () => { this.page.set(1); this.load(); }, error: (error) => this.setError(error) });
  }
  private update(id: number, value: CategoryFormValue): void {
    this.saving.set(true); this.error.set('');
    this.management.update(id, value).pipe(finalize(() => this.saving.set(false))).subscribe({ next: () => this.load(), error: (error) => this.setError(error) });
  }
  private setError(error: unknown): void { this.error.set(this.errorMessage(error)); this.changeDetector.markForCheck(); }
  private errorMessage(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) return 'No se pudo completar la operación.';
    if (error.status === 0) return 'No se pudo conectar con el servidor.';
    if (error.status === 401) return 'La sesión expiró. Vuelve a iniciar sesión.';
    if (error.status === 403) return 'No tienes permisos para administrar categorías.';
    const message = error.error && typeof error.error === 'object' && 'message' in error.error ? error.error.message : null;
    return typeof message === 'string' ? message : 'No se pudo completar la operación.';
  }
}
