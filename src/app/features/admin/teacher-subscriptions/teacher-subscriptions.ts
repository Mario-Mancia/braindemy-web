import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teacher-subscriptions',
  standalone: false,
  templateUrl: './teacher-subscriptions.html',
  styleUrl: './teacher-subscriptions.css',
})
export class TeacherSubscriptions implements OnInit {

  apiUrl = environment.apiUrl;
  private debounceTimer: any;

  subscriptions: any[] = [];

  // --------------------------------------------------------
  // PAGINACIÓN REAL
  // --------------------------------------------------------
  page = 1;
  limit = 12;
  total = 0;
  totalPages = 0;
  hasMore = false;

  // --------------------------------------------------------
  // FILTROS
  // --------------------------------------------------------
  filters = {
    search: '',
    status: '',
    teacher_id: '',
    subscription_id: ''
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSubscriptions();
  }

  // --------------------------------------------------------
  // BÚSQUEDA CON DEBOUNCE
  // --------------------------------------------------------
  debouncedLoad() {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.page = 1;
      this.loadSubscriptions();
    }, 300);
  }

  // --------------------------------------------------------
  // CARGA PRINCIPAL
  // --------------------------------------------------------
  loadSubscriptions() {
  console.info('[TEACHER SUBSCRIPTIONS] Cargando suscripciones (frontend filtering)...');

  this.http.get<any>(`${this.apiUrl}/teacher-subscriptions`)
    .subscribe({
      next: res => {
        let list = res || [];

        // -------------------------------------
        // APLICAR FILTROS EN FRONTEND
        // -------------------------------------
        if (this.filters.search) {
          const text = this.filters.search.toLowerCase();
          list = list.filter((s: any) =>
            (s.teacher?.name || '').toLowerCase().includes(text) ||
            (s.subscription?.title || '').toLowerCase().includes(text)
          );
        }

        if (this.filters.status) {
          list = list.filter((s: any) => s.status === this.filters.status);
        }

        if (this.filters.teacher_id) {
          list = list.filter((s: any) =>
            (s.teacher_id || '').includes(this.filters.teacher_id)
          );
        }

        if (this.filters.subscription_id) {
          list = list.filter((s: any) =>
            (s.subscription_id || '').includes(this.filters.subscription_id)
          );
        }

        // -------------------------------------
        // PAGINACIÓN LOCAL
        // -------------------------------------
        this.total = list.length;
        this.totalPages = Math.ceil(this.total / this.limit);
        this.hasMore = this.page < this.totalPages;

        const start = (this.page - 1) * this.limit;
        const end = start + this.limit;

        this.subscriptions = list.slice(start, end);

        console.log(`[TEACHER SUBSCRIPTIONS] Suscripciones de docentes cargados: ${this.subscriptions.length}`);

        this.cdr.detectChanges();
      },

      error: err => {
        console.error('[TEACHER SUBSCRIPTIONS] Error cargando suscripciones: ', err);
      }
    });
}

  // --------------------------------------------------------
  // FILTROS
  // --------------------------------------------------------
  resetFilters() {
    this.filters = {
      search: '',
      status: '',
      teacher_id: '',
      subscription_id: ''
    };

    this.page = 1;
    this.loadSubscriptions();
  }

  // --------------------------------------------------------
  // PAGINACIÓN REAL
  // --------------------------------------------------------
  changePage(newPage: number) {
    if (newPage <= 0) return;
    if (this.totalPages && newPage > this.totalPages) return;

    this.page = newPage;
    this.loadSubscriptions();
  }

  nextPage() {
    if (!this.hasMore) return;
    this.page++;
    this.loadSubscriptions();
  }

  prevPage() {
    if (this.page === 1) return;
    this.page--;
    this.loadSubscriptions();
  }

  // --------------------------------------------------------
  // NAVEGACIÓN
  // --------------------------------------------------------
  goToDetail(id: string) {
    this.router.navigate(['/admin/teacher-subscription-detail', id]);
  }
}
