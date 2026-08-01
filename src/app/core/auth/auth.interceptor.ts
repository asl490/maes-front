import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';

const AUTH_PATH = '/auth/';
const RETRY_HEADER = 'X-Auth-Retry';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const isAuthRequest = request.url.includes(AUTH_PATH);
  const accessToken = auth.getAccessToken();

  const authenticatedRequest = !isAuthRequest && accessToken
    ? request.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
    : request;

  return next(authenticatedRequest).pipe(
    catchError((error: unknown) => {
      const canRefresh = error instanceof HttpErrorResponse
        && error.status === 401
        && !isAuthRequest
        && !request.headers.has(RETRY_HEADER)
        && auth.hasRefreshToken();

      if (!canRefresh) return throwError(() => error);

      return auth.refreshAccessToken().pipe(
        switchMap((token) => next(request.clone({
          headers: request.headers
            .set('Authorization', `Bearer ${token}`)
            .set(RETRY_HEADER, '1'),
        }))),
        catchError((refreshError: unknown) => {
          auth.expireSession();
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
