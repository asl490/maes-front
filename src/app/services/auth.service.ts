import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

export interface AuthUser {
  name: string;
  email: string;
  role: string;
  avatar: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly SESSION_KEY = 'nexadmin_session';

  private _user = signal<AuthUser | null>(this.loadSession());
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);

  constructor(private router: Router) {}

  login(email: string, password: string): boolean {
    // Demo credentials
    if (email === 'admin@nexadmin.com' && password === 'admin123') {
      const user: AuthUser = {
        name: 'David',
        email: 'admin@nexadmin.com',
        role: 'Administrator',
        avatar: 'DV',
      };
      this._user.set(user);
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
      return true;
    }
    return false;
  }

  logout() {
    this._user.set(null);
    localStorage.removeItem(this.SESSION_KEY);
    this.router.navigate(['/login']);
  }

  private loadSession(): AuthUser | null {
    try {
      const raw = localStorage.getItem(this.SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
