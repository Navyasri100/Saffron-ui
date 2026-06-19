import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { customerGuard } from './guards/customer.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'menu-login',
    loadComponent: () => import('./pages/menu-login/menu-login.component').then(m => m.MenuLoginComponent)
  },
  {
    path: 'menu',
    canActivate: [customerGuard],
    loadComponent: () => import('./pages/menu/menu.component').then(m => m.MenuComponent)
  },
  {
    path: 'my-reservation',
    canActivate: [customerGuard],
    loadComponent: () => import('./pages/my-reservation/my-reservation.component').then(m => m.MyReservationComponent)
  },
  {
    path: 'gallery',
    loadComponent: () => import('./pages/gallery/gallery.component').then(m => m.GalleryComponent)
  },
  {
    path: 'reservation',
    loadComponent: () => import('./pages/reservation/reservation.component').then(m => m.ReservationComponent)
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./pages/admin/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/admin/dashboard/dashboard.component').then(m => m.DashboardComponent),
    children: [
      {
        path: 'reservations',
        loadComponent: () => import('./pages/admin/reservations-manage/reservations-manage.component').then(m => m.ReservationsManageComponent)
      },
      {
        path: 'menu',
        loadComponent: () => import('./pages/admin/menu-manage/menu-manage.component').then(m => m.MenuManageComponent)
      },
      { path: '', redirectTo: 'reservations', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];
