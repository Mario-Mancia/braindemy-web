import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-user-edit',
  standalone: false,
  templateUrl: './user-edit.html',
  styleUrl: './user-edit.css',
})
export class UserEdit implements OnInit {
  apiUrl = environment.apiUrl;

  userId: string = '';
  user: any = null;

  newPassword: string = "";

  loading: boolean = true;
  saving: boolean = false;
  error: string | null = null;
  success: boolean = false;

  // Timezones
  timezones = [
    { value: 'UTC−06:00', label: 'UTC−06:00 El Salvador (Central Standard Time)' },
    { value: 'UTC−05:00', label: 'UTC−05:00 Ciudad de México / Bogotá' },
    { value: 'UTC+01:00', label: 'UTC+01:00 Madrid / París' },
    { value: 'UTC+02:00', label: 'UTC+02:00 Atenas / Jerusalén' },
    { value: 'UTC+03:00', label: 'UTC+03:00 Moscú / Nairobi' },
  ];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    console.log("UserEdit → ngOnInit()");

    this.userId = this.route.snapshot.paramMap.get('id')!;
    console.log("ID recibido:", this.userId);

    if (!this.userId) {
      this.error = "ID de usuario inválido.";
      this.loading = false;
      return;
    }

    this.loadUser();
  }

  loadUser() {
    this.loading = true;
    this.error = null;

    const url = `${this.apiUrl}/users/${this.userId}`;
    console.log("GET →", url);

    this.http.get(url).subscribe({
      next: (res: any) => {
        console.log("Respuesta GET user:", res);

        // Convertir birthdate a YYYY-MM-DD si viene con tiempo
        if (res.birthdate) {
          res.birthdate = res.birthdate.substring(0, 10);
        }

        this.user = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error GET user:", err);

        this.error = "No se pudo cargar la información del usuario.";
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  saveChanges() {
    if (!this.user) return;

    console.log("🔵 saveChanges() ejecutado");

    this.saving = true;
    this.error = null;
    this.success = false;

    const url = `${this.apiUrl}/users/${this.userId}`;
    console.log("PATCH →", url);

    // Construir payload limpio (sin email!)
    const payload: any = {
      first_name: this.user.first_name,
      last_name: this.user.last_name,
      birthdate: this.user.birthdate || null,
      timezone: this.user.timezone,
      role: this.user.role,
      status: this.user.status,
    };

    // Solo si el admin escribió una nueva contraseña
    if (this.newPassword.trim() !== "") {
      payload.new_password = this.newPassword.trim();
    }

    console.log("Payload enviado al backend:", payload);

    this.http.patch(url, payload).subscribe({
      next: (res) => {
        console.log("Respuesta PATCH:", res);

        this.saving = false;
        this.success = true;
        this.newPassword = "";

        setTimeout(() => {
          this.success = false;
          this.cdr.detectChanges();
        }, 2500);

        this.router.navigate(['/admin/users']);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error PATCH user:", err);
        if (err.error) console.error("Backend response:", err.error);

        this.error = "No se pudieron guardar los cambios.";
        this.saving = false;
        this.cdr.detectChanges();
      }
    });
  }

  goBack() {
    console.log("Regresar a detalle usuario:", this.userId);
    this.router.navigate(['/admin/user-detail', this.userId]);
  }
}
