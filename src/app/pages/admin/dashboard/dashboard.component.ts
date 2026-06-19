import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-gray-50 flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-gray-900 text-white flex flex-col">
        <div class="p-6 border-b border-gray-700">
          <h2 class="font-bold text-lg">Saffron &amp; Soul</h2>
          <p class="text-gray-400 text-xs mt-1">Admin Panel</p>
        </div>
        <nav class="flex-1 p-4 space-y-1">
          <a routerLink="/admin/reservations" routerLinkActive="bg-amber-600"
             class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm hover:bg-gray-800 transition">
            📅 Reservations
          </a>
          <a routerLink="/admin/menu" routerLinkActive="bg-amber-600"
             class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm hover:bg-gray-800 transition">
            🍽️ Menu Items
          </a>
          <a routerLink="/" class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm hover:bg-gray-800 transition">
            🌐 View Website
          </a>
        </nav>
        <div class="p-4 border-t border-gray-700">
          <p class="text-gray-400 text-xs mb-2">{{ username }}</p>
          <button (click)="logout()" class="w-full text-left text-sm text-gray-400 hover:text-white transition">
            Sign out
          </button>
        </div>
      </aside>

      <!-- Main content -->
      <main class="flex-1 p-8 overflow-y-auto">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class DashboardComponent {
  username = this.authService.getUsername();

  constructor(private authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}
