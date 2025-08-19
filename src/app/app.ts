import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Card } from 'primeng/card';
import { Menubar } from 'primeng/menubar';
import { PageTitleService } from '../page-title/page-title.service';
import { ThemeService } from '../theme/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menubar, Card],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly pageTitleService = inject(PageTitleService);
  readonly themeService = inject(ThemeService);

  readonly menuItems: MenuItem[] = [
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      routerLink: '/settings',
    },
    {
      label: 'Trivia',
      icon: 'pi pi-pencil',
      routerLink: '/trivia',
    },
  ];
}
