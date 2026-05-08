import { Component, signal, output, input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ThemeService, ThemeMode } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
})
export class Header {
  isMobile = input(false);
  notifOpen = signal(false);
  profileOpen = signal(false);
  themeOpen = signal(false);

  menuToggle = output<void>();

  notifications = [
    { icon: 'user',  color: 'violet',  title: 'New user registered',  desc: 'Sarah Connor joined the platform', time: '2m ago',  unread: true  },
    { icon: 'chart', color: 'emerald', title: 'Revenue milestone',    desc: 'Monthly goal reached at 94%',      time: '1h ago',  unread: true  },
    { icon: 'alert', color: 'amber',   title: 'System alert',         desc: 'Server load above 80% threshold',  time: '3h ago',  unread: false },
    { icon: 'check', color: 'sky',     title: 'Deployment complete',  desc: 'v2.4.1 deployed successfully',     time: '5h ago',  unread: false },
  ];

  themes: { mode: ThemeMode; label: string; icon: string }[] = [
    { mode: 'light',  label: 'Light',  icon: 'sun'    },
    { mode: 'dark',   label: 'Dark',   icon: 'moon'   },
    { mode: 'system', label: 'System', icon: 'system' },
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
