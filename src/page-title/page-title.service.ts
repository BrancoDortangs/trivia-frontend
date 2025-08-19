import { inject, Injectable, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PageTitleService {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly title = inject(Title);

  readonly pageTitle = signal<string>('');

  constructor() {
    this.initPageTitle();
  }

  private initPageTitle(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((): void => {
        let currentRoute = this.activatedRoute.root;

        while (currentRoute.firstChild) {
          currentRoute = currentRoute.firstChild;
        }

        const title: string = currentRoute.snapshot.data['title'] ?? '';
        this.title.setTitle(title);
        this.pageTitle.set(title);
      });
  }
}
