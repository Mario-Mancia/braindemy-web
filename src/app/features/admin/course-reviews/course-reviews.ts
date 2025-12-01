import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-reviews',
  standalone: false,
  templateUrl: './course-reviews.html',
  styleUrl: './course-reviews.css',
})
export class CourseReviews implements OnInit{

  apiUrl = environment.apiUrl;
  private debounceTimer: any;

  reviews: any[] = [];

  // PAGINACIÓN REAL
  page = 1;
  limit = 12;
  total = 0;
  totalPages = 0;
  hasMore = false;

  // Opciones de rating permitidas
  ratingOptions = [1, 2, 3, 4, 5];

  // FILTROS
  filters = {
    search: '',   // búsqueda por curso, estudiante, comentario (opcional por backend)
    course_id: '',
    student_id: '',
    rating: '',
    created_from: '',
    created_to: ''
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  // -------------------------------------
  // BÚSQUEDA CON DEBOUNCE
  // -------------------------------------
  debouncedLoad() {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.page = 1;
      this.loadReviews();
    }, 300);
  }

  // -------------------------------------
  // CARGA PRINCIPAL
  // -------------------------------------
  loadReviews() {
    const params: any = {
      page: this.page,
      limit: this.limit
    };

    // Filtros dinámicos
    if (this.filters.search) params.search = this.filters.search;
    if (this.filters.course_id) params.course_id = this.filters.course_id;
    if (this.filters.student_id) params.student_id = this.filters.student_id;
    if (this.filters.rating) params.rating = this.filters.rating;
    if (this.filters.created_from) params.created_from = this.filters.created_from;
    if (this.filters.created_to) params.created_to = this.filters.created_to;

    console.info('[REVIEWS] Cargando reseñas con filtros:', params);

    this.http.get<any>(`${this.apiUrl}/course-reviews`, { params })
      .subscribe({
        next: res => {
          // El backend devuelve: { page, limit, total, totalPages, data }
          this.reviews = res.data || [];
          this.total = res.total ?? 0;
          this.totalPages = res.totalPages ?? 0;

          this.hasMore = (this.page * this.limit) < this.total;

          console.log(`[REVIEWS] Reseñas cargadas: ${this.reviews.length}`);
          if (this.reviews.length === 0) {
            console.warn('[REVIEWS] No se encontraron reseñas con los filtros actuales.');
          }

          this.cdr.detectChanges();
        },
        error: err => {
          console.error('[REVIEWS] Error cargando reseñas:', err);
        }
      });
  }

  // -------------------------------------
  // FILTROS
  // -------------------------------------
  resetFilters() {
    this.filters = {
      search: '',
      course_id: '',
      student_id: '',
      rating: '',
      created_from: '',
      created_to: ''
    };
    this.page = 1;
    this.loadReviews();
  }

  // -------------------------------------
  // PAGINACIÓN
  // -------------------------------------
  changePage(newPage: number) {
    if (newPage <= 0) return;
    if (this.totalPages && newPage > this.totalPages) return;
    this.page = newPage;
    this.loadReviews();
  }

  nextPage() {
    if (!this.hasMore) return;
    this.page++;
    this.loadReviews();
  }

  prevPage() {
    if (this.page === 1) return;
    this.page--;
    this.loadReviews();
  }

  // -------------------------------------
  // NAVEGACIÓN
  // -------------------------------------
  goToDetail(id: string) {
    this.router.navigate(['/admin/review-detail', id]);
  }
}
