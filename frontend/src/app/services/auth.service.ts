import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenSubject = new BehaviorSubject<string | null>(this.getToken());
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${environment.authUrl}/login`, { username, password })
      .pipe(tap((res: any) => {
        if (res.access_token) {
          localStorage.setItem('token', res.access_token);
          this.tokenSubject.next(res.access_token);
        }
      }));
  }

  logout(): void {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${environment.authUrl}/register`, { username, password });
  }
}
