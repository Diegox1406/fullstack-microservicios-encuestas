import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SurveyService, Survey } from '../../services/survey.service';

@Component({
  selector: 'app-survey-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container" *ngIf="survey">
      <div class="card">
        <h2 style="color: #667eea; margin-bottom: 10px;">{{ survey.title }}</h2>
        <p style="color: #718096; margin-bottom: 30px;">{{ survey.description }}</p>
        
        <h3 style="color: #2d3748; margin-bottom: 20px;">📝 Preguntas ({{ survey.questions?.length || 0 }})</h3>
        <div *ngFor="let q of survey.questions; let i = index" style="border-left: 4px solid #667eea; padding-left: 20px; margin-bottom: 20px; background: #f7fafc; padding: 15px; border-radius: 8px;">
          <p style="color: #2d3748; font-weight: 600; margin-bottom: 5px;">{{ i + 1 }}. {{ q.text }}</p>
          <p style="color: #718096; font-size: 13px;">Tipo: 
            <span *ngIf="q.qtype === 'text'">📝 Texto libre</span>
            <span *ngIf="q.qtype === 'multiple'">☑️ Opción múltiple</span>
            <span *ngIf="q.qtype === 'scale'">📊 Escala numérica</span>
          </p>
          <p *ngIf="q.question_metadata?.options" style="color: #4a5568; margin-top: 8px;">
            Opciones: <strong>{{ q.question_metadata.options.join(', ') }}</strong>
          </p>
        </div>
        
        <button routerLink="/surveys" class="btn btn-secondary">← Volver</button>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .question { border: 1px solid #ddd; padding: 10px; margin: 10px 0; }
  `]
})
export class SurveyDetailComponent implements OnInit {
  survey?: Survey;

  constructor(
    private route: ActivatedRoute,
    private surveyService: SurveyService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.surveyService.getSurvey(id).subscribe(survey => this.survey = survey);
  }
}
