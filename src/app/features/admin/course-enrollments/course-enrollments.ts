import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-enrollments',
  standalone: false,
  templateUrl: './course-enrollments.html',
  styleUrl: './course-enrollments.css',
})
export class CourseEnrollments implements OnInit {

  apiUrl = environment.apiUrl;

  enrollments: any[] = [];

  // PAGINACIÓN REAL
  page = 1;
  limit = 12;
  total = 0;
  totalPages = 0;
  hasMore = false;

  statusOptions = ['active', 'completed', 'cancelled'];

  filters = {
    status: '',
    course_id: '',
    student_id: '',
    teacher_id: ''
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEnrollments();
  }

  // -------------------------------------
  // CARGA PRINCIPAL
  // -------------------------------------
  loadEnrollments() {
    const params: any = {
      page: this.page,
      limit: this.limit
    };

    // Filtros permitidos por el backend
    if (this.filters.status) params.status = this.filters.status;
    if (this.filters.course_id) params.course_id = this.filters.course_id;
    if (this.filters.student_id) params.student_id = this.filters.student_id;
    if (this.filters.teacher_id) params.teacher_id = this.filters.teacher_id;

    console.info('[ENROLLMENTS] GET /course-enrollments', params);

    this.http.get<any>(`${this.apiUrl}/course-enrollments`, { params })
      .subscribe({
        next: (res) => {

          this.enrollments = res.data || [];
          this.total = res.total ?? 0;
          this.totalPages = res.totalPages ?? 0;

          this.hasMore = (this.page * this.limit) < this.total;

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('[ENROLLMENTS] Error al cargar:', err);
        }
      });
  }

  // -------------------------------------
  // FILTROS
  // -------------------------------------
  resetFilters() {
    this.filters = {
      status: '',
      course_id: '',
      student_id: '',
      teacher_id: ''
    };
    this.page = 1;
    this.loadEnrollments();
  }

  // -------------------------------------
  // PAGINACIÓN
  // -------------------------------------
  nextPage() {
    if (!this.hasMore) return;
    this.page++;
    this.loadEnrollments();
  }

  prevPage() {
    if (this.page === 1) return;
    this.page--;
    this.loadEnrollments();
  }

  // -------------------------------------
  // NAVEGACIÓN
  // -------------------------------------
  goToDetail(id: string) {
    this.router.navigate(['/admin/enrollment-detail', id]);
  }
}