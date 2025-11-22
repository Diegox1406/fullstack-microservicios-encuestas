import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SurveyResponse {
  survey_id: number;
  participant?: string;
  answers: { [questionId: string]: any };
}

@Injectable({
  providedIn: 'root'
})
export class ResponseService {
  private baseUrl = `${environment.apiUrl}/responses`;

  constructor(private http: HttpClient) {}

  submitResponse(response: SurveyResponse): Observable<any> {
    return this.http.post(this.baseUrl, response);
  }

  getResponsesBySurvey(surveyId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/survey/${surveyId}`);
  }
}
