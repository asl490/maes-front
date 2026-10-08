import { isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, finalize, map, shareReplay, tap } from 'rxjs';
import { AuthenticationService } from '../core/api/generated/api/authentication.service';
import { AuthResponse } from '../core/api/generated/model/authResponse';

export interface AuthUser {
  id?: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

interface AuthSession {
  accessToken: string;
  user: AuthUser;
  persistent: boolean;
}

interface JwtClaims {
  [key: string]: unknown;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly sessionKey = 'maes_auth_session';
  private readonly api = inject(AuthenticationService);
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly session = signal<AuthSession | null>(this.loadSession());
  private refreshRequest?: Observable<string>;

  readonly user = computed(() => this.session()?.user ?? null);
  readonly isAuthenticated = computed(() => this.session() !== null);

  login(username: string, password: string, rememberMe: boolean): Observable<AuthUser> {
    return this.api.authenticate({ username, password }).pipe(
      map((response) => this.createSession(response, username, rememberMe)),
      tap((session) => this.saveSession(session)),
      map((session) => session.user),
    );
  }

  logout(): void {
    if (!this.session()) {
      this.clearSessionAndRedirect();
      return;
    }

    this.api.logout(undefined, undefined, this.readCookie('maes_csrf') ?? undefined).pipe(
      finalize(() => this.clearSessionAndRedirect()),
    ).subscribe({ error: () => undefined });
  }

  getAccessToken(): string | null {
    return this.session()?.accessToken ?? null;
  }

  isAccessTokenExpiring(leewaySeconds = 5): boolean {
    const token = this.getAccessToken();
    if (!token) return false;
    const expiration = this.decodeClaims(token)['exp'];
    return typeof expiration === 'number'
      && expiration * 1000 <= Date.now() + leewaySeconds * 1000;
  }

  canRefreshSession(): boolean {
    return this.session() !== null;
  }

  refreshAccessToken(): Observable<string> {
    if (this.refreshRequest) {
      return this.refreshRequest;
    }

    const current = this.session();
    if (!current) {
      throw new Error('No authenticated session is available.');
    }

    this.refreshRequest = this.api.refreshToken(
      undefined,
      undefined,
      this.readCookie('maes_csrf') ?? undefined,
    ).pipe(
      map((response) => this.updateSessionTokens(current, response)),
      tap((session) => this.saveSession(session)),
      map((session) => session.accessToken),
      finalize(() => { this.refreshRequest = undefined; }),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    return this.refreshRequest;
  }

  expireSession(): void {
    this.clearSessionAndRedirect();
  }

  private createSession(response: AuthResponse, username: string, persistent: boolean): AuthSession {
    if (!response.accessToken) {
      throw new Error('Authentication response did not include an access token.');
    }

    const claims = this.decodeClaims(response.accessToken);
    const displayName = this.stringClaim(claims, 'name')
      ?? this.stringClaim(claims, 'preferred_username')
      ?? username;
    const email = this.stringClaim(claims, 'email') ?? username;

    return {
      accessToken: response.accessToken,
      persistent,
      user: {
        id: response.id,
        name: displayName,
        email,
        role: this.readRole(claims),
        avatar: this.initials(displayName),
      },
    };
  }

  private updateSessionTokens(current: AuthSession, response: AuthResponse): AuthSession {
    if (!response.accessToken) {
      throw new Error('Refresh response did not include an access token.');
    }

    return {
      ...current,
      accessToken: response.accessToken,
    };
  }

  private saveSession(session: AuthSession): void {
    this.session.set(session);
    if (!this.isBrowser) return;

    localStorage.removeItem(this.sessionKey);
    sessionStorage.removeItem(this.sessionKey);
    this.storage(session.persistent).setItem(this.sessionKey, JSON.stringify(session));
  }

  private loadSession(): AuthSession | null {
    if (!this.isBrowser) return null;

    for (const storage of [sessionStorage, localStorage]) {
      try {
        const raw = storage.getItem(this.sessionKey);
        if (!raw) continue;
        const session = JSON.parse(raw) as AuthSession;
        if (session.accessToken && session.user) {
          // Rebuild the object so refresh tokens left by older versions are discarded.
          return {
            accessToken: session.accessToken,
            user: session.user,
            persistent: session.persistent,
          };
        }
      } catch {
        storage.removeItem(this.sessionKey);
      }
    }
    return null;
  }

  private clearSessionAndRedirect(): void {
    this.session.set(null);
    if (this.isBrowser) {
      localStorage.removeItem(this.sessionKey);
      sessionStorage.removeItem(this.sessionKey);
    }
    void this.router.navigate(['/login']);
  }

  private storage(persistent: boolean): Storage {
    return persistent ? localStorage : sessionStorage;
  }

  private readCookie(name: string): string | null {
    if (!this.isBrowser) return null;

    const prefix = `${encodeURIComponent(name)}=`;
    const cookie = document.cookie
      .split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith(prefix));

    if (!cookie) return null;
    try {
      return decodeURIComponent(cookie.slice(prefix.length));
    } catch {
      return cookie.slice(prefix.length);
    }
  }

  private decodeClaims(token: string): JwtClaims {
    if (!this.isBrowser) return {};
    try {
      const payload = token.split('.')[1];
      if (!payload) return {};
      const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(normalized)) as JwtClaims;
    } catch {
      return {};
    }
  }

  private stringClaim(claims: JwtClaims, key: string): string | null {
    const value = claims[key];
    return typeof value === 'string' && value.trim() ? value : null;
  }

  private readRole(claims: JwtClaims): string {
    const value = claims['roles'] ?? claims['authorities'] ?? claims['role'];
    if (Array.isArray(value)) return value.filter((role): role is string => typeof role === 'string').join(', ');
    return typeof value === 'string' ? value : 'User';
  }

  private initials(name: string): string {
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'U';
  }
}
