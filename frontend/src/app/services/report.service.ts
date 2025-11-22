import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private baseUrl = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  getStats(surveyId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/survey/${surveyId}/stats`);
  }

  exportExcel(surveyId: number): void {
    window.open(`${environment.apiUrl}/reports/survey/${surveyId}/export/excel`, '_blank');
  }
}
