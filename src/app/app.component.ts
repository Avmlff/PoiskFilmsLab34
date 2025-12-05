import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule
  ],
  template: `
    <mat-toolbar color="primary">
      <span class="app-title" routerLink="/">
        <mat-icon class="title-icon">movie</mat-icon>
        Movie Search
      </span>

      <span class="spacer"></span>

      <nav class="nav-links">
        <a
          mat-button
          routerLink="/"
          routerLinkActive="active"
        >
          <mat-icon>search</mat-icon>
          Поиск
        </a>
        <a
          mat-button
          routerLink="/favorites"
          routerLinkActive="active"
        >
          <mat-icon>favorite</mat-icon>
          Избранное
          <span class="badge">{{ favoritesCount() }}</span>
        </a>
      </nav>

      <button
        mat-icon-button
        (click)="toggleTheme()"
        class="theme-toggle"
      >
        <mat-icon>{{ darkTheme() ? 'light_mode' : 'dark_mode' }}</mat-icon>
      </button>
    </mat-toolbar>

    <main class="content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }

    mat-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .app-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 20px;
      cursor: pointer;
    }

    .title-icon {
      color: #ffd700;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .nav-links {
      display: flex;
      gap: 8px;
      margin-right: 16px;
    }

    .nav-links a {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .nav-links a.active {
      background: rgba(255, 255, 255, 0.15);
    }

    .badge {
      background: #f44336;
      color: white;
      border-radius: 10px;
      padding: 2px 8px;
      font-size: 12px;
      margin-left: 4px;
    }

    .content {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    @media (max-width: 768px) {
      .content {
        padding: 16px;
      }
    }
  `]
})
export class AppComponent {
  darkTheme = signal(false);
  favoritesCount = signal(0);

  constructor() {
    this.loadThemePreference();
  }

  toggleTheme() {
    this.darkTheme.update(theme => !theme);
    this.saveThemePreference();
    this.applyTheme();
  }

  private loadThemePreference() {
    const savedTheme = localStorage.getItem('movieAppTheme');
    if (savedTheme === 'dark') {
      this.darkTheme.set(true);
    }
    this.applyTheme();
  }

  private saveThemePreference() {
    localStorage.setItem('movieAppTheme', this.darkTheme() ? 'dark' : 'light');
  }

  private applyTheme() {
    if (this.darkTheme()) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
}
