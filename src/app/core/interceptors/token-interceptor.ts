import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

/**
 * @public
 * HttpInterceptorFn que gestiona la inyección y el refresco automático de tokens JWT.
 *
 * Este interceptor es el responsable de adjuntar el 'accessToken' a cada solicitud saliente
 * y de manejar los errores 401 (No Autorizado) de la API.
 *
 * Lógica de Refresco de Tokens (en caso de error 401):
 * 1. Verifica si la respuesta HTTP es un error **401 (Unauthorized)** y si existe un **refreshToken**.
 * 2. Si es así, realiza una llamada asíncrona para **refrescar el token** (`auth.refresh()`).
 * 3. Si el refresh es exitoso, **clona la solicitud original** con el nuevo `accessToken` y
 *  la **reintenta** (`next(newReq)`).
 * 4. Si el refresh falla, el usuario es deslogueado (`auth.logout()`) y redirigido a la página de login.
 *
 * @param req La solicitud HTTP saliente.
 * @param next La función para manejar la solicitud.
 * @returns Un Observable que completa con la respuesta HTTP o un error.
 * @see {@link AuthService} para los métodos de manejo de tokens.
 */
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
            // si falla refresco - logout
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