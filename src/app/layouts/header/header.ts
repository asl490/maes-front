import { Component, signal, output, input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ThemeService, ThemeMode } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  isMobile = input(false);
  notifOpen = signal(false);
  profileOpen = signal(false);
  themeOpen = signal(false);

  menuToggle = output<void>();

  notifications = [
    { icon: 'check', color: 'emerald', title: 'Despiece completado', desc: 'El proyecto MAES-0241 está listo', time: 'Hace 8 min', unread: true },
    { icon: 'chart', color: 'violet', title: 'Cotización generada', desc: 'Ropero premium · MAES-0240', time: 'Hace 42 min', unread: true },
    { icon: 'user', color: 'sky', title: 'Nuevo cliente', desc: 'Andrea Salas fue registrada', time: 'Hace 2 h', unread: false },
    { icon: 'alert', color: 'amber', title: 'Diseño pendiente', desc: 'Faltan dimensiones en MAES-0238', time: 'Hace 3 h', unread: false },
  ];

  themes: { mode: ThemeMode; label: string; icon: string }[] = [
    { mode: 'light',  label: 'Claro',  icon: 'sun'    },
    { mode: 'dark',   label: 'Oscuro', icon: 'moon'   },
    { mode: 'system', label: 'Sistema', icon: 'system' },
  ];

  get unreadCount() { return this.notifications.filter((n) => n.unread).length; }
  get user()        { return this.auth.user(); }
  get currentMode() { return this.theme.mode(); }

  constructor(public auth: AuthService, public theme: ThemeService) {}

  toggleNotif()  { this.notifOpen.update((v) => !v);  this.profileOpen.set(false); this.themeOpen.set(false); }
  toggleProfile(){ this.profileOpen.update((v) => !v); this.notifOpen.set(false);  this.themeOpen.set(false); }
  toggleTheme()  { this.themeOpen.update((v) => !v);   this.notifOpen.set(false);  this.profileOpen.set(false); }
  closeAll()     { this.notifOpen.set(false); this.profileOpen.set(false); this.themeOpen.set(false); }
  logout()       { this.auth.logout(); }
  setTheme(mode: ThemeMode) { this.theme.setMode(mode); this.themeOpen.set(false); }
}
