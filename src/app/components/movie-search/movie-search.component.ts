import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { Subject, of } from 'rxjs';

import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';
import { MovieDetailsDialogComponent } from '../movie-details-dialog/movie-details-dialog.component';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-movie-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.css']
})
export class MovieSearchComponent implements OnInit {
  private movieService = inject(MovieService);
  private favoritesService = inject(FavoritesService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private searchSubject = new Subject<string>();

  searchControl = new FormControl('');
  typeControl = new FormControl('movie');
  movies: Movie[] = [];
  loading = false;
  error = '';

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(term => {
        this.loading = true;
        this.error = '';
        return this.movieService.searchMovies(term, this.typeControl.value!).pipe(
          catchError(err => {
            console.error('Ошибка в компоненте:', err);
            return of({
              Search: [],
              totalResults: '0',
              Response: 'False',
              Error: 'Ошибка сети. Проверьте подключение к интернету.'
            });
          })
        );
      })
    ).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.Response === 'True') {
          this.movies = response.Search;
        } else {
          this.movies = [];
          this.error = response.Error || 'Фильмы не найдены';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Произошла ошибка при загрузке фильмов';
        this.movies = [];
        console.error('Критическая ошибка:', err);
      }
    });
  }

  onSearch() {
    const term = this.searchControl.value?.trim() || '';
    if (term.length >= 2) {
      this.searchSubject.next(term);
    } else {
      this.movies = [];
      this.error = '';
    }
  }

  onTypeChange() {
    const term = this.searchControl.value?.trim() || '';
    if (term.length >= 2) {
      this.searchSubject.next(term);
    }
  }

  openDetails(movieId: string) {
    this.dialog.open(MovieDetailsDialogComponent, {
      width: '800px',
      maxWidth: '90vw',
      data: { movieId }
    });
  }

  toggleFavorite(movie: Movie) {
    this.favoritesService.toggleFavorite(movie);
    const message = this.favoritesService.isFavorite(movie.imdbID)
      ? `"${movie.Title}" добавлен в избранное`
      : `"${movie.Title}" удален из избранного`;
    this.snackBar.open(message, 'OK', { duration: 3000 });
  }

  isFavorite(id: string): boolean {
    return this.favoritesService.isFavorite(id);
  }

  clearCache() {
    this.movieService.clearCache();
    this.snackBar.open('Кэш очищен', 'OK', { duration: 2000 });
  }
}
