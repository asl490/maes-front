import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';

const AUTH_PATH = '/auth/';
const AUTH_RETRIED = new HttpContextToken<boolean>(() => false);

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const isAuthRequest = request.url.includes(AUTH_PATH);
  const accessToken = auth.getAccessToken();

  const authenticatedRequest = !isAuthRequest && accessToken
    ? request.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
    : request;

  if (!isAuthRequest && accessToken && auth.isAccessTokenExpiring()) {
    return auth.refreshAccessToken().pipe(
      catchError((refreshError: unknown) => {
        auth.expireSession();
        return throwError(() => refreshError);
      }),
      switchMap((token) => next(request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`),
        context: request.context.set(AUTH_RETRIED, true),
      }))),
    );
  }

  return next(authenticatedRequest).pipe(
    catchError((error: unknown) => {
      const canRefresh = error instanceof HttpErrorResponse
        && error.status === 401
        && !isAuthRequest
        && !request.context.get(AUTH_RETRIED)
        && auth.canRefreshSession();

      if (!canRefresh) return throwError(() => error);

      return auth.refreshAccessToken().pipe(
        catchError((refreshError: unknown) => {
          auth.expireSession();
          return throwError(() => refreshError);
        }),
        switchMap((token) => next(request.clone({
          headers: request.headers.set('Authorization', `Bearer ${token}`),
          context: request.context.set(AUTH_RETRIED, true),
        }))),
      );
    }),
  );
};
