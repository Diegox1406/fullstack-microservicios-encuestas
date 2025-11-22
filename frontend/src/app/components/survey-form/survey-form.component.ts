import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SurveyService, Survey, Question } from '../../services/survey.service';

@Component({
  selector: 'app-survey-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="card">
        <h2 style="color: #667eea; margin-bottom: 30px;">➕ Crear Nueva Encuesta</h2>
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Título:</label>
            <input type="text" [(ngModel)]="survey.title" name="title" required placeholder="Ej: Encuesta de Satisfacción">
          </div>
          <div class="form-group">
            <label>Descripción:</label>
            <textarea [(ngModel)]="survey.description" name="description" rows="3" placeholder="Describe brevemente tu encuesta"></textarea>
          </div>
          
          <h3 style="color: #2d3748; margin: 30px 0 20px;">📝 Preguntas</h3>
          <div *ngFor="let q of questions; let i = index" style="border: 2px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 15px; background: #f7fafc;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
              <strong style="color: #2d3748;">Pregunta {{ i + 1 }}</strong>
              <button type="button" (click)="removeQuestion(i)" class="btn btn-danger" style="padding: 6px 12px; font-size: 12px;">Eliminar</button>
            </div>
            <div class="form-group">
              <label>Texto de la pregunta:</label>
              <input type="text" [(ngModel)]="q.text" [name]="'q'+i" placeholder="Escribe tu pregunta aquí">
            </div>
            <div class="form-group">
              <label>Tipo:</label>
              <select [(ngModel)]="q.qtype" [name]="'type'+i">
                <option value="text">Texto libre</option>
                <option value="multiple">Opción múltiple</option>
                <option value="scale">Escala numérica (1-10)</option>
              </select>
            </div>
            <div class="form-group" *ngIf="q.qtype === 'multiple'">
              <label>Opciones (separadas por comas):</label>
              <input type="text" [(ngModel)]="q.options" [name]="'opt'+i" placeholder="Ej: Sí, No, Tal vez">
            </div>
          </div>
          
          <button type="button" (click)="addQuestion()" class="btn btn-secondary" style="margin-bottom: 20px;">
            ➕ Agregar Pregunta
          </button>
          
          <div style="display: flex; gap: 10px;">
            <button type="submit" class="btn btn-success">💾 Crear Encuesta</button>
            <button type="button" routerLink="/surveys" class="btn btn-secondary">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 20px; max-width: 800px; margin: 0 auto; }
    div { margin: 10px 0; }
    input, textarea, select { width: 100%; padding: 8px; }
    .question-item { border: 1px solid #ddd; padding: 10px; margin: 10px 0; }
    button { margin: 5px; padding: 8px 15px; cursor: pointer; }
  `]
})
export class SurveyFormComponent {
  survey: Survey = { title: '', description: '' };
  questions: any[] = [];

  constructor(private surveyService: SurveyService, private router: Router) {}

  addQuestion(): void {
    this.questions.push({ text: '', qtype: 'text', options: '' });
  }

  removeQuestion(index: number): void {
    this.questions.splice(index, 1);
  }

  onSubmit(): void {
    this.surveyService.createSurvey(this.survey).subscribe(created => {
      const promises = this.questions.map(q => {
        const question: Question = {
          text: q.text,
          qtype: q.qtype,
          question_metadata: q.qtype === 'multiple' ? { options: q.options.split(',').map((s: string) => s.trim()) } : {}
        };
        return this.surveyService.addQuestion(created.id!, question).toPromise();
      });
      Promise.all(promises).then(() => this.router.navigate(['/surveys']));
    });
  }
}
