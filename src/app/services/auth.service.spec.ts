import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { of } from 'rxjs';
import { AuthenticationService } from '../core/api/generated/api/authentication.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const api = {
    authenticate: vi.fn(),
    refreshToken: vi.fn(),
    logout: vi.fn(),
  };

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie = 'maes_csrf=; Max-Age=0; Path=/';
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideRouter([]),
        { provide: AuthenticationService, useValue: api },
      ],
    });
  });

  it('authenticates and stores a non-persistent session', () => {
    api.authenticate.mockReturnValue(of({
      id: 7,
      accessToken: 'header.payload.signature',
    }));
    const service = TestBed.inject(AuthService);

    service.login('admin', 'secret1', false).subscribe();

    expect(api.authenticate).toHaveBeenCalledWith({ username: 'admin', password: 'secret1' });
    expect(service.isAuthenticated()).toBe(true);
    expect(service.user()?.email).toBe('admin');
    expect(sessionStorage.getItem('maes_auth_session')).toBeTruthy();
    expect(localStorage.getItem('maes_auth_session')).toBeNull();
  });

  it('refreshes the access token using the HttpOnly cookie', () => {
    document.cookie = 'maes_csrf=csrf-token; Path=/';
    api.authenticate.mockReturnValue(of({
      accessToken: 'access-one',
    }));
    api.refreshToken.mockReturnValue(of({
      accessToken: 'access-two',
    }));
    const service = TestBed.inject(AuthService);
    service.login('admin', 'secret1', true).subscribe();

    service.refreshAccessToken().subscribe((token) => expect(token).toBe('access-two'));

    expect(api.refreshToken).toHaveBeenCalledWith(undefined, undefined, 'csrf-token');
    expect(service.getAccessToken()).toBe('access-two');
    expect(localStorage.getItem('maes_auth_session')).not.toContain('refresh');
  });

  it('detects an expired access token before sending a protected request', () => {
    const payload = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) - 1 }));
    api.authenticate.mockReturnValue(of({ accessToken: `header.${payload}.signature` }));
    const service = TestBed.inject(AuthService);
    service.login('admin', 'secret1', false).subscribe();

    expect(service.isAccessTokenExpiring()).toBe(true);
  });

  it('sends the CSRF cookie in the logout header parameter', () => {
    document.cookie = 'maes_csrf=csrf-token; Path=/';
    api.authenticate.mockReturnValue(of({ accessToken: 'access-one' }));
    api.logout.mockReturnValue(of(undefined));
    const service = TestBed.inject(AuthService);
    vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    service.login('admin', 'secret1', false).subscribe();

    service.logout();

    expect(api.logout).toHaveBeenCalledWith(undefined, undefined, 'csrf-token');
  });
});
