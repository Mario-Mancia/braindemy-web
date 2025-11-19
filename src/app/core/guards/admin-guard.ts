import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.accessToken;
  const user = auth.user;

  // Si no hay user o no hay token → login
  if (!token || !user) {
    router.navigate(['/auth/login']);
    return false;
  }

  // Si el token no ha expirado
  if (!auth.isTokenExpired(token)) {
    if (user.role === 'admin') return true;

    router.navigate(['/forbidden']);
    return false;
  }

  // Token expiró → intentar refresh
  if (auth.refreshToken) {
    return auth.refresh().pipe(
      map(() => {
        const updatedUser = auth.user;

        if (updatedUser?.role === 'admin') return true;

        router.navigate(['/forbidden']);
        return false;
      }),
      catchError(() => {
        auth.logout();
        router.navigate(['/auth/login']);
        return of(false);
      })
    );
  }

  // No hay refresh token
  auth.logout();
  router.navigate(['/auth/login']);
  return false;
};
