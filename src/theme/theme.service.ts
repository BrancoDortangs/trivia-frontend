import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly isDarkMode = signal<boolean>(this.isDarkByDefault());

  private isDarkByDefault(): boolean {
    const isDarkByDefault =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (isDarkByDefault) {
      document.documentElement.classList.add('dark-mode');
    }

    return isDarkByDefault;
  }

  toggleDarkMode(): void {
    const isDarkMode = !this.isDarkMode();

    this.isDarkMode.set(isDarkMode);

    document.documentElement.classList.toggle('dark-mode', isDarkMode);
  }
}
