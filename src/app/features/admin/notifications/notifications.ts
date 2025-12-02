import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  standalone: false,
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications implements OnInit {

  apiUrl = environment.apiUrl;

  loading = false;
  error = '';
  applications: any[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('%c[APPLICATIONS] Componente inicializado', 'color:#8e44ad');
    this.loadApplications();
  }

  // -----------------------------------------
  // Cargar solicitudes pendientes
  // -----------------------------------------
  loadApplications() {
    this.loading = true;
    this.error = '';

    this.http.get<any>(`${this.apiUrl}/teacher-applications/pending`)
      .subscribe({
        next: res => {
          this.applications = res.data || [];
          this.loading = false;
          this.cdr.detectChanges();
          console.log('aplicaciones recuperadas');
        },
        error: err => {
          console.error('[APPLICATIONS] Error:', err);
          this.error = err?.error?.message || 'Error cargando solicitudes';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  // -----------------------------------------
  // Navegar al detalle
  // -----------------------------------------
  goToDetails(id: string) {
    this.router.navigate(['/admin/teacher-applications', id]);
  }

  goBack() {
    this.router.navigate(['/admin/dashboard']);
  }
}
