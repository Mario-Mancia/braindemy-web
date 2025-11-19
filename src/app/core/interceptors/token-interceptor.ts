import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  let authReq = req;

  const token = auth.accessToken;
  const router = inject(Router);

  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(authReq).pipe(
    catchError(err => {
      if (err.status === 401 && auth.refreshToken) {
        return auth.refresh().pipe(
          switchMap(() => {
            const newReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${auth.accessToken}`
              }
            });
            return next(newReq);
          }),
          catchError(() => {
            // si falla refresco → logout
            auth.logout();
            router.navigate(['/auth/login']);
            return throwError(() => err);
          })
        );
      }
      return throwError(() => err);
    })
  );
}