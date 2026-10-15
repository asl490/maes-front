import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, afterNextRender, computed, inject, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { finalize, Observable } from 'rxjs';
import { AlertService } from '../../shared/alert/alert.service';
import { Loading } from '../../shared/loading/loading';
import { ModalService } from '../../shared/modal/modal.service';
import { Paginator } from '../../shared/paginator/paginator';
import { StatusLabelPipe } from '../../shared/status-label.pipe';
import { MelamineColorEditModal, MelamineColorFormValue } from './melamine-color-edit.modal';
import { MelamineColorDTO, MelamineColorFilters, MelamineColorsService } from './melamine-colors.service';

@Component({ selector: 'app-melamine-colors', imports: [LucideAngularModule, Loading, Paginator, StatusLabelPipe], templateUrl: './melamine-colors.html', styleUrl: '../../shared/admin-feature.css' })
export class MelamineColors {
  private readonly service = inject(MelamineColorsService); private readonly modal = inject(ModalService); private readonly alert = inject(AlertService); private readonly cd = inject(ChangeDetectorRef);
  readonly items = signal<MelamineColorDTO[]>([]); readonly filters = signal<MelamineColorFilters>({ status: 'ACTIVE' }); readonly page = signal(1); readonly pageSize = signal(10); readonly total = signal(0); readonly loading = signal(true); readonly saving = signal(false); readonly error = signal(''); readonly activeCount = computed(() => this.items().filter(i => i.status === 'ACTIVE').length);
  constructor() { afterNextRender(() => this.load()); }
  applyFilters(code: string, name: string, brand: string, status: string): void { this.filters.set({ code: code.trim(), name: name.trim(), brand: brand.trim(), status }); this.page.set(1); this.load(); }
  clearFilters(): void { this.filters.set({ status: 'ACTIVE' }); this.page.set(1); this.load(); }
  changePage(page: number): void { this.page.set(page); this.load(); } changePageSize(size: number): void { this.pageSize.set(size); this.page.set(1); this.load(); } retry(): void { this.load(); }
  isDeleted(item: MelamineColorDTO): boolean { return item.status === 'DELETED'; }
  create(): void { this.openModal({ mode: 'create' }); }
  edit(item: MelamineColorDTO): void { this.openModal({ mode: 'edit', ...item }, item.id); }
  async remove(item: MelamineColorDTO): Promise<void> { if (!item.id || !(await this.alert.confirmDelete(item.name ?? 'Sin nombre', 'la melamina'))) return; this.execute('Eliminando melamina...', 'Melamina eliminada', this.service.delete(item.id)); }
  async restore(item: MelamineColorDTO): Promise<void> { if (!item.id || !(await this.alert.confirmRestore(item.name ?? 'Sin nombre', 'la melamina'))) return; this.execute('Restaurando melamina...', 'Melamina restaurada', this.service.restore(item.id)); }
  private openModal(data: Parameters<ModalService['open']>[1] extends never ? never : any, id?: number): void { const ref = this.modal.open<MelamineColorEditModal, MelamineColorFormValue>(MelamineColorEditModal, { size: 'lg', data }); ref.closed.subscribe(value => { if (!value) return; const { thumbnail, texture, ...payload } = value; this.execute(id ? 'Actualizando melamina...' : 'Creando melamina...', id ? 'Melamina actualizada' : 'Melamina creada', this.service.saveWithImages(id, payload, thumbnail, texture), !id); }); }
  private load(): void { this.loading.set(true); this.error.set(''); this.service.list(this.filters(), this.page() - 1, this.pageSize()).pipe(finalize(() => this.loading.set(false))).subscribe({ next: r => { this.items.set(r.content ?? []); this.total.set(r.totalElements ?? 0); this.cd.markForCheck(); }, error: e => this.setError(e) }); }
  private execute(loading: string, success: string, request: Observable<unknown>, reset = false): void { this.saving.set(true); this.alert.loading(loading); request.pipe(finalize(() => this.saving.set(false))).subscribe({ next: () => { this.alert.close(); this.alert.success(success); if (reset) this.page.set(1); this.load(); }, error: e => { this.alert.close(); this.setError(e); } }); }
  private setError(error: unknown): void { let message = 'No se pudo completar la operación.'; if (error instanceof HttpErrorResponse) { if (error.status === 0) message = 'No se pudo conectar con el servidor.'; else if (error.status === 403) message = 'No tienes permisos para administrar melaminas.'; else if (typeof error.error?.message === 'string') message = error.error.message; } this.error.set(message); this.alert.error(message); this.cd.markForCheck(); }
}
