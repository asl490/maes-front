import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, afterNextRender, inject, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { finalize } from 'rxjs';
import { ConstantSystemDTO } from '../../core/api/generated/model/constantSystemDTO';
import { FiltersConstantSystemDTO } from '../../core/api/generated/model/filtersConstantSystemDTO';
import { AlertService } from '../../shared/alert/alert.service';
import { Loading } from '../../shared/loading/loading';
import { ModalService } from '../../shared/modal/modal.service';
import { Paginator } from '../../shared/paginator/paginator';
import { SystemConstantEditModal, SystemConstantFormValue } from './system-constant-edit.modal';
import { SystemConstantsManagementService } from './system-constants-management.service';

@Component({
  selector: 'app-system-constants',
  imports: [LucideAngularModule, Loading, Paginator],
  templateUrl: './system-constants.html',
  styleUrl: '../../shared/admin-feature.css',
})
export class SystemConstants {
  private readonly management = inject(SystemConstantsManagementService);
  private readonly modal = inject(ModalService);
  private readonly alert = inject(AlertService);
  private readonly changeDetector = inject(ChangeDetectorRef);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly constants = signal<ConstantSystemDTO[]>([]);
  readonly filters = signal<FiltersConstantSystemDTO>({});
  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly total = signal(0);

  constructor() {
    afterNextRender(() => this.load());
  }
  applyFilters(name: string, abbreviation: string, type: string): void {
    this.filters.set({ name, abbreviation, type });
    this.page.set(1);
    this.load();
  }
  clearFilters(): void {
    this.filters.set({});
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
    this.load();
  }
  createConstant(): void {
    const ref = this.modal.open<SystemConstantEditModal, SystemConstantFormValue>(
      SystemConstantEditModal,
      { size: 'md', data: { mode: 'create' } },
    );
    ref.closed.subscribe((value) => {
      if (value) this.saveCreate(value);
    });
  }
  editConstant(item: ConstantSystemDTO): void {
    const ref = this.modal.open<SystemConstantEditModal, SystemConstantFormValue>(
      SystemConstantEditModal,
      { size: 'md', data: { mode: 'edit', ...item } },
    );
    ref.closed.subscribe((value) => {
      if (value && item.id) this.saveUpdate(item.id, value);
    });
  }
  async deleteConstant(item: ConstantSystemDTO): Promise<void> {
    if (!item.id || !(await this.alert.confirmDelete(item.name ?? 'Sin nombre', 'la constante')))
      return;
    this.execute('Eliminando constante...', 'Constante eliminada', this.management.delete(item.id));
  }
  private load(): void {
    this.loading.set(true);
    this.error.set('');
    this.management
      .list(this.filters(), this.page() - 1, this.pageSize())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.constants.set(response.content ?? []);
          this.total.set(response.totalElements ?? 0);
          this.changeDetector.markForCheck();
        },
        error: (error) => this.setError(error),
      });
  }
  private saveCreate(value: SystemConstantFormValue): void {
    this.execute('Creando constante...', 'Constante creada', this.management.create(value), true);
  }
  private saveUpdate(id: number, value: SystemConstantFormValue): void {
    this.execute(
      'Guardando cambios...',
      'Constante actualizada',
      this.management.update(id, value),
    );
  }
  private execute(
    loading: string,
    success: string,
    request: import('rxjs').Observable<unknown>,
    resetPage = false,
  ): void {
    this.saving.set(true);
    this.error.set('');
    this.alert.loading(loading);
    request.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => {
        this.alert.close();
        this.alert.success(success);
        if (resetPage) this.page.set(1);
        this.load();
      },
      error: (error) => {
        this.alert.close();
        this.setError(error);
      },
    });
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
    if (error.status === 403) return 'No tienes permisos para administrar constantes del sistema.';
    const message =
      error.error && typeof error.error === 'object' && 'message' in error.error
        ? error.error.message
        : null;
    return typeof message === 'string' ? message : 'No se pudo completar la operación.';
  }
}
