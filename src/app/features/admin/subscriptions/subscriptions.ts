import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscriptions',
  standalone: false,
  templateUrl: './subscriptions.html',
  styleUrl: './subscriptions.css',
})
export class Subscriptions implements OnInit {

  apiUrl = environment.apiUrl;

  // Datos cargados desde el backend
  subscriptions: any[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  // ============================================================
  // INIT
  // ============================================================
  ngOnInit(): void {
    console.log('%c[SUBSCRIPTIONS] Inicializando componente...', 'color:#3498db;font-weight:bold');
    this.loadSubscriptions();
  }

  // ============================================================
  // CARGA PRINCIPAL
  // ============================================================
  loadSubscriptions() {
    console.info('[SUBSCRIPTIONS] Cargando modelos de suscripción...');

    this.http.get<any>(`${this.apiUrl}/subscriptions`)
      .subscribe({
        next: (res) => {

          // Se espera que el backend responda: { data: [...] }
          this.subscriptions = res || [];

          console.log(
            `%c[SUBSCRIPTIONS] Suscripciones cargadas correctamente: ${this.subscriptions.length}`,
            'color:#2ecc71;font-weight:bold'
          );

          if (this.subscriptions.length === 0) {
            console.warn('[SUBSCRIPTIONS] No hay modelos de suscripción registrados.');
          }

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('[SUBSCRIPTIONS] Error al cargar suscripciones:', err);
          alert('Error al cargar los modelos de suscripción. Ver consola.');
        }
      });
  }

  // ============================================================
  // NAVEGACIÓN — Ir a detalle
  // ============================================================
  goToDetail(id: string) {
    console.log(`[SUBSCRIPTIONS] Redirigiendo al detalle de la suscripción: ${id}`);

    this.router.navigate(['/admin/subscription-detail', id]).then(ok => {
      if (ok) {
        console.log('%c[SUBSCRIPTIONS] Navegación exitosa al detalle.', 'color:#8e44ad');
      } else {
        console.warn('[SUBSCRIPTIONS] Navegación cancelada o fallida.');
      }
    });
  }
}