import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container">
      <div class="card" style="max-width: 450px; margin: 100px auto;">
        <h2 style="text-align: center; color: #667eea; margin-bottom: 30px;">Crear Cuenta</h2>
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Usuario:</label>
            <input type="text" [(ngModel)]="username" name="username" required placeholder="Elija un nombre de usuario">
          </div>
          <div class="form-group">
            <label>Contraseña:</label>
            <input type="password" [(ngModel)]="password" name="password" required placeholder="Mínimo 6 caracteres">
          </div>
          <div class="form-group">
            <label>Confirmar Contraseña:</label>
            <input type="password" [(ngModel)]="confirmPassword" name="confirmPassword" required placeholder="Repita la contraseña">
          </div>
          <button type="submit" class="btn btn-success" style="width: 100%;">Registrarse</button>
          <div *ngIf="error" class="error">{{ error }}</div>
          <div *ngIf="success" class="success">{{ success }}</div>
        </form>
        <p style="text-align: center; margin-top: 20px;">
          ¿Ya tienes cuenta? <a routerLink="/login" style="color: #667eea; text-decoration: none; font-weight: 600;">Inicia sesión aquí</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .error { color: red; margin-top: 10px; }
    .success { color: green; margin-top: 10px; }
    a { color: #007bff; text-decoration: none; }
  `]
})
export class RegisterComponent {
  username = '';
  password = '';
  confirmPassword = '';
  error = '';
  success = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.error = '';
    this.success = '';

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters';
      return;
    }

    this.authService.register(this.username, this.password).subscribe({
      next: () => {
        this.success = 'Registration successful! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.error = err.error?.error || 'Registration failed';
      }
    });
  }
}
