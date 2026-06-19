import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 w-full max-w-md">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
        <p class="text-gray-500 text-sm mb-8">Saffron &amp; Soul — Management Panel</p>

        <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input formControlName="username" type="text"
                   class="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"/>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input formControlName="password" type="password"
                   class="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"/>
          </div>
          <div *ngIf="error()" class="text-red-600 text-sm bg-red-50 p-3 rounded-xl">{{ error() }}</div>
          <button type="submit" [disabled]="loading()"
                  class="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition">
            {{ loading() ? 'Logging in...' : 'Login' }}
          </button>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });
  loading = signal(false);
  error = signal('');

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  submit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');
    this.authService.login(this.form.value as any).subscribe({
      next: () => this.router.navigate(['/admin']),
      error: () => { this.error.set('Invalid username or password.'); this.loading.set(false); }
    });
  }
}
