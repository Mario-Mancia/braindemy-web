import { HttpClient, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { debounce } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-courses',
  standalone: false,
  templateUrl: './courses.html',
  styleUrl: './courses.css',
})
export class Courses implements OnInit {

  apiUrl = environment.apiUrl;
  private debounceTimer: any;

  courses: any[] = [];

  // PAGINACIÓN REAL
  page = 1;
  limit = 12;
  hasMore = false;
  total = 0;

  categories = ['Tecnología', 'Diseño', 'Marketing', 'Idiomas', 'Negocios'];

  filters = {
    search: '',
    category: '',
    teacher_id: ''   // <--- NUEVO FILTRO PERMITIDO
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadCourses();
  }

  // BÚSQUEDA CON DEBOUNCE
  debouncedLoad() {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.page = 1;
      this.loadCourses();
    }, 300);
  }

  // CARGA PRINCIPAL
  loadCourses() {
    const params: any = {
      page: this.page,
      limit: this.limit
    };

    if (this.filters.search) params.search = this.filters.search;
    if (this.filters.category) params.category = this.filters.category;
    if (this.filters.teacher_id) params.teacher_id = this.filters.teacher_id;

    this.http.get<any>(`${this.apiUrl}/courses`, { params })
      .subscribe({
        next: res => {
          this.courses = res.data;
          this.total = res.total;
          this.hasMore = res.hasMore;

          console.log(`Cursos recuperados: ${this.courses.length}`);

          if (this.courses.length === 0) {
            console.warn("No se encontraron cursos con los filtros actuales.");
          }

          this.cdr.detectChanges();
        },
        error: err => console.error("Error cargando cursos:", err)
      });
  }

  resetFilters() {
    this.filters = { search: '', category: '', teacher_id: '' };
    this.page = 1;
    this.loadCourses();
  }

  changePage(newPage: number) {
    if (newPage <= 0) return;
    this.page = newPage;
    this.loadCourses();
  }

  nextPage() {
    if (!this.hasMore) return;
    this.page++;
    this.loadCourses();
  }

  prevPage() {
    if (this.page === 1) return;
    this.page--;
    this.loadCourses();
  }

  getActiveClass(isActive: boolean) {
    return {
      "active": isActive === true,
      "inactive": isActive === false
    };
  }

  goToDetail(id: string) {
    this.router.navigate(['/admin/course-detail', id]);
  }
}