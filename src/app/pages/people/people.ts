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
import { FiltersPersonDTO } from '../../core/api/generated/model/filtersPersonDTO';
import { PersonDTO } from '../../core/api/generated/model/personDTO';
import { AlertService } from '../../shared/alert/alert.service';
import { Loading } from '../../shared/loading/loading';
import { ModalService } from '../../shared/modal/modal.service';
import { Paginator } from '../../shared/paginator/paginator';
import { PeopleManagementService } from './people-management.service';
import { PersonEditModal, PersonFormValue } from './person-edit.modal';

@Component({
  selector: 'app-people',
  imports: [LucideAngularModule, Loading, Paginator],
  templateUrl: './people.html',
  styleUrl: '../../shared/admin-feature.css',
})
export class People {
  private readonly management = inject(PeopleManagementService);
  private readonly modal = inject(ModalService);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly alert = inject(AlertService);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly people = signal<PersonDTO[]>([]);
  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly total = signal(0);
  readonly filters = signal<FiltersPersonDTO>({});
  readonly withEmailCount = computed(() => this.people().filter((person) => person.email).length);

  constructor() {
    afterNextRender(() => this.load());
  }

  applyFilters(name: string, lastName: string, dni: string, email: string): void {
    this.filters.set({ name, lastName, dni, email });
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

  createPerson(): void {
    const ref = this.modal.open<PersonEditModal, PersonFormValue>(PersonEditModal, {
      size: 'lg',
      data: { mode: 'create' },
    });
    ref.closed.subscribe((value) => {
      if (value) this.create(value);
    });
  }

  createPersonWithUser(): void {
    const ref = this.modal.open<PersonEditModal, PersonFormValue>(PersonEditModal, {
      size: 'lg',
      data: { mode: 'create' },
    });
    ref.closed.subscribe((value) => {
      if (value) this.createWithUser(value);
    });
  }

  editPerson(person: PersonDTO): void {
    const ref = this.modal.open<PersonEditModal, PersonFormValue>(PersonEditModal, {
      size: 'lg',
      data: { mode: 'edit', ...person },
    });
    ref.closed.subscribe((value) => {
      if (value && person.id) this.update(person.id, value);
    });
  }

  async deletePerson(person: PersonDTO): Promise<void> {
    if (!person.id || !(await this.alert.confirmDelete(this.fullName(person), 'la persona')))
      return;
    this.saving.set(true);
    this.alert.loading('Eliminando persona...');
    this.management
      .delete(person.id)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.alert.close();
          this.alert.success('Persona eliminada');
          this.load();
        },
        error: (error) => {
          this.alert.close();
          const message = this.errorMessage(error);
          this.error.set(message);
          this.alert.error(message);
        },
      });
  }

  fullName(person: PersonDTO): string {
    return [person.name, person.lastName].filter(Boolean).join(' ') || 'Sin nombre';
  }

  initials(person: PersonDTO): string {
    return (
      [person.name, person.lastName]
        .filter(Boolean)
        .slice(0, 2)
        .map((value) => value?.[0]?.toUpperCase())
        .join('') || 'P'
    );
  }

  private load(): void {
    this.loading.set(true);
    this.error.set('');
    this.management
      .list(this.filters(), this.page() - 1, this.pageSize())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.people.set(response.content ?? []);
          this.total.set(response.totalElements ?? 0);
          this.changeDetector.markForCheck();
        },
        error: (error) => {
          this.error.set(this.errorMessage(error));
          this.changeDetector.markForCheck();
        },
      });
  }

  private create(value: PersonFormValue): void {
    this.saving.set(true);
    this.error.set('');
    this.management
      .create(value)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.page.set(1);
          this.load();
        },
        error: (error) => this.error.set(this.errorMessage(error)),
      });
  }

  private createWithUser(value: PersonFormValue): void {
    this.saving.set(true);
    this.error.set('');
    this.management
      .createWithUser(value)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.page.set(1);
          this.load();
        },
        error: (error) => this.error.set(this.errorMessage(error)),
      });
  }

  private update(id: number, value: PersonFormValue): void {
    this.saving.set(true);
    this.error.set('');
    this.management
      .update(id, value)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => this.load(),
        error: (error) => this.error.set(this.errorMessage(error)),
      });
  }

  private errorMessage(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) return 'No se pudo completar la operación.';
    if (error.status === 0) return 'No se pudo conectar con el servidor.';
    if (error.status === 401) return 'La sesión expiró. Vuelve a iniciar sesión.';
    if (error.status === 403) return 'No tienes permisos para administrar personas.';
    const message =
      error.error && typeof error.error === 'object' && 'message' in error.error
        ? error.error.message
        : null;
    return typeof message === 'string' ? message : 'No se pudo completar la operación.';
  }
}
