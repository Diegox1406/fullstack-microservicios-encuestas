import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-survey-reports',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <div class="card">
        <div class="header">
          <h2 style="color: #667eea;">📊 Reportes: {{ stats?.survey }}</h2>
          <button (click)="exportExcel()" class="btn btn-success">📥 Exportar a Excel</button>
        </div>
        
        <div *ngIf="stats" style="margin-top: 30px;">
          <div *ngFor="let key of objectKeys(stats.stats)" style="border: 2px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 20px; background: #f7fafc;">
            <h3 style="color: #2d3748; margin-bottom: 15px;">{{ stats.stats[key].text }}</h3>
            
            <div *ngIf="stats.stats[key].counts" style="background: white; padding: 15px; border-radius: 8px;">
              <div *ngFor="let option of objectKeys(stats.stats[key].counts)" style="display: flex; justify-content: space-between; margin-bottom: 10px; padding: 10px; background: #edf2f7; border-radius: 6px;">
                <span style="font-weight: 600;">{{ option }}</span>
                <span style="background: #667eea; color: white; padding: 4px 12px; border-radius: 12px;">{{ stats.stats[key].counts[option] }} respuesta(s)</span>
              </div>
            </div>
            
            <div *ngIf="stats.stats[key].mean !== undefined" style="background: white; padding: 15px; border-radius: 8px;">
              <p style="font-size: 24px; color: #667eea; font-weight: 700; margin-bottom: 5px;">
                Promedio: {{ stats.stats[key].mean | number:'1.2-2' }}/10
              </p>
              <p style="color: #718096;">Total de respuestas: {{ stats.stats[key].count }}</p>
            </div>
            
            <div *ngIf="stats.stats[key].responses" style="background: white; padding: 15px; border-radius: 8px;">
              <p style="color: #718096; margin-bottom: 10px;">📝 {{ stats.stats[key].responses.length }} respuesta(s) de texto</p>
              <div *ngFor="let resp of stats.stats[key].responses" style="background: #edf2f7; padding: 10px; margin-bottom: 8px; border-radius: 6px; font-style: italic;">
                "{{ resp }}"
              </div>
            </div>
          </div>
        </div>
        
        <button routerLink="/surveys" class="btn btn-secondary">← Volver</button>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .stat-item { border: 1px solid #ddd; padding: 15px; margin: 10px 0; }
    button { margin: 5px; padding: 8px 15px; cursor: pointer; }
  `]
})
export class SurveyReportsComponent implements OnInit {
  stats: any;
  surveyId!: number;
  objectKeys = Object.keys;

  constructor(
    private route: ActivatedRoute,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.surveyId = Number(this.route.snapshot.paramMap.get('id'));
    this.reportService.getStats(this.surveyId).subscribe(stats => this.stats = stats);
  }

  exportExcel(): void {
    this.reportService.exportExcel(this.surveyId);
  }
}
