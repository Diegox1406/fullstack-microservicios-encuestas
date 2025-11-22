import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveyService, Survey } from '../../services/survey.service';
import { ResponseService } from '../../services/response.service';

@Component({
  selector: 'app-survey-answer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container" *ngIf="survey">
      <div class="card">
        <h2 style="color: #667eea; margin-bottom: 10px;">{{ survey.title }}</h2>
        <p style="color: #718096; margin-bottom: 30px;">{{ survey.description }}</p>
        
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Tu nombre (opcional):</label>
            <input type="text" [(ngModel)]="participant" name="participant" placeholder="Anónimo">
          </div>
          
          <div *ngFor="let q of survey.questions; let i = index" class="form-group" style="border-left: 4px solid #667eea; padding-left: 20px; background: #f7fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <label style="font-size: 16px;">{{ i + 1 }}. {{ q.text }}</label>
            <input *ngIf="q.qtype === 'text'" type="text" [(ngModel)]="answers[q.id!]" [name]="'q'+q.id" placeholder="Tu respuesta">
            <select *ngIf="q.qtype === 'multiple'" [(ngModel)]="answers[q.id!]" [name]="'q'+q.id">
              <option value="">-- Selecciona una opción --</option>
              <option *ngFor="let opt of q.question_metadata?.options" [value]="opt">{{ opt }}</option>
            </select>
            <input *ngIf="q.qtype === 'scale'" type="number" [(ngModel)]="answers[q.id!]" [name]="'q'+q.id" min="1" max="10" placeholder="1-10">
          </div>
          
          <div style="display: flex; gap: 10px;">
            <button type="submit" class="btn btn-success">📤 Enviar Respuestas</button>
            <button type="button" routerLink="/surveys" class="btn btn-secondary">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 20px; max-width: 800px; margin: 0 auto; }
    .question { margin: 20px 0; }
    input, select { width: 100%; padding: 8px; margin-top: 5px; }
    button { padding: 10px 20px; cursor: pointer; }
  `]
})
export class SurveyAnswerComponent implements OnInit {
  survey?: Survey;
  answers: any = {};
  participant = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private surveyService: SurveyService,
    private responseService: ResponseService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.surveyService.getSurvey(id).subscribe(survey => this.survey = survey);
  }

  onSubmit(): void {
    this.responseService.submitResponse({
      survey_id: this.survey!.id!,
      participant: this.participant || undefined,
      answers: this.answers
    }).subscribe(() => {
      alert('Response submitted!');
      this.router.navigate(['/surveys']);
    });
  }
}
