import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CustomerAuthService } from '../../services/customer-auth.service';

@Component({
  selector: 'app-menu-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center px-4"
         style="background: linear-gradient(135deg, #fdf6f0 0%, #fef3c7 50%, #fdf6f0 100%);">

      <div class="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-amber-100">

        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="flex flex-col items-center justify-center w-20 h-20 rounded-full border-2 border-amber-400 mx-auto mb-4"
               style="background: rgba(251,191,36,0.08);">
            <span class="text-xl font-bold text-amber-700" style="font-family:'Georgia',serif; font-style:italic;">S&amp;S</span>
          </div>
          <h1 class="text-2xl font-bold text-gray-900" style="font-family:'Georgia',serif;">Saffron &amp; Soul</h1>
          <p class="text-amber-700 text-sm mt-1 tracking-widest uppercase font-medium">Menu Access</p>
        </div>

        <p class="text-center text-gray-600 text-sm mb-6 leading-relaxed">
          Enter the <span class="font-semibold text-amber-700">email or phone number</span> used when booking your table.
        </p>

        <form [formGroup]="contactForm" (ngSubmit)="verifyAccess()">
          <div class="mb-4">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Email or Phone Number</label>
            <input formControlName="contact" type="text"
                   placeholder="e.g. john@email.com or 9876543210"
                   class="w-full border-2 border-amber-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition"/>
            <p *ngIf="contactForm.get('contact')?.touched && contactForm.get('contact')?.invalid"
               class="text-red-500 text-xs mt-1">Please enter a valid email or phone number.</p>
          </div>

          <div *ngIf="error()" class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
            {{ error() }}
          </div>

          <button type="submit" [disabled]="loading() || contactForm.invalid"
                  class="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition text-sm">
            {{ loading() ? 'Checking...' : 'Access Menu' }}
          </button>
        </form>

        <p class="text-center text-xs text-gray-400 mt-6">
          Don't have a booking?
          <a routerLink="/reservation" class="text-amber-600 hover:underline font-medium">Reserve a table</a>
        </p>
      </div>
    </div>
  `
})
export class MenuLoginComponent {
  loading = signal(false);
  error = signal('');

  contactForm = this.fb.group({ contact: ['', Validators.required] });

  constructor(
    private fb: FormBuilder,
    private authService: CustomerAuthService,
    private router: Router
  ) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/menu']);
    }
  }

  verifyAccess(): void {
    if (this.contactForm.invalid) return;
    this.loading.set(true);
    this.error.set('');
    const contact = this.contactForm.value.contact!.trim();

    this.authService.verifyAccess(contact).subscribe({
      next: (res: any) => {
        this.authService.saveSession(res.token, res.customerName, res.contact, res.reservationDate, res.reservationTime);
        this.loading.set(false);
        this.router.navigate(['/menu']);
      },
      error: (err: any) => {
        this.loading.set(false);
        this.error.set(err.error?.error || 'Unable to access menu. Please try again.');
      }
    });
  }
}
