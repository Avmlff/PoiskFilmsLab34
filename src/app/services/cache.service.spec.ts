import { TestBed } from '@angular/core/testing';
import { CacheService } from './cache.service';

describe('CacheService', () => {
  let service: CacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store and retrieve value', () => {
    const testData = { id: 1, title: 'Test Movie' };
    service.set('test-key', testData);
    expect(service.get('test-key')).toEqual(testData);
  });

  it('should return null for non-existent key', () => {
    expect(service.get('non-existent')).toBeNull();
  });
});
