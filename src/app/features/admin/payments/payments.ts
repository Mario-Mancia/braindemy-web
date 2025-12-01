import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payments',
  standalone: false,
  templateUrl: './payments.html',
  styleUrl: './payments.css',
})
export class Payments implements OnInit {

  apiUrl = environment.apiUrl;
  private debounceTimer: any;

  payments: any[] = [];

  // FILTROS COMPATIBLES CON BACKEND (fecha única)
  filters = {
    user_id: '',
    status: '',
    course_id: '',
    date: ''   // <---- reemplazo de los antiguos from/to
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  // -----------------------------
  // DEBOUNCE (para inputs text)
  // -----------------------------
  debouncedLoad() {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.loadPayments();
    }, 300);
  }

  // -----------------------------
  // Cargar pagos
  // -----------------------------
  loadPayments() {
    const params: any = {};

    if (this.filters.user_id)   params.user_id = this.filters.user_id;
    if (this.filters.status)    params.status = this.filters.status;
    if (this.filters.course_id) params.course_id = this.filters.course_id;
    if (this.filters.date)      params.date = this.filters.date;  // <---- el nuevo filtro único

    console.info("[PAYMENTS] Cargando con:", params);

    this.http.get<any[]>(`${this.apiUrl}/payments`, { params })
      .subscribe({
        next: res => {
          this.payments = Array.isArray(res) ? res : [];
          console.log("[PAYMENTS] Resultados:", this.payments.length);
          this.cdr.detectChanges();
        },
        error: err => {
          console.error("[PAYMENTS] Error:", err);
        }
      });
  }

  // -----------------------------
  // Reset
  // -----------------------------
  resetFilters() {
    this.filters = {
      user_id: '',
      status: '',
      course_id: '',
      date: ''   // <---- reset correcto del nuevo filtro
    };

    this.loadPayments();
  }

  // -----------------------------
  // Navegación
  // -----------------------------
  goToDetail(id: string) {
    this.router.navigate(['/admin/payment-detail', id]);
  }
}