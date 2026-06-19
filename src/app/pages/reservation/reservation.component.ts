import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReservationService } from '../../services/reservation.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-2xl mx-auto px-4 py-16">
      <!-- Page Header with Branding -->
      <div class="text-center mb-12 pb-8 border-b border-amber-100">
        <p class="text-amber-600 font-medium uppercase tracking-widest text-sm mb-3">Reserve</p>
        <h1 class="text-5xl font-bold mb-1" style="font-family: 'Georgia', serif; color: #1a1a1a;">Book a Table</h1>
        <p class="text-gray-600 mt-3 text-lg">Fill in your details and we'll confirm your reservation by email.</p>
        <div class="flex items-center justify-center gap-3 mt-6">
          <div class="w-8 h-px bg-gradient-to-r from-transparent to-amber-300"></div>
          <span class="text-amber-600">✦</span>
          <div class="w-8 h-px bg-gradient-to-l from-transparent to-amber-300"></div>
        </div>
      </div>

      <!-- Success message -->
      <div *ngIf="success()" class="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div class="text-4xl mb-4">✅</div>
        <h3 class="text-xl font-bold text-green-800 mb-2">Reservation Confirmed!</h3>
        <p class="text-green-600">We've sent a confirmation to your email. See you soon!</p>
        <button (click)="success.set(false)" class="mt-6 text-sm text-green-700 underline">Make another reservation</button>
      </div>

      <!-- Form -->
      <form *ngIf="!success()" [formGroup]="form" (ngSubmit)="submit()"
            class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input formControlName="name" type="text" placeholder="John Smith"
                   class="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"/>
            <span *ngIf="f['name'].invalid && f['name'].touched" class="text-red-500 text-xs mt-1">Name is required</span>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <input formControlName="phone" type="tel" placeholder="+91 98765 43210"
                   class="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"/>
            <span *ngIf="f['phone'].invalid && f['phone'].touched" class="text-red-500 text-xs mt-1">Enter a valid Indian mobile number (e.g. +91 98765 43210)</span>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input formControlName="email" type="email" placeholder="john@example.com"
                 class="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"/>
          <span *ngIf="f['email'].invalid && f['email'].touched" class="text-red-500 text-xs mt-1">Valid email is required</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input formControlName="date" type="date" [min]="today"
                   (change)="onDateChange()"
                   class="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"/>
            <span *ngIf="f['date'].errors?.['pastDate']" class="text-red-500 text-xs mt-1 block">
              Please select a future date.
            </span>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Guests *</label>
            <input formControlName="guests" type="number" min="1" max="20" placeholder="2"
                   class="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"/>
          </div>
        </div>

        <!-- Time slot picker -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">Preferred Time *</label>

          <!-- Loading shimmer -->
          <div *ngIf="slotsLoading()" class="flex gap-2 flex-wrap">
            <div *ngFor="let i of [1,2,3,4,5,6]"
                 class="h-10 w-24 rounded-xl bg-gray-100 animate-pulse"></div>
          </div>

          <ng-container *ngIf="!slotsLoading()">
            <!-- No date selected -->
            <p *ngIf="!f['date'].value"
               class="text-sm text-gray-400 italic py-2">Select a date above to see available time slots.</p>

            <!-- No slots at all -->
            <p *ngIf="f['date'].value && lunchSlots().length === 0 && dinnerSlots().length === 0"
               class="text-sm text-amber-600 bg-amber-50 rounded-xl px-4 py-3">
              No slots available for this date. Please choose another day.
            </p>

            <ng-container *ngIf="f['date'].value && (lunchSlots().length > 0 || dinnerSlots().length > 0)">
              <!-- Lunch -->
              <div *ngIf="lunchSlots().length > 0" class="mb-5">
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-base">🍛</span>
                  <span class="text-xs font-semibold text-gray-500 uppercase tracking-widest">Lunch &nbsp;·&nbsp; 12:30 PM – 3:30 PM</span>
                  <div class="flex-1 h-px bg-gray-100"></div>
                </div>
                <div class="flex flex-wrap gap-2">
                  <button *ngFor="let slot of lunchSlots()" type="button"
                          (click)="f['time'].setValue(slot)"
                          [ngClass]="f['time'].value === slot
                            ? 'bg-amber-600 text-white border-amber-600 shadow-md scale-105'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-amber-400 hover:text-amber-700 hover:bg-amber-50'"
                          class="px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-amber-400">
                    {{ slot }}
                  </button>
                </div>
              </div>

              <!-- Dinner -->
              <div *ngIf="dinnerSlots().length > 0">
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-base">🌙</span>
                  <span class="text-xs font-semibold text-gray-500 uppercase tracking-widest">Dinner &nbsp;·&nbsp; 6:30 PM – 10:30 PM</span>
                  <div class="flex-1 h-px bg-gray-100"></div>
                </div>
                <div class="flex flex-wrap gap-2">
                  <button *ngFor="let slot of dinnerSlots()" type="button"
                          (click)="f['time'].setValue(slot)"
                          [ngClass]="f['time'].value === slot
                            ? 'bg-amber-600 text-white border-amber-600 shadow-md scale-105'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-amber-400 hover:text-amber-700 hover:bg-amber-50'"
                          class="px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-amber-400">
                    {{ slot }}
                  </button>
                </div>
              </div>
            </ng-container>
          </ng-container>

          <span *ngIf="f['time'].invalid && f['time'].touched && !f['time'].value"
                class="text-red-500 text-xs mt-2 block">Please select a time slot.</span>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
          <textarea formControlName="notes" rows="3" placeholder="Dietary requirements, special occasions..."
                    class="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"></textarea>
        </div>

        <div *ngIf="error()" class="text-red-600 text-sm bg-red-50 p-3 rounded-xl">{{ error() }}</div>

        <button type="submit" [disabled]="submitting()"
                class="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white py-4 rounded-xl font-semibold text-lg transition">
          {{ submitting() ? 'Submitting...' : 'Confirm Reservation' }}
        </button>
      </form>
    </div>
  `
})
export class ReservationComponent {

  today = (() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  })();

  private readonly LUNCH_SLOTS = ['12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM'];
  private readonly DINNER_SLOTS = ['6:30 PM','7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM','9:30 PM','10:00 PM','10:30 PM'];
  private readonly ALL_SLOTS = [...this.LUNCH_SLOTS, ...this.DINNER_SLOTS];

  availableTimeSlots = signal<string[]>([]);
  slotsLoading = signal(false);

  lunchSlots = signal<string[]>([...this.LUNCH_SLOTS]);
  dinnerSlots = signal<string[]>([...this.DINNER_SLOTS]);

  form = this.fb.group({
    name:   ['', Validators.required],
    email:  ['', [Validators.required, Validators.email]],
    phone:  ['', [Validators.required, Validators.pattern(/^(\+91[\-\s]?)?[6-9]\d{9}$/)]],
    date:   ['', [Validators.required, this.futureDateValidator.bind(this)]],
    time:   ['', Validators.required],
    guests: [2, [Validators.required, Validators.min(1), Validators.max(20)]],
    notes:  ['']
  });

  success = signal(false);
  submitting = signal(false);
  error = signal('');

  get f() { return this.form.controls; }

  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private http: HttpClient
  ) {}

  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    return control.value < this.today ? { pastDate: true } : null;
  }

  onDateChange(): void {
    const selectedDate = this.f['date'].value;
    this.f['time'].setValue('');
    if (!selectedDate) return;

    this.slotsLoading.set(true);
    this.http.get<string[]>(`${environment.apiUrl}/reservations/available-slots?date=${selectedDate}`)
      .subscribe({
        next: slots => {
          // For today, also filter out past slots + 30-min buffer
          let filtered = slots;
          if (selectedDate === this.today) {
            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();
            filtered = slots.filter(slot => {
              const [time, period] = slot.split(' ');
              let [h, m] = time.split(':').map(Number);
              if (period === 'PM' && h !== 12) h += 12;
              if (period === 'AM' && h === 12) h = 0;
              return (h * 60 + m) > currentMinutes + 30;
            });
          }
          this.availableTimeSlots.set(filtered);
          this.lunchSlots.set(filtered.filter(s => this.LUNCH_SLOTS.includes(s)));
          this.dinnerSlots.set(filtered.filter(s => this.DINNER_SLOTS.includes(s)));
          this.slotsLoading.set(false);
        },
        error: () => {
          let fallback = [...this.ALL_SLOTS];
          if (selectedDate === this.today) {
            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();
            fallback = fallback.filter(slot => {
              const [time, period] = slot.split(' ');
              let [h, m] = time.split(':').map(Number);
              if (period === 'PM' && h !== 12) h += 12;
              if (period === 'AM' && h === 12) h = 0;
              return (h * 60 + m) > currentMinutes + 30;
            });
          }
          this.availableTimeSlots.set(fallback);
          this.lunchSlots.set(fallback.filter(s => this.LUNCH_SLOTS.includes(s)));
          this.dinnerSlots.set(fallback.filter(s => this.DINNER_SLOTS.includes(s)));
          this.slotsLoading.set(false);
        }
      });
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (this.f['date'].value! < this.today) {
      this.error.set('Please select a future date.');
      return;
    }
    this.submitting.set(true);
    this.error.set('');
    this.reservationService.createReservation(this.form.value as any).subscribe({
      next: () => {
        this.success.set(true);
        this.submitting.set(false);
        this.form.reset({ guests: 2 });
        this.lunchSlots.set([...this.LUNCH_SLOTS]);
        this.dinnerSlots.set([...this.DINNER_SLOTS]);
        this.availableTimeSlots.set([]);
      },
      error: () => {
        this.error.set('Something went wrong. Please try again.');
        this.submitting.set(false);
      }
    });
  }
}
