import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="card" style="max-width: 450px; margin: 100px auto;">
        <h2 style="text-align: center; color: #667eea; margin-bottom: 30px;">
          <i style="font-size: 48px;">📋</i><br>
          Sistema de Encuestas
        </h2>
        <h3 style="text-align: center; margin-bottom: 30px;">Iniciar Sesión</h3>
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Usuario:</label>
            <input type="text" [(ngModel)]="username" name="username" required placeholder="Ingrese su usuario">
          </div>
          <div class="form-group">
            <label>Contraseña:</label>
            <input type="password" [(ngModel)]="password" name="password" required placeholder="Ingrese su contraseña">
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%;">Ingresar</button>
          <div *ngIf="error" class="error">{{ error }}</div>
        </form>
        <p style="text-align: center; margin-top: 20px;">
          ¿No tienes cuenta? <a routerLink="/register" style="color: #667eea; text-decoration: none; font-weight: 600;">Regístrate aquí</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .container { display: flex; justify-content: center; align-items: center; height: 100vh; }
    .card { padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
    .form-group { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; }
    input { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; }
    button { padding: 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button:hover { background: #0056b3; }
    .error { color: red; margin-top: 10px; }
    a { color: #007bff; text-decoration: none; }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    console.log('Login attempt:', this.username);
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        console.log('Login success:', response);
        this.router.navigate(['/surveys']);
      },
      error: (err) => {
        console.error('Login error:', err);
        this.error = err.error?.error || 'Invalid credentials';
      }
    });
  }
}
