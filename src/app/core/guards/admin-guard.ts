import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

/**
 * @public
 * CanActivateFn que protege rutas y restringe el acceso solo a usuarios con el rol 'admin'.
 *
 * Realiza una verificación de tres pasos:
 * 1. Verifica si existe un token de acceso y un usuario logueado. Si no, redirige a /auth/login.
 * 2. Verifica la validez del token: si es válido y el rol es 'admin', permite el acceso. 
 * Si no es 'admin', redirige a /forbidden.
 * 3. Si el token ha expirado, intenta refrescar la sesión. Si tiene éxito y el nuevo rol 
 * es 'admin', permite el acceso.
 * 4. Si el refresh falla o no hay refreshToken, cierra la sesión y redirige a /auth/login.
 *
 * @returns Un booleano (`boolean` o `Observable<boolean>`) que indica si la navegación es permitida.
 * @see {@link AuthService} para la lógica de autenticación y manejo de tokens.
 */
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
