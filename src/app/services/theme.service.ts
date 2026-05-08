import { Injectable, signal, computed, effect } from '@angular/core';

export type ThemeMode = 'dark' | 'light' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'nexadmin_theme';

  mode = signal<ThemeMode>(this.loadMode());

  isDark = computed(() => {
    if (this.mode() === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return this.mode() === 'dark';
  });

  constructor() {
    effect(() => {
      this.applyTheme(this.isDark());
      localStorage.setItem(this.STORAGE_KEY, this.mode());
    });

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (this.mode() === 'system') {
        this.applyTheme(this.isDark());
      }
    });
  }

  setMode(mode: ThemeMode) {
    this.mode.set(mode);
  }

  private applyTheme(dark: boolean) {
    const html = document.documentElement;
    if (dark) {
      html.classList.add('dark');
      html.classList.remove('light');
    } else {
      html.classList.add('light');
      html.classList.remove('dark');
    }
  }

  private loadMode(): ThemeMode {
    const saved = localStorage.getItem(this.STORAGE_KEY) as ThemeMode;
    return saved ?? 'dark';
  }
}
