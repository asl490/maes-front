import { NgTemplateOutlet } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
  styleUrl: './sidebar.css',
})
export class Sidebar {
  isMobile = input(false);
  collapsed = signal(false);
  collapseChange = output<boolean>();
  closeMobile = output<void>();

  openMenus = signal<Set<string>>(new Set());

  navGroups: NavGroup[] = [
    {
      title: 'Principal',
      items: [
        { label: 'Inicio', route: '/app/dashboard', icon: 'dashboard' },
        {
          label: 'Nuevo diseño',
          route: '/demo',
          icon: 'charts',
          badge: 'Demo',
          badgeType: 'violet',
        },
      ],
    },
    {
      title: 'Gestión',
      items: [
        { label: 'Usuarios', route: '/app/users', icon: 'users' },
        { label: 'Personas', route: '/app/people', icon: 'people' },
        { label: 'Calendario', route: '/app/calendar', icon: 'calendar' },
      ],
    },
    {
      title: 'Catálogo',
      items: [
        { label: 'Categorías', route: '/app/categories', icon: 'categories' },
        { label: 'Subcategorías', route: '/app/subcategories', icon: 'subcategories' },
        { label: 'Muebles', route: '/app/furniture', icon: 'furniture' },
        { label: 'Melaminas', route: '/app/melamine-colors', icon: 'melamine-colors' },
        { label: 'Parámetros', route: '/app/parameters', icon: 'parameters' },
        // { label: 'Constantes del sistema', route: '/app/system-constants', icon: 'system-constants' },
        {
          label: 'Artículos complementarios',
          route: '/app/complementary-articles',
          icon: 'complementary-articles',
        },
      ],
    },
    {
      title: 'Información',
      items: [
        { label: 'Analítica', route: '/app/analytics', icon: 'analytics' },
        { label: 'Gráficos', route: '/app/charts', icon: 'charts' },
        { label: 'Configuración', route: '/app/settings', icon: 'settings' },
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
