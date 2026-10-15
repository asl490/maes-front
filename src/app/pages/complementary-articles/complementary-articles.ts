import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, afterNextRender, computed, inject, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { finalize, Observable } from 'rxjs';
import { ComplementaryArticleDTO } from '../../core/api/generated/model/complementaryArticleDTO';
import { FiltersComplementaryArticleDTO } from '../../core/api/generated/model/filtersComplementaryArticleDTO';
import { AlertService } from '../../shared/alert/alert.service';
import { Loading } from '../../shared/loading/loading';
import { ModalService } from '../../shared/modal/modal.service';
import { Paginator } from '../../shared/paginator/paginator';
import { ComplementaryArticleEditModal, ComplementaryArticleFormValue } from './complementary-article-edit.modal';
import { ComplementaryArticlesManagementService } from './complementary-articles-management.service';
import { StatusLabelPipe } from '../../shared/status-label.pipe';

@Component({ selector: 'app-complementary-articles', imports: [LucideAngularModule, Loading, Paginator, StatusLabelPipe], templateUrl: './complementary-articles.html', styleUrl: '../../shared/admin-feature.css' })
export class ComplementaryArticles {
  private readonly management = inject(ComplementaryArticlesManagementService); private readonly modal = inject(ModalService); private readonly alert = inject(AlertService); private readonly changeDetector = inject(ChangeDetectorRef);
  readonly loading = signal(true); readonly saving = signal(false); readonly error = signal(''); readonly articles = signal<ComplementaryArticleDTO[]>([]); readonly filters = signal<FiltersComplementaryArticleDTO>({ status: 'ACTIVE' }); readonly page = signal(1); readonly pageSize = signal(10); readonly total = signal(0); readonly activeCount = computed(() => this.articles().filter((item) => item.status?.toUpperCase() === 'ACTIVE').length);
  constructor() { afterNextRender(() => this.load()); }
  applyFilters(code: string, name: string, unit: string, status: string): void { this.filters.set({ code, name, unit, status }); this.page.set(1); this.load(); }
  clearFilters(): void { this.filters.set({ status: 'ACTIVE' }); this.page.set(1); this.load(); } changePage(page: number): void { this.page.set(page); this.load(); } changePageSize(size: number): void { this.pageSize.set(size); this.page.set(1); this.load(); } retry(): void { this.load(); }
  isDeleted(item: ComplementaryArticleDTO): boolean { return item.status?.toUpperCase() === 'DELETED'; }
  createArticle(): void { const ref = this.modal.open<ComplementaryArticleEditModal, ComplementaryArticleFormValue>(ComplementaryArticleEditModal, { size: 'md', data: { mode: 'create' } }); ref.closed.subscribe((value) => { if (value) this.execute('Creando artículo...', 'Artículo creado', this.management.create(value), true); }); }
  editArticle(item: ComplementaryArticleDTO): void { const ref = this.modal.open<ComplementaryArticleEditModal, ComplementaryArticleFormValue>(ComplementaryArticleEditModal, { size: 'md', data: { mode: 'edit', ...item } }); ref.closed.subscribe((value) => { if (value && item.id) this.execute('Guardando cambios...', 'Artículo actualizado', this.management.update(item.id, value)); }); }
  async deleteArticle(item: ComplementaryArticleDTO): Promise<void> { if (!item.id || !(await this.alert.confirmDelete(item.name ?? 'Sin nombre', 'el artículo'))) return; this.execute('Eliminando artículo...', 'Artículo eliminado', this.management.delete(item.id)); }
  async restoreArticle(item: ComplementaryArticleDTO): Promise<void> { if (!item.id || !(await this.alert.confirmRestore(item.name ?? 'Sin nombre', 'el artículo'))) return; this.execute('Restaurando artículo...', 'Artículo restaurado', this.management.restore(item.id)); }
  private load(): void { this.loading.set(true); this.error.set(''); this.management.list(this.filters(), this.page() - 1, this.pageSize()).pipe(finalize(() => this.loading.set(false))).subscribe({ next: (response) => { this.articles.set(response.content ?? []); this.total.set(response.totalElements ?? 0); this.changeDetector.markForCheck(); }, error: (error) => this.setError(error) }); }
  private execute(loading: string, success: string, request: Observable<unknown>, resetPage = false): void { this.saving.set(true); this.error.set(''); this.alert.loading(loading); request.pipe(finalize(() => this.saving.set(false))).subscribe({ next: () => { this.alert.close(); this.alert.success(success); if (resetPage) this.page.set(1); this.load(); }, error: (error) => { this.alert.close(); this.setError(error); } }); }
  private setError(error: unknown): void { const message = this.errorMessage(error); this.error.set(message); this.alert.error(message); this.changeDetector.markForCheck(); }
  private errorMessage(error: unknown): string { if (!(error instanceof HttpErrorResponse)) return 'No se pudo completar la operación.'; if (error.status === 0) return 'No se pudo conectar con el servidor.'; if (error.status === 403) return 'No tienes permisos para administrar artículos complementarios.'; const message = error.error && typeof error.error === 'object' && 'message' in error.error ? error.error.message : null; return typeof message === 'string' ? message : 'No se pudo completar la operación.'; }
}
