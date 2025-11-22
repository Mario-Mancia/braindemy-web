import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

/**
 * @public
 * CanActivateFn que protege rutas asegurando que el usuario tenga una sesión activa y válida.
 *
 * Implementa una estrategia de validación de tokens en cuatro pasos:
 * 1. Verifica la existencia del accessToken: si no existe, redirige a /auth/login.
 * 2. Verifica la expiración del accessToken: si es válido, permite el acceso (`return true`).
 * 3. Si el accessToken ha expirado, verifica la existencia del refreshToken. Si no hay refreshToken,
 *  cierra la sesión y redirige a /auth/login.
 * 4. Si existe el refreshToken, intenta refrescar la sesión de forma asíncrona.
 * - Si el refresh es exitoso, permite el acceso (`return true` dentro del pipe).
 * - Si el refresh falla, cierra la sesión y redirige a /auth/login.
 *
 * @returns Un booleano (`boolean` o `Observable<boolean>`) que indica si la navegación a 
 * la ruta protegida es permitida.
 * @see {@link AuthService} para la lógica de validación, refresh y logout.
 */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.accessToken;

  // 1.
  if (!token) {
    router.navigate(['/auth/login']);
    return false;
  }

  // 2.
  if (!auth.isTokenExpired(token)) {
    return true;
  }

  // 3.
  const refreshToken = auth.refreshToken;

  if (!refreshToken) {
    auth.logout();
    router.navigate(['/auth/login']);
    return false;
  }

  // 4.
  return auth.refresh().pipe(
    map(() => true),
    catchError(() => {
      auth.logout();
      router.navigate(['/auth/login']);
      return of(false);
    })
  );
};

