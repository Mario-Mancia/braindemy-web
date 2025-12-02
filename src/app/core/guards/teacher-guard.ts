import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, from, map, of, switchMap } from 'rxjs';
import { authGuard } from './auth-guard';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const teacherGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const http = inject(HttpClient);
  const router = inject(Router);
  const api = environment.apiUrl;

  // 1. Verificar sesión primero
  const sessionValid = authGuard(route, state);

  return from(Promise.resolve(sessionValid)).pipe(
    switchMap(valid => {
      if (!valid) return of(false);

      const user = auth.user;

      // ❌ 2. Si NO es rol teacher → prohibido
      if (!user || user.role !== 'teacher') {
        router.navigate(['/forbidden']);
        return of(false);
      }

      // 3. Verificar si tiene perfil teacher en la BD
      return http.get<{ status: string }>(`${api}/teachers/check/status`).pipe(
        map(response => {

          // ✔ Tiene perfil -> acceso permitido
          if (response.status === 'has_profile') {
            return true;
          }

          // ❗ No tiene perfil -> mandar al proceso de aplicación
          router.navigate(['/auth/teacher-application']);
          return false;
        }),

        catchError(() => {
          // Error inesperado -> bloquear
          router.navigate(['/forbidden']);
          return of(false);
        })
      );
    })
  );
};

/*
export const teacherGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // 1. Primero: validar la sesión con el guard normal.
  const sessionValid = authGuard(route, state);

  // authGuard puede devolver boolean o Observable<boolean>.
  // Debemos normalizarlo.
  return from(Promise.resolve(sessionValid)).pipe(
    switchMap((ok) => {
      if (!ok) return of(false);

      // 2. Sesión válida → verificar rol
      const user = auth.user;

      if (user && user.role === 'teacher') {
        return of(true);
      }

      router.navigate(['/forbidden']);
      return of(false);
    })
  );
};*/

/*
export const teacherGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.accessToken;
  const user = auth.user;

  if (!token || !user) {
    router.navigate(['/auth/login']);
    return false;
  }

  if (!auth.isTokenExpired(token) && user.role === 'teacher') {
    return true;
  }

  // refresh si expiró
  if (auth.refreshToken) {
    return auth.refresh().pipe(
      map(() => {
        const updatedUser = auth.user;
        if (updatedUser.role === 'teacher') return true;

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

  auth.logout();
  router.navigate(['/auth/login']);
  
  return false;
};
*/