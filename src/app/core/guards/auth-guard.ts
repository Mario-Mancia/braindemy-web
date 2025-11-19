import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.accessToken;

  // 1. Si no hay token → login
  if (!token) {
    router.navigate(['/auth/login']);
    return false;
  }

  // 2. Si el token NO está expirado → pasa
  if (!auth.isTokenExpired(token)) {
    return true;
  }

  // 3. Si el access token expiró → intentar refresh
  const refreshToken = auth.refreshToken;

  if (!refreshToken) {
    // No hay refresh token → cerrar sesión
    auth.logout();
    router.navigate(['/auth/login']);
    return false;
  }

  // 4. Intentar refrescar token → si funciona, dejar pasar
  return auth.refresh().pipe(
    map(() => true),
    catchError(() => {
      auth.logout();
      router.navigate(['/auth/login']);
      return of(false);
    })
  );
};

