import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'settings',
    pathMatch: 'full',
  },
  {
    path: 'settings',
    data: { title: 'Settings' },
    loadComponent: () => import('../settings/settings.page').then((module) => module.SettingsPage),
  },
  {
    path: 'trivia',
    data: { title: 'Trivia' },
    loadComponent: () => import('../trivia/trivia.page').then((module) => module.TriviaPage),
  },
];
