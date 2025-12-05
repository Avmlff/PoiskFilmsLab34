import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MovieService } from '../../services/movie.service';
import { MovieDetails } from '../../models/movie.model';

@Component({
  selector: 'app-movie-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="movie-details">
      <h2 mat-dialog-title>{{ movieDetails?.Title || 'Загрузка...' }}</h2>

      <mat-dialog-content>
        @if (loading) {
          <div class="loading">
            <mat-spinner diameter="40"></mat-spinner>
          </div>
        }

        @if (movieDetails && !loading) {
          <div class="details-container">
            <div class="poster-section">
              <img
                [src]="movieDetails.Poster !== 'N/A' ? movieDetails.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'"
                [alt]="movieDetails.Title"
                class="poster"
              >
            </div>

            <div class="info-section">
              <div class="info-grid">
                <div class="info-item">
                  <strong>Год выпуска:</strong> {{ movieDetails.Year }}
                </div>
                <div class="info-item">
                  <strong>Длительность:</strong> {{ movieDetails.Runtime }}
                </div>
                <div class="info-item">
                  <strong>Жанр:</strong> {{ movieDetails.Genre }}
                </div>
                <div class="info-item">
                  <strong>Режиссер:</strong> {{ movieDetails.Director }}
                </div>
                <div class="info-item">
                  <strong>Актерский состав:</strong> {{ movieDetails.Actors }}
                </div>
                <div class="info-item full-width">
                  <strong>Сюжет:</strong>
                  <p class="plot">{{ movieDetails.Plot }}</p>
                </div>
                <div class="info-item">
                  <strong>Рейтинг IMDB:</strong> {{ movieDetails.imdbRating }}
                </div>
              </div>
            </div>
          </div>
        }

        @if (error && !loading) {
          <div class="error">
            <mat-icon>error_outline</mat-icon>
            <p>{{ error }}</p>
          </div>
        }
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Закрыть</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .movie-details {
      max-width: 800px;
      max-height: 80vh;
      overflow-y: auto;
    }

    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 300px;
    }

    .details-container {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 30px;
      padding: 20px 0;
    }

    @media (max-width: 768px) {
      .details-container {
        grid-template-columns: 1fr;
      }
    }

    .poster {
      width: 100%;
      max-width: 300px;
      border-radius: 8px;
    }

    .info-section {
      display: flex;
      flex-direction: column;
      gap: 25px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 15px;
    }

    .info-item {
      padding-bottom: 12px;
      border-bottom: 1px solid #eee;
    }

    .info-item strong {
      display: block;
      margin-bottom: 4px;
      color: #3f51b5;
      font-size: 14px;
    }

    .plot {
      margin: 8px 0 0 0;
      line-height: 1.6;
      color: #555;
    }

    .error {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: #f44336;
      padding: 40px 20px;
      gap: 15px;
    }

    .error mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }

    mat-dialog-actions {
      padding: 16px 24px;
      border-top: 1px solid #eee;
      margin-top: 20px;
    }
  `]
})
export class MovieDetailsDialogComponent implements OnInit {
  movieDetails: MovieDetails | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { movieId: string },
    private movieService: MovieService,
    private dialogRef: MatDialogRef<MovieDetailsDialogComponent>
  ) {}

  ngOnInit() {
    this.loadMovieDetails();
  }

  private loadMovieDetails() {
    this.movieService.getMovieDetails(this.data.movieId).subscribe({
      next: (details) => {
        this.movieDetails = details;
        this.loading = false;
      },
      error: () => {
        this.error = 'Не удалось загрузить информацию о фильме';
        this.loading = false;
      }
    });
  }
}
