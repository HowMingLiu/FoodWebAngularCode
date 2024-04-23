import { Routes } from '@angular/router';

export const routes: Routes = [
  {path: 'home', loadComponent: () => import('./home/home.component').then(mod => mod.HomeComponent)},
  {path: 'orderPage', loadComponent: () => import('./order-page/order-page.component').then(mod => mod.OrderPageComponent)},
  {path: 'auth', loadComponent: () => import('./auth/auth.component').then(mod => mod.AuthComponent)},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: '**', loadComponent: () => import('./not-found/not-found.component').then( mod => mod.NotFoundComponent)}
];
