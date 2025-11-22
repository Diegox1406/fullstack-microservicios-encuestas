import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) },
  { path: 'surveys', loadComponent: () => import('./components/survey-list/survey-list.component').then(m => m.SurveyListComponent), canActivate: [AuthGuard] },
  { path: 'surveys/create', loadComponent: () => import('./components/survey-form/survey-form.component').then(m => m.SurveyFormComponent), canActivate: [AuthGuard] },
  { path: 'surveys/:id', loadComponent: () => import('./components/survey-detail/survey-detail.component').then(m => m.SurveyDetailComponent), canActivate: [AuthGuard] },
  { path: 'surveys/:id/answer', loadComponent: () => import('./components/survey-answer/survey-answer.component').then(m => m.SurveyAnswerComponent) },
  { path: 'surveys/:id/reports', loadComponent: () => import('./components/survey-reports/survey-reports.component').then(m => m.SurveyReportsComponent), canActivate: [AuthGuard] },
  { path: '', redirectTo: '/surveys', pathMatch: 'full' }
];
