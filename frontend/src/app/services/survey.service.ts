import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Survey {
  id?: number;
  title: string;
  description?: string;
  questions?: Question[];
}

export interface Question {
  id?: number;
  survey_id?: number;
  text: string;
  qtype: 'text' | 'multiple' | 'scale';
  question_metadata?: any;  // Cambio de metadata a question_metadata
}

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  private baseUrl = `${environment.apiUrl}/surveys`;

  constructor(private http: HttpClient) {}

  getSurveys(): Observable<Survey[]> {
    return this.http.get<Survey[]>(this.baseUrl);
  }

  getSurvey(id: number): Observable<Survey> {
    return this.http.get<Survey>(`${this.baseUrl}/${id}`);
  }

  createSurvey(survey: Survey): Observable<Survey> {
    return this.http.post<Survey>(this.baseUrl, survey);
  }

  deleteSurvey(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  addQuestion(surveyId: number, question: Question): Observable<Question> {
    return this.http.post<Question>(`${this.baseUrl}/${surveyId}/questions`, question);
  }
}
