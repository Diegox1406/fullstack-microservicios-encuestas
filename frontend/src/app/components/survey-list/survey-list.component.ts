import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SurveyService, Survey } from '../../services/survey.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-survey-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <div class="card">
        <div class="header">
          <h2>Mis Encuestas ({{surveys().length}})</h2>
          <button (click)="logout()" class="btn btn-secondary">Cerrar Sesión</button>
        </div>
        
        <button routerLink="/surveys/create" class="btn btn-primary">+ Crear Nueva Encuesta</button>
        
        <div *ngIf="surveys().length === 0" style="text-align: center; padding: 40px; color: #666;">
          <p>No hay encuestas aún</p>
          <p>¡Crea tu primera encuesta!</p>
        </div>
        
        <div style="margin-top: 20px;">
          <div *ngFor="let survey of surveys()" 
               style="border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; border-radius: 4px; background: #fafafa;">
            <h3 style="margin: 0 0 10px 0;">{{ survey.title }}</h3>
            <p style="color: #666; margin: 0 0 5px 0;">{{ survey.description || 'Sin descripción' }}</p>
            <p style="color: #999; font-size: 13px; margin: 0 0 10px 0;">
              📝 {{ survey.questions?.length || 0 }} pregunta(s)
            </p>
            <div>
              <button [routerLink]="['/surveys', survey.id]" class="btn btn-primary">Ver</button>
              <button [routerLink]="['/surveys', survey.id, 'answer']" class="btn btn-success">Responder</button>
              <button [routerLink]="['/surveys', survey.id, 'reports']" class="btn btn-secondary">Reportes</button>
              <button (click)="deleteSurvey(survey.id!)" class="btn btn-danger">Eliminar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class SurveyListComponent implements OnInit {
  surveys = signal<Survey[]>([]);

  constructor(
    private surveyService: SurveyService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('SurveyListComponent initialized');
    this.loadSurveys();
  }

  loadSurveys(): void {
    console.log('Token:', localStorage.getItem('token'));
    this.surveyService.getSurveys().subscribe({
      next: (surveys) => {
        console.log('Encuestas recibidas:', surveys);
        this.surveys.set(Array.isArray(surveys) ? surveys : []);
        console.log('Surveys asignadas:', this.surveys());
      },
      error: (err) => {
        console.error('Error al cargar encuestas:', err);
      }
    });
  }

  deleteSurvey(id: number): void {
    if (confirm('¿Eliminar esta encuesta?')) {
      this.surveyService.deleteSurvey(id).subscribe(() => this.loadSurveys());
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
