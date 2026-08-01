import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { finalize } from 'rxjs';
import { UserDTO } from '../../core/api/generated/model/userDTO';
import { Loading } from '../../shared/loading/loading';
import { ModalService } from '../../shared/modal/modal.service';
import { Paginator } from '../../shared/paginator/paginator';
import { UserEditModal, UserFormValue } from './user-edit.modal';
import { UserManagementService } from './user-management.service';

interface UserViewModel {
  id: number;
  username: string;
  displayName: string;
  email: string;
  roles: string[];
  lastLogin: string;
  avatar: string;
  hasPerson: boolean;
}

@Component({
  selector: 'app-users',
  imports: [FormsModule, LucideAngularModule, Paginator, Loading],
  templateUrl: './users.html',
  styleUrl: '../../shared/admin-feature.css',
})
export class Users implements OnInit, OnDestroy {
  private readonly modal = inject(ModalService);
  private readonly userManagement = inject(UserManagementService);
  private searchTimer?: ReturnType<typeof setTimeout>;

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly total = signal(0);
  readonly search = signal('');
  readonly users = signal<UserViewModel[]>([]);
  readonly linkedPeopleCount = computed(() => this.users().filter((user) => user.hasPerson).length);

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    clearTimeout(this.searchTimer);
  }

  setSearch(value: string): void {
    this.search.set(value);
    this.page.set(1);
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.loadUsers(), 350);
  }

  changePage(page: number): void {
    this.page.set(page);
    this.loadUsers();
  }

  changePageSize(size: number): void {
    this.pageSize.set(size);
    this.page.set(1);
    this.loadUsers();
  }

  retry(): void {
    this.loadUsers();
  }

  createUser(): void {
    const ref = this.modal.open<UserEditModal, UserFormValue>(UserEditModal, { title: 'Crear usuario', size: 'md', data: { mode: 'create' } });
    ref.closed.subscribe((value) => { if (value) this.saveNewUser(value); });
  }

  editUser(user: UserViewModel): void {
    const ref = this.modal.open<UserEditModal, UserFormValue>(UserEditModal, {
      title: 'Editar usuario', size: 'md', data: { mode: 'edit', username: user.username, roles: user.roles },
    });
    ref.closed.subscribe((value) => { if (value) this.saveUser(user.id, value); });
  }

  deleteUser(user: UserViewModel): void {
    if (!confirm(`¿Eliminar el usuario “${user.username}”?`)) return;
    this.saving.set(true);
    this.userManagement.delete(user.id).pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => this.loadUsers(),
      error: (error) => this.error.set(this.errorMessage(error)),
    });
  }

  private loadUsers(): void {
    this.loading.set(true);
    this.error.set('');
    this.userManagement.list(this.search(), this.page() - 1, this.pageSize()).pipe(
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: (response) => {
        this.users.set((response.content ?? []).map((user) => this.toViewModel(user)));
        this.total.set(response.totalElements ?? 0);
      },
      error: (error) => this.error.set(this.errorMessage(error)),
    });
  }

  private saveNewUser(value: UserFormValue): void {
    this.saving.set(true);
    this.error.set('');
    this.userManagement.create(value).pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => { this.page.set(1); this.loadUsers(); },
      error: (error) => this.error.set(this.errorMessage(error)),
    });
  }

  private saveUser(id: number, value: UserFormValue): void {
    this.saving.set(true);
    this.error.set('');
    this.userManagement.update(id, value).pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => this.loadUsers(),
      error: (error) => this.error.set(this.errorMessage(error)),
    });
  }

  private toViewModel(user: UserDTO): UserViewModel {
    const name = [user.person?.name, user.person?.lastName].filter(Boolean).join(' ') || user.username || 'Usuario';
    return {
      id: user.id ?? 0,
      username: user.username ?? 'Sin usuario',
      displayName: name,
      email: user.person?.email ?? 'Sin correo asociado',
      roles: user.roles ?? [],
      lastLogin: this.formatDate(user.lastlogin),
      avatar: this.initials(name),
      hasPerson: Boolean(user.person),
    };
  }

  private formatDate(value?: string): string {
    if (!value) return 'Nunca';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
  }

  private initials(name: string): string {
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'U';
  }

  private errorMessage(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) return 'No se pudo completar la operación.';
    if (error.status === 0) return 'No se pudo conectar con el servidor.';
    if (error.status === 401) return 'La sesión expiró. Vuelve a iniciar sesión.';
    if (error.status === 403) return 'No tienes permisos para administrar usuarios.';
    const message = error.error && typeof error.error === 'object' && 'message' in error.error ? error.error.message : null;
    return typeof message === 'string' ? message : 'No se pudo completar la operación.';
  }
}
