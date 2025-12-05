import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/movie-search/movie-search.component')
      .then(m => m.MovieSearchComponent)
  },
  {
    path: 'favorites',
    loadComponent: () => import('./components/favorites/favorites.component')
      .then(m => m.FavoritesComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
