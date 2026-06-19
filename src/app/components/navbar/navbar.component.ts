import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomerAuthService } from '../../services/customer-auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="bg-white shadow-md sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-4 py-2 flex justify-between items-center">
        <!-- Logo with SVG -->
        <a routerLink="/" class="flex items-center gap-3 hover:opacity-80 transition">
          <div class="w-12 h-12 rounded-full border-2 border-amber-500 flex items-center justify-center" style="background: rgba(251,191,36,0.08);">
            <span class="text-sm font-bold text-amber-700" style="font-family:'Georgia',serif; font-style:italic;">S&amp;S</span>
          </div>
          <div>
            <div class="font-bold" style="font-family: 'Georgia', serif; font-size: 0.95rem; letter-spacing: -0.01em; background: linear-gradient(135deg, #b45309 0%, #d97706 50%, #92400e 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Saffron &amp; Soul</div>
            <div class="text-xs font-semibold text-amber-500 tracking-widest">FINE INDIAN DINING</div>
          </div>
        </a>

        <!-- Desktop menu -->
        <ul class="hidden md:flex gap-8 text-gray-700 font-medium">
          <li><a routerLink="/" routerLinkActive="text-amber-600" [routerLinkActiveOptions]="{exact:true}" class="hover:text-amber-600 transition">Home</a></li>
          <li><a routerLink="/menu" routerLinkActive="text-amber-600" class="hover:text-amber-600 transition">Menu</a></li>
          <li><a routerLink="/gallery" routerLinkActive="text-amber-600" class="hover:text-amber-600 transition">Gallery</a></li>
          <li><a routerLink="/reservation" routerLinkActive="text-amber-600" class="hover:text-amber-600 transition">Reservation</a></li>
        </ul>

        <div class="hidden md:flex items-center gap-3">
          <a *ngIf="isCustomerLoggedIn()" routerLink="/my-reservation"
             class="text-sm font-medium text-amber-700 hover:text-amber-900 border border-amber-200 px-4 py-2 rounded-full hover:bg-amber-50 transition">
            My Reservation
          </a>
          <a routerLink="/reservation" class="bg-amber-600 text-white px-5 py-2 rounded-full hover:bg-amber-700 transition text-sm font-semibold">
            Book a Table
          </a>
          <button *ngIf="isCustomerLoggedIn()" (click)="confirmLogout.set(true)"
                  class="text-sm font-medium text-gray-600 hover:text-red-500 border border-gray-200 px-4 py-2 rounded-full hover:border-red-300 transition">
            Logout
          </button>
        </div>

        <!-- Logout confirmation modal -->
        <div *ngIf="confirmLogout()" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div class="bg-white rounded-2xl p-8 max-w-sm w-full shadow-xl text-center">
            <div class="text-4xl mb-4">👋</div>
            <h3 class="text-lg font-bold text-gray-800 mb-2">Leaving so soon?</h3>
            <p class="text-gray-500 text-sm mb-6">Are you sure you want to log out?</p>
            <div class="flex gap-3">
              <button (click)="confirmLogout.set(false)"
                      class="flex-1 border border-gray-200 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition">
                Stay
              </button>
              <button (click)="logout()"
                      class="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition">
                Yes, Logout
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile hamburger -->
        <button class="md:hidden text-gray-700" (click)="menuOpen.set(!menuOpen())">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path *ngIf="!menuOpen()" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            <path *ngIf="menuOpen()" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Mobile menu -->
      <div *ngIf="menuOpen()" class="md:hidden bg-white border-t px-4 py-3 flex flex-col gap-3 text-gray-700 font-medium">
        <a routerLink="/" (click)="menuOpen.set(false)" class="hover:text-amber-600">Home</a>
        <a routerLink="/menu" (click)="menuOpen.set(false)" class="hover:text-amber-600">Menu</a>
        <a routerLink="/gallery" (click)="menuOpen.set(false)" class="hover:text-amber-600">Gallery</a>
        <a routerLink="/reservation" (click)="menuOpen.set(false)" class="hover:text-amber-600">Reservation</a>
        <a *ngIf="isCustomerLoggedIn()" routerLink="/my-reservation" (click)="menuOpen.set(false)" class="text-amber-700 font-medium hover:text-amber-900">My Reservation</a>
        <button *ngIf="isCustomerLoggedIn()" (click)="confirmLogout.set(true)" class="text-left text-red-500 hover:text-red-700">Logout</button>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  menuOpen      = signal(false);
  confirmLogout = signal(false);

  constructor(private auth: CustomerAuthService, private router: Router) {}

  isCustomerLoggedIn(): boolean { return this.auth.isLoggedIn(); }

  logout(): void {
    this.auth.logout();
    this.confirmLogout.set(false);
    this.menuOpen.set(false);
    this.router.navigate(['/']);
  }
}
