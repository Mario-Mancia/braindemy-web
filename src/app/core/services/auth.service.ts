import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

/**
 * @public
 * Servicio centralizado para la gestión de la autenticación de usuarios y la política de tokens (JWT).
 *
 * Es responsable de:
 * 1. Interactuar con la API para el inicio de sesión, cierre de sesión y refresco de tokens.
 * 2. Persistir los tokens (accessToken, refreshToken) y los datos del usuario en el localStorage.
 * 3. Proveer métodos para verificar la validez de los tokens.
 * 4. Gestionar la navegación del usuario al iniciar/cerrar sesión.
 *
 * @injectable
 */
@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  private api = `${environment.apiUrl}/auth`;

  // -- FUNCIONES PARA LECTURA DE ESTADOS --
  /**
     * @public
     * Getter para recuperar el accessToken del almacenamiento local.
     * @returns El accessToken como string, o `null` si no existe.
     */
  get accessToken() {
    return localStorage.getItem('accessToken');
  }

  /**
     * @public
     * Getter para recuperar el refreshToken del almacenamiento local.
     * @returns El refreshToken como string, o `null` si no existe.
     */
  get refreshToken() {
    return localStorage.getItem('refreshToken');
  }

  /**
     * @public
     * Getter para recuperar y parsear el objeto de usuario del almacenamiento local.
     * @returns El objeto de usuario, o `null` si no está guardado o el parseo falla.
     */
  get user() {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  }

  /**
     * @public
     * Verifica si un token JWT ha expirado.
     *
     * Decodifica el payload del token y compara la marca de tiempo de expiración (exp)
     * con la hora actual del sistema.
     *
     * @param token El token JWT a verificar (accessToken).
     * @returns `true` si el token ha expirado o es inválido, `false` si sigue siendo válido.
     */
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      return Date.now() > exp;
    } catch {
      return true;
    }
  }

  // -- FUNCIONES PARA REALIZAR ACCIONES --

  /**
   * @public
   * Registra un nuevo usuario en el backend.
   * @param data Objeto con los datos del usuario (first_name, last_name, email, birthdate, password)
   * @returns Observable con la respuesta del backend.
   */
  register(data: any) {
    return this.http.post(`${this.api}/register`, data);
  }

  /**
     * @public
     * Envía las credenciales al backend para iniciar sesión.
     *
     * Si la llamada es exitosa, guarda el `accessToken`, `refreshToken` y el objeto `user`
     * en el almacenamiento local antes de que el Observable complete.
     *
     * @param data Objeto con el email y la contraseña del usuario.
     * @returns Un Observable que emite la respuesta completa del servidor (incluyendo tokens).
     */
  login(data: { email: string; password: string }) {
    return this.http.post(`${this.api}/login`, data).pipe(
      tap((res: any) => {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        localStorage.setItem('user', JSON.stringify(res.user));
      })
    );
  }

  /**
     * @public
     * Cierra la sesión activa del usuario.
     *
     * Intenta notificar al backend para invalidar el refreshToken. Independientemente del
     * resultado del backend (éxito o error), limpia el almacenamiento local y redirige
     * al usuario a la página de login.
     */
  logout() {
    const refreshToken = this.refreshToken;
    if (!refreshToken) {
      localStorage.clear();
      this.router.navigate(['/auth/login']);
      return;
    }

    this.http.post(`${this.api}/logout`, { refreshToken }).subscribe({
      next: () => {
        localStorage.clear();
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        localStorage.clear();
        this.router.navigate(['/auth/login']);
      }
    });
  }

  
  /**
     * @public
     * Intenta renovar el `accessToken` usando el `refreshToken`.
     *
     * Se utiliza principalmente en el {@link tokenInterceptor} cuando un accessToken ha expirado
     * pero la sesión aún puede ser recuperada. Si tiene éxito, actualiza ambos tokens localmente.
     *
     * @returns Un Observable que emite la respuesta del servidor con los nuevos tokens.
     */
  refresh() {
    return this.http.post(`${this.api}/refresh`, {
      refreshToken: this.refreshToken
    }).pipe(
      tap((res: any) => {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
      })
    );
  }

}