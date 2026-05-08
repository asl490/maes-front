import { Component, signal, output, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgTemplateOutlet } from '@angular/common';

export interface NavGrandChild {
  label: string;
  route: string;
  badge?: string;
  badgeType?: string;
}

export interface NavChild {
  label: string;
  route?: string;
  badge?: string;
  badgeType?: string;
  children?: NavGrandChild[];
}

export interface NavItem {
  label: string;
  route?: string;
  icon: string;
  badge?: string;
  badgeType?: string;
  children?: NavChild[];
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, NgTemplateOutlet],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  isMobile = input(false);
  collapsed = signal(false);
  collapseChange = output<boolean>();
  closeMobile = output<void>();

  openMenus = signal<Set<string>>(new Set());

  navGroups: NavGroup[] = [
    {
      title: 'Main',
      items: [
        { label: 'Dashboard', route: '/app/dashboard', icon: 'dashboard' },
        {
          label: 'Analytics',
          route: '/app/analytics',
          icon: 'analytics',
          badge: 'New',
          badgeType: 'violet',
        },
        { label: 'Charts', route: '/app/charts', icon: 'charts' },
        { label: 'Calendar', route: '/app/calendar', icon: 'calendar' },
      ],
    },
    {
      title: 'Management',
      items: [
        {
          label: 'Users',
          icon: 'users',
          badge: '24',
          badgeType: 'info',
          children: [
            { label: 'All Users', route: '/app/users' },
            {
              label: 'Roles & Permissions',
              children: [
                { label: 'Admin', route: '/app/users/roles/admin' },
                { label: 'Editor', route: '/app/users/roles/editor' },
                {
                  label: 'Viewer',
                  route: '/app/users/roles/viewer',
                  badge: 'New',
                  badgeType: 'violet',
                },
              ],
            },
            { label: 'Invitations', route: '/app/users/invitations', badge: '3', badgeType: 'warning' },
          ],
        },
        {
          label: 'Settings',
          icon: 'settings',
          children: [
            { label: 'General', route: '/app/settings' },
            { label: 'Security', route: '/app/settings/security' },
            { label: 'Notifications', route: '/app/settings/notifications' },
            { label: 'Appearance', route: '/app/settings/appearance' },
          ],
        },
      ],
    },
  ];

  get user() {
    return this.auth.user();
  }

  constructor(public auth: AuthService) {}

  toggle() {
    this.collapsed.update((v) => !v);
    if (this.collapsed()) this.openMenus.set(new Set());
    this.collapseChange.emit(this.collapsed());
  }

  toggleMenu(key: string) {
    this.openMenus.update((set) => {
      const next = new Set(set);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  isOpen(key: string): boolean {
    return this.openMenus().has(key);
  }

  onNavClick() {
    if (this.isMobile()) this.closeMobile.emit();
  }
}
