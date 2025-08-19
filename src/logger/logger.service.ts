import { Injectable, isDevMode } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Logger {
  logError(error: unknown): void {
    if (isDevMode()) {
      console.error(error);
    }
  }
}
