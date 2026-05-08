import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemeService, ThemeMode } from '../../services/theme.service';

@Component({
  selector: 'app-settings',
  imports: [FormsModule],
  templateUrl: './settings.html',
})
export class Settings {
  activeTab = signal('profile');

  tabs = [
    { id: 'profile', label: 'Profile', icon: 'user' },
    { id: 'security', label: 'Security', icon: 'lock' },
    { id: 'notifications', label: 'Notifications', icon: 'bell' },
    { id: 'appearance', label: 'Appearance', icon: 'palette' },
  ];

  themeOptions: { mode: ThemeMode; label: string }[] = [
    { mode: 'light', label: 'Light' },
    { mode: 'dark', label: 'Dark' },
    { mode: 'system', label: 'System' },
  ];

  notifications = [
    { id: 'email_updates', label: 'Email Updates', desc: 'Receive product updates via email', enabled: true },
    { id: 'security_alerts', label: 'Security Alerts', desc: 'Get notified about suspicious activity', enabled: true },
    { id: 'marketing', label: 'Marketing Emails', desc: 'Promotions, tips and offers', enabled: false },
    { id: 'weekly_digest', label: 'Weekly Digest', desc: 'Summary of your weekly activity', enabled: true },
    { id: 'new_features', label: 'New Features', desc: 'Be the first to know about new features', enabled: false },
  ];

  constructor(public themeService: ThemeService) {}

  setTab(id: string) { this.activeTab.set(id); }
  toggleNotif(n: { enabled: boolean }) { n.enabled = !n.enabled; }
}
