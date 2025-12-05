import { Injectable, signal } from '@angular/core';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'movie-favorites';
  private favorites = signal<Movie[]>(this.loadFavorites());

  favoritesList = this.favorites.asReadonly();
  favoritesCount = signal(this.favorites().length);

  addToFavorites(movie: Movie): void {
    if (!this.isFavorite(movie.imdbID)) {
      const updated = [...this.favorites(), movie];
      this.favorites.set(updated);
      this.saveFavorites(updated);
      this.favoritesCount.set(updated.length);
    }
  }

  removeFromFavorites(id: string): void {
    const updated = this.favorites().filter(movie => movie.imdbID !== id);
    this.favorites.set(updated);
    this.saveFavorites(updated);
    this.favoritesCount.set(updated.length);
  }

  isFavorite(id: string): boolean {
    return this.favorites().some(movie => movie.imdbID === id);
  }

  toggleFavorite(movie: Movie): void {
    if (this.isFavorite(movie.imdbID)) {
      this.removeFromFavorites(movie.imdbID);
    } else {
      this.addToFavorites(movie);
    }
  }

  private loadFavorites(): Movie[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveFavorites(favorites: Movie[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
  }
}
