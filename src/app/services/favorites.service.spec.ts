import { TestBed } from '@angular/core/testing';
import { FavoritesService } from './favorites.service';

describe('FavoritesService', () => {
  let service: FavoritesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoritesService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add and remove favorites', () => {
    const movie = { Title: 'Test', Year: '2023', imdbID: 'tt123', Type: 'movie', Poster: '' };

    service.addToFavorites(movie);
    expect(service.isFavorite('tt123')).toBeTrue();

    service.removeFromFavorites('tt123');
    expect(service.isFavorite('tt123')).toBeFalse();
  });

  it('should toggle favorites', () => {
    const movie = { Title: 'Test', Year: '2023', imdbID: 'tt123', Type: 'movie', Poster: '' };

    service.toggleFavorite(movie);
    expect(service.isFavorite('tt123')).toBeTrue();

    service.toggleFavorite(movie);
    expect(service.isFavorite('tt123')).toBeFalse();
  });
});
