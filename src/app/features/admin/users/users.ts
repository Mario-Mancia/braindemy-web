import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {
  apiUrl = environment.apiUrl;
  private debounceTimer: any;

  users: any[] = [];

  // PAGINACIÓN REAL
  page = 1;
  limit = 10;
  hasMore = false;
  total = 0;

  // FILTERS
  filters = {
    role: '',
    status: '',
    search: ''
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // -------------------------------------
  // BÚSQUEDA CON DEBOUNCE
  // -------------------------------------
  debouncedLoad() {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.page = 1; // Resetear página al buscar
      this.loadUsers();
    }, 300);
  }

  // -------------------------------------
  // CARGA PRINCIPAL
  // -------------------------------------
  loadUsers() {
    const params: any = {
      page: this.page,
      limit: this.limit
    };

    if (this.filters.role) params.role = this.filters.role;
    if (this.filters.status) params.status = this.filters.status;
    if (this.filters.search) params.search = this.filters.search;

    this.http.get<any>(`${this.apiUrl}/users`, { params })
      .subscribe({
        next: res => {
          this.users = res.data;  // ← AHORA sí usa .data
          this.total = res.total;
          this.hasMore = res.hasMore;

          this.cdr.detectChanges();
        },
        error: err => console.error("Error cargando usuarios:", err)
      });
  }

  // -------------------------------------
  // FILTROS
  // -------------------------------------
  resetFilters() {
    this.filters = { role: '', status: '', search: '' };
    this.page = 1;
    this.loadUsers();
  }

  // -------------------------------------
  // PAGINACIÓN
  // -------------------------------------
  changePage(newPage: number) {
    if (newPage <= 0) return;
    this.page = newPage;
    this.loadUsers();
  }

  nextPage() {
    if (!this.hasMore) return;
    this.page++;
    this.loadUsers();
  }

  prevPage() {
    if (this.page === 1) return;
    this.page--;
    this.loadUsers();
  }

  // -------------------------------------
  // UTIL
  // -------------------------------------
  getStatusClass(status: string) {
    return {
      "active": status === "active",
      "inactive": status === "inactive",
      "banned": status === "banned"
    };
  }

  goToDetail(id: string) {
    this.router.navigate(['/admin/user-detail', id]);
  }

  goToEdit(id: string) {
    this.router.navigate(['/admin/user-edit', id]);
  }
}
