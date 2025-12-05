import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MovieService } from './movie.service';

describe('MovieService', () => {
  let service: MovieService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MovieService]
    });

    service = TestBed.inject(MovieService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Только базовые тесты
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should search movies', () => {
    const mockResponse = {
      Search: [{ Title: 'Test', Year: '2023', imdbID: 'tt123', Type: 'movie', Poster: '' }],
      totalResults: '1',
      Response: 'True'
    };

    service.searchMovies('test').subscribe(response => {
      expect(response.Response).toBe('True');
    });

    const req = httpMock.expectOne(req => req.url.includes('omdbapi.com'));
    req.flush(mockResponse);
  });

  it('should get movie details', () => {
    const mockDetails = {
      Title: 'Test Movie',
      imdbID: 'tt123',
      Response: 'True'
    };

    service.getMovieDetails('tt123').subscribe(details => {
      expect(details.Response).toBe('True');
    });

    const req = httpMock.expectOne(req => req.url.includes('omdbapi.com'));
    req.flush(mockDetails);
  });
});
