import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { finalize } from 'rxjs';
import { CategoryDTO } from '../../core/api/generated/model/categoryDTO';
import { FiltersSubcategoryDTO } from '../../core/api/generated/model/filtersSubcategoryDTO';
import { SubcategoryDTO } from '../../core/api/generated/model/subcategoryDTO';
import { AlertService } from '../../shared/alert/alert.service';
import { Loading } from '../../shared/loading/loading';
import { ModalService } from '../../shared/modal/modal.service';
import { Paginator } from '../../shared/paginator/paginator';
import { SubcategoriesManagementService } from './subcategories-management.service';
import { SubcategoryEditModal, SubcategoryFormValue } from './subcategory-edit.modal';
import { StatusLabelPipe } from '../../shared/status-label.pipe';

@Component({
  selector: 'app-subcategories',
  imports: [LucideAngularModule, Loading, Paginator, StatusLabelPipe],
  templateUrl: './subcategories.html',
  styleUrl: '../../shared/admin-feature.css',
})
export class Subcategories {
  private readonly management = inject(SubcategoriesManagementService);
  private readonly modal = inject(ModalService);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly alert = inject(AlertService);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly subcategories = signal<SubcategoryDTO[]>([]);
  readonly categories = signal<CategoryDTO[]>([]);
  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly total = signal(0);
  readonly filters = signal<FiltersSubcategoryDTO>({ status: 'ACTIVE' });
  readonly activeCount = computed(
    () => this.subcategories().filter((item) => item.status?.toUpperCase() === 'ACTIVE').length,
  );
  constructor() {
    afterNextRender(() => {
      this.loadCategories();
      this.load();
    });
  }
  applyFilters(name: string, category: string, status: string): void {
    this.filters.set({ name, category: Number(category) || undefined, status });
    this.page.set(1);
    this.load();
  }
  clearFilters(): void {
    this.filters.set({ status: 'ACTIVE' });
    this.page.set(1);
    this.load();
  }
  changePage(page: number): void {
    this.page.set(page);
    this.load();
  }
  changePageSize(size: number): void {
    this.pageSize.set(size);
    this.page.set(1);
    this.load();
  }
  retry(): void {
    this.loadCategories();
    this.load();
  }
  isActive(item: SubcategoryDTO): boolean {
    return item.status?.toUpperCase() === 'ACTIVE';
  }
  isDeleted(item: SubcategoryDTO): boolean {
    return item.status?.toUpperCase() === 'DELETED';
  }
  async restoreSubcategory(item: SubcategoryDTO): Promise<void> {
    if (
      !item.id ||
      !(await this.alert.confirmRestore(item.name ?? 'Sin nombre', 'la subcategoría'))
    )
      return;
    this.saving.set(true);
    this.alert.loading('Restaurando subcategoría...');
    this.management
      .restore(item.id)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.alert.close();
          this.alert.success('Subcategoría restaurada');
          this.load();
        },
        error: (error) => {
          this.alert.close();
          this.setError(error);
        },
      });
  }
  createSubcategory(): void {
    const ref = this.modal.open<SubcategoryEditModal, SubcategoryFormValue>(SubcategoryEditModal, {
      size: 'md',
      data: { mode: 'create', categories: this.categories() },
    });
    ref.closed.subscribe((value) => {
      if (value) this.create(value);
    });
  }
  editSubcategory(item: SubcategoryDTO): void {
    const ref = this.modal.open<SubcategoryEditModal, SubcategoryFormValue>(SubcategoryEditModal, {
      size: 'md',
      data: {
        mode: 'edit',
        categories: this.categories(),
        category: item.category?.id,
        name: item.name,
        description: item.description,
        status: item.status,
        imageUrl: item.imageUrl,
      },
    });
    ref.closed.subscribe((value) => {
      if (value && item.id) this.update(item.id, value);
    });
  }
  async deleteSubcategory(item: SubcategoryDTO): Promise<void> {
    if (!item.id || !(await this.alert.confirmDelete(item.name ?? 'Sin nombre', 'la subcategoría')))
      return;
    this.saving.set(true);
    this.alert.loading('Eliminando subcategoría...');
    this.management
      .delete(item.id)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.alert.close();
          this.alert.success('Subcategoría eliminada');
          this.load();
        },
        error: (error) => {
          this.alert.close();
          this.setError(error);
        },
      });
  }
  private loadCategories(): void {
    this.management.listCategories().subscribe({
      next: (items) => {
        this.categories.set(items);
        this.changeDetector.markForCheck();
      },
      error: (error) => this.setError(error),
    });
  }
  private load(): void {
    this.loading.set(true);
    this.error.set('');
    this.management
      .list(this.filters(), this.page() - 1, this.pageSize())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.subcategories.set(response.content ?? []);
          this.total.set(response.totalElements ?? 0);
          this.changeDetector.markForCheck();
        },
        error: (error) => this.setError(error),
      });
  }
  private create(value: SubcategoryFormValue): void {
    this.saving.set(true);
    this.management
      .createWithImage(value)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.page.set(1);
          this.load();
        },
        error: (error) => this.setError(error),
      });
  }
  private update(id: number, value: SubcategoryFormValue): void {
    this.saving.set(true);
    this.management
      .updateWithImage(id, value)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({ next: () => this.load(), error: (error) => this.setError(error) });
  }
  private setError(error: unknown): void {
    const message = this.errorMessage(error);
    this.error.set(message);
    this.alert.error(message);
    this.changeDetector.markForCheck();
  }
  private errorMessage(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) return 'No se pudo completar la operación.';
    if (error.status === 0) return 'No se pudo conectar con el servidor.';
    if (error.status === 401) return 'La sesión expiró. Vuelve a iniciar sesión.';
    if (error.status === 403) return 'No tienes permisos para administrar subcategorías.';
    const message =
      error.error && typeof error.error === 'object' && 'message' in error.error
        ? error.error.message
        : null;
    return typeof message === 'string' ? message : 'No se pudo completar la operación.';
  }
}
