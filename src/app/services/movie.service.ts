import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { MovieSearchResponse, MovieDetails } from '../models/movie.model';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private http = inject(HttpClient);
  private cacheService = inject(CacheService);
  private apiKey = 'ba09e46d';
  private apiUrl = 'https://www.omdbapi.com/';

  searchMovies(title: string, type: string = 'movie', page: number = 1): Observable<MovieSearchResponse> {
    const cacheKey = `search_${title}_${type}_${page}`;

    const cached = this.cacheService.get<MovieSearchResponse>(cacheKey);
    if (cached) {
      console.log('Используем кэшированный поиск из CacheService');
      return of(cached);
    }

    const params = new HttpParams()
      .set('apikey', this.apiKey)
      .set('s', title)
      .set('type', type)
      .set('page', page.toString());

    return this.http.get<MovieSearchResponse>(this.apiUrl, { params }).pipe(
      retry(2),
      tap(response => {
        if (response.Response === 'True') {
          // Сохраняем в кэш через CacheService
          this.cacheService.set(cacheKey, response);
        }
      }),
      catchError(error => {
        console.error('Ошибка поиска фильмов:', error);
        return of({
          Search: [],
          totalResults: '0',
          Response: 'False',
          Error: 'Ошибка загрузки фильмов'
        });
      })
    );
  }

  getMovieDetails(id: string): Observable<MovieDetails> {
    const cacheKey = `movie_${id}`;

    const cached = this.cacheService.get<MovieDetails>(cacheKey);
    if (cached) {
      console.log('Используем кэшированные детали из CacheService');
      return of(cached);
    }

    const params = new HttpParams()
      .set('apikey', this.apiKey)
      .set('i', id)
      .set('plot', 'full');

    return this.http.get<MovieDetails>(this.apiUrl, { params }).pipe(
      retry(2),
      tap(details => {
        if (details.Response === 'True') {
          // Сохраняем в кэш через CacheService
          this.cacheService.set(cacheKey, details);
        }
      }),
      catchError(error => {
        console.error('Ошибка загрузки деталей фильма:', error);
        return of({
          Title: '',
          Year: '',
          Rated: '',
          Released: '',
          Runtime: '',
          Genre: '',
          Director: '',
          Writer: '',
          Actors: '',
          Plot: '',
          Language: '',
          Country: '',
          Awards: '',
          Poster: '',
          Ratings: [],
          Metascore: '',
          imdbRating: '',
          imdbVotes: '',
          imdbID: id,
          Type: '',
          DVD: '',
          BoxOffice: '',
          Production: '',
          Website: '',
          Response: 'False'
        });
      })
    );
  }

  clearCache(): void {
    this.cacheService.clear();
  }

  getCacheStats(): { size: number } {
    const stats = this.cacheService.getStats();
    return { size: stats.size };
  }

  getCachedMovies(): MovieDetails[] {
    return this.cacheService.getAllMovies();
  }
}
