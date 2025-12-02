import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-students',
  standalone: false,
  templateUrl: './students.html',
  styleUrl: './students.css',
})
export class Students implements OnInit {

  apiUrl = environment.apiUrl;
  private debounceTimer: any;

  students: any[] = [];

  // Filtros EXACTOS según students.html
  filters = {
    academy: '',
    academic_level: '',
    search: ''
  };

  // Paginación
  page = 1;
  limit = 10;

  // Opciones que usa el HTML
  academyOptions = ['Ingeniería', 'Artes', 'Ciencias', 'Negocios'];
  academicLevels = ['Básico', 'Intermedio', 'Avanzado'];

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('%c[STUDENTS] Componente inicializado', 'color:#27ae60');
    this.loadStudents();
  }

  // ====================================================
  // DEBOUNCE PARA SEARCH
  // ====================================================
  debouncedLoad() {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      console.log('[STUDENTS] Ejecutando búsqueda...');
      this.page = 1;
      this.loadStudents();
    }, 300);
  }

  // ====================================================
  // CARGAR LISTADO PRINCIPAL
  // ====================================================
  loadStudents() {
    console.log('[STUDENTS] Cargando estudiantes...');

    const params: any = {
      page: this.page,
      limit: this.limit
    };

    // Solo agregamos filtros si tienen valor
    if (this.filters.academy) params.academy = this.filters.academy;
    if (this.filters.academic_level) params.academic_level = this.filters.academic_level;
    if (this.filters.search) params.search = this.filters.search;

    this.http.get<any[]>(`${this.apiUrl}/students`, { params })
      .subscribe({
        next: (res) => {
          console.log('[STUDENTS] Datos recibidos:', res);
          this.students = res;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('[STUDENTS] Error al cargar estudiantes', err);
        }
      });
  }

  // ====================================================
  // PAGINACIÓN
  // ====================================================
  changePage(newPage: number) {
    if (newPage < 1) return;
    this.page = newPage;
    this.loadStudents();
  }

  // ====================================================
  // LIMPIAR FILTROS
  // ====================================================
  resetFilters() {
    this.filters = {
      academy: '',
      academic_level: '',
      search: ''
    };

    this.page = 1;
    this.loadStudents();
  }

  // ====================================================
  // NAVEGACIÓN
  // ====================================================
  goToDetail(id: string) {
    this.router.navigate(['/admin/student-detail', id]);
  }

  goToEdit(id: string) {
    this.router.navigate(['/admin/student-edit', id]);
  }

}