import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ModalService } from '../../shared/modal/modal.service';
import { UserEditModal } from './user-edit.modal';
import { Paginator } from '../../shared/paginator/paginator';
import { Loading } from '../../shared/loading/loading';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  joined: string;
  avatar: string;
}

@Component({
  selector: 'app-users',
  imports: [FormsModule, LucideAngularModule, Paginator, Loading],
  templateUrl: './users.html',
})
export class Users implements OnInit {
  loading = signal(true);

  page     = signal(1);
  pageSize = signal(5);
  search = signal('');
  filterStatus = signal('all');

  users = signal<User[]>([]);

  filteredUsers = computed(() => {
    const q = this.search().toLowerCase();
    const s = this.filterStatus();
    return this.users().filter(
      (u) =>
        (s === 'all' || u.status === s) &&
        (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
    );
  });

  pagedUsers = computed(() => {
    const start = (this.page() - 1) * this.pageSize();
    return this.filteredUsers().slice(start, start + this.pageSize());
  });

  private modal = inject(ModalService);

  async ngOnInit() {
    // Simula llamada a API
    await new Promise(r => setTimeout(r, 1500));

    this.users.set([
      { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin',  status: 'active',   joined: 'Jan 10, 2025', avatar: 'AJ' },
      { id: 2, name: 'Bob Martinez',  email: 'bob@example.com',   role: 'Editor', status: 'active',   joined: 'Jan 12, 2025', avatar: 'BM' },
      { id: 3, name: 'Carol White',   email: 'carol@example.com', role: 'Viewer', status: 'inactive', joined: 'Jan 15, 2025', avatar: 'CW' },
      { id: 4, name: 'David Lee',     email: 'david@example.com', role: 'Editor', status: 'pending',  joined: 'Jan 18, 2025', avatar: 'DL' },
      { id: 5, name: 'Eva Brown',     email: 'eva@example.com',   role: 'Admin',  status: 'active',   joined: 'Jan 20, 2025', avatar: 'EB' },
      { id: 6, name: 'Frank Wilson',  email: 'frank@example.com', role: 'Viewer', status: 'active',   joined: 'Jan 22, 2025', avatar: 'FW' },
      { id: 7, name: 'Grace Kim',     email: 'grace@example.com', role: 'Editor', status: 'inactive', joined: 'Jan 24, 2025', avatar: 'GK' },
      { id: 8, name: 'Henry Ford',    email: 'henry@example.com', role: 'Viewer', status: 'pending',  joined: 'Jan 26, 2025', avatar: 'HF' },
    ]);

    this.loading.set(false);
  }

  setSearch(val: string) { this.search.set(val); this.page.set(1); }
  setFilter(val: string) { this.filterStatus.set(val); this.page.set(1); }

  editUser(user: User) {
    const dialogRef = this.modal.open(UserEditModal, {
      title: 'Edit User',
      size: 'md',
      data: { name: user.name, email: user.email, role: user.role },
    });
  }
}
