import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teachers',
  standalone: false,
  templateUrl: './teachers.html',
  styleUrl: './teachers.css',
})
export class Teachers implements OnInit {

  apiUrl = environment.apiUrl;
  private debounceTimer: any;

  teachers: any[] = [];
  ratingOptions = [1, 2, 3, 4, 5];

  page = 1;
  limit = 10;
  hasMore = false;
  total = 0;

  // Filtros válidos en backend
  filters = {
    search: '',
    specialty: '',
    min_rating: '',
    max_rating: ''
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('%c[TEACHERS] Componente inicializado', 'color:#3498db');
    this.loadTeachers();
  }

  // Debounce
  debouncedLoad() {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.page = 1;
      this.loadTeachers();
    }, 300);
  }

  // MAIN LOAD
  loadTeachers() {
    const params: any = {
      page: this.page,
      limit: this.limit
    };

    // Filtros compatibles con backend
    if (this.filters.search) params.search = this.filters.search;
    if (this.filters.specialty) params.specialty = this.filters.specialty;
    if (this.filters.min_rating) params.min_rating = this.filters.min_rating;
    if (this.filters.max_rating) params.max_rating = this.filters.max_rating;

    this.http.get<any>(`${this.apiUrl}/teachers`, { params })
      .subscribe({
        next: res => {
          this.teachers = res.data;
          this.total = res.total;
          this.hasMore = res.total > this.page * this.limit; // res.hasMore no existe en tu backend
          this.cdr.detectChanges();
        },
        error: err => console.error("[TEACHERS] Error cargando profesores:", err)
      });
  }

  // RESET FILTERS
  resetFilters() {
    this.filters = {
      search: '',
      specialty: '',
      min_rating: '',
      max_rating: ''
    };
    this.page = 1;
    this.loadTeachers();
  }

  // PAGINACIÓN
  changePage(newPage: number) {
    if (newPage <= 0) return;
    this.page = newPage;
    this.loadTeachers();
  }

  nextPage() {
    if (!this.hasMore) return;
    this.page++;
    this.loadTeachers();
  }

  prevPage() {
    if (this.page === 1) return;
    this.page--;
    this.loadTeachers();
  }

  // ROUTING
  goToDetail(id: string) {
    this.router.navigate(['/admin/teacher-detail', id]);
  }

  goToEdit(id: string) {
    this.router.navigate(['/admin/teacher-edit', id]);
  }
}