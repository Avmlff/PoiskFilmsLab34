import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { FavoritesService } from '../../services/favorites.service';
import { MovieDetailsDialogComponent } from '../movie-details-dialog/movie-details-dialog.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="favorites-container">
      <h1>Избранные фильмы</h1>

      @if (favoritesService.favoritesCount() === 0) {
        <div class="empty">
          <mat-icon>favorite_border</mat-icon>
          <p>Нет избранных фильмов</p>
          <a mat-button routerLink="/" color="primary">
            <mat-icon>search</mat-icon>
            Найти фильмы
          </a>
        </div>
      } @else {
      <p class="count">Всего: {{ favoritesService.favoritesCount() }}</p>

      <div class="favorites-grid">
        @for (movie of favoritesService.favoritesList(); track movie.imdbID) {
          <mat-card class="favorite-card">
            <img
              mat-card-image
              [src]="movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'"
              [alt]="movie.Title"
              (click)="openDetails(movie.imdbID)"
            />
            <mat-card-content>
              <h3>{{ movie.Title }}</h3>
              <p>{{ movie.Year }} • {{ movie.Type === 'movie' ? 'Фильм' : movie.Type === 'series' ? 'Сериал' : 'Эпизод' }}</p>
            </mat-card-content>
            <mat-card-actions>
              <button
                mat-icon-button
                color="warn"
                (click)="removeFromFavorites(movie.imdbID)"
              >
                <mat-icon>delete</mat-icon>
              </button>
              <button mat-button (click)="openDetails(movie.imdbID)">Подробнее</button>
            </mat-card-actions>
          </mat-card>
        }
      </div>
    }
    </div>
  `,
  styles: [`
    .favorites-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
    }

    h1 {
      color: #3f51b5;
      margin: 0 0 24px;
    }

    .count {
      color: #666;
      margin-bottom: 24px;
    }

    .empty {
      text-align: center;
      padding: 64px;
      color: #999;
    }

    .empty mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
    }

    .favorites-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
    }

    .favorite-card img {
      height: 400px;
      object-fit: cover;
      cursor: pointer;
    }

    mat-card-content h3 {
      margin: 16px 0 8px;
      font-size: 18px;
    }

    mat-card-content p {
      color: #666;
      margin: 0;
    }

    mat-card-actions {
      display: flex;
      justify-content: space-between;
      padding: 16px !important;
    }

    @media (max-width: 768px) {
      .favorites-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      }
    }
  `]
})
export class FavoritesComponent {
  favoritesService = inject(FavoritesService);
  private dialog = inject(MatDialog);

  removeFromFavorites(id: string) {
    this.favoritesService.removeFromFavorites(id);
  }

  openDetails(movieId: string) {
    this.dialog.open(MovieDetailsDialogComponent, {
      width: '800px',
      maxWidth: '90vw',
      data: { movieId }
    });
  }
}
