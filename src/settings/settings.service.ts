import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  readonly amountOfQuestions = signal<number>(10);
}
