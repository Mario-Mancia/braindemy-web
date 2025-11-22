import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

/**
 * @public
 * CanActivateFn que protege rutas de acceso público (ej. login, registro).
 *
 * Esta función se utiliza para evitar que un usuario autenticado y con una sesión válida
 * acceda a la página de login o registro, mejorando la UX al redirigirlos automáticamente.
 *
 * Lógica:
 * 1. Verifica si existe un accessToken y si NO está expirado.
 * 2. Si la sesión es válida, redirige al usuario a la ruta principal de la aplicación ('/teacher')
 * e impide el acceso a la ruta actual (`return false`).
 * 3. Si el token no existe, está expirado, o la sesión no es válida, permite el acceso (`return true`).
 *
 * @returns Un booleano que indica si la navegación a la ruta protegida es permitida.
 * @see {@link AuthService}
 */
export const noAuthGuard: CanActivateFn = () => {

  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.accessToken;
  const user = auth.user;

  if (token && !auth.isTokenExpired(token) && user) {

    // Redirección correcta según rol
    if (user.role === 'admin') {
      router.navigate(['/admin']);
    } else if (user.role === 'teacher') {
      router.navigate(['/teacher']);
    } else {
      router.navigate(['/']);
    }

    return false;
  }

  return true;
};
