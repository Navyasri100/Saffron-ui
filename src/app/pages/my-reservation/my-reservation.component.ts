import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CustomerAuthService } from '../../services/customer-auth.service';
import { Reservation } from '../../models/models';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-my-reservation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="max-w-2xl mx-auto px-4 py-16">

      <!-- Header -->
      <div class="text-center mb-10 pb-8 border-b border-amber-100">
        <p class="text-amber-600 font-medium uppercase tracking-widest text-sm mb-3">Your Booking</p>
        <h1 class="text-4xl font-bold" style="font-family:'Georgia',serif; color:#1a1a1a;">My Reservation</h1>
        <div class="flex items-center justify-center gap-3 mt-5">
          <div class="w-8 h-px bg-gradient-to-r from-transparent to-amber-300"></div>
          <span class="text-amber-600">✦</span>
          <div class="w-8 h-px bg-gradient-to-l from-transparent to-amber-300"></div>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="loading()" class="text-center py-20 text-gray-400">Loading your reservation…</div>

      <!-- Error -->
      <div *ngIf="!loading() && fetchError()" class="text-center py-20">
        <p class="text-red-500 text-lg">{{ fetchError() }}</p>
      </div>

      <!-- Cancelled confirmation -->
      <div *ngIf="cancelled()" class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <div class="text-4xl mb-4">❌</div>
        <h3 class="text-xl font-bold text-red-800 mb-2">Reservation Cancelled</h3>
        <p class="text-red-600 mb-6">Your reservation has been cancelled successfully.</p>
        <a routerLink="/reservation"
           class="inline-block bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-700 transition">
          Book a New Table
        </a>
      </div>

      <!-- Main content (not loading, no error, not cancelled) -->
      <ng-container *ngIf="!loading() && !fetchError() && !cancelled() && reservation()">

        <!-- Reservation card -->
        <div *ngIf="!editing()" class="bg-white rounded-2xl shadow-sm border border-amber-100 p-8">

          <!-- Status badge -->
          <div class="flex justify-between items-start mb-6">
            <h2 class="text-xl font-bold text-gray-800">Booking Details</h2>
            <span [ngClass]="{
              'bg-green-100 text-green-700': reservation()!.status === 'CONFIRMED',
              'bg-yellow-100 text-yellow-700': reservation()!.status === 'PENDING',
              'bg-red-100 text-red-600': reservation()!.status === 'CANCELLED'
            }" class="text-xs font-semibold px-3 py-1 rounded-full">
              {{ reservation()!.status }}
            </span>
          </div>

          <dl class="space-y-4 text-sm">
            <div class="flex justify-between border-b border-gray-50 pb-3">
              <dt class="text-gray-500 font-medium">Name</dt>
              <dd class="text-gray-800 font-semibold">{{ reservation()!.name }}</dd>
            </div>
            <div class="flex justify-between border-b border-gray-50 pb-3">
              <dt class="text-gray-500 font-medium">Email</dt>
              <dd class="text-gray-800">{{ reservation()!.email }}</dd>
            </div>
            <div class="flex justify-between border-b border-gray-50 pb-3">
              <dt class="text-gray-500 font-medium">Phone</dt>
              <dd class="text-gray-800">{{ reservation()!.phone }}</dd>
            </div>
            <div class="flex justify-between border-b border-gray-50 pb-3">
              <dt class="text-gray-500 font-medium">Date</dt>
              <dd class="text-gray-800 font-semibold">{{ formatDate(reservation()!.date) }}</dd>
            </div>
            <div class="flex justify-between border-b border-gray-50 pb-3">
              <dt class="text-gray-500 font-medium">Time</dt>
              <dd class="text-gray-800 font-semibold">{{ reservation()!.time }}</dd>
            </div>
            <div class="flex justify-between border-b border-gray-50 pb-3">
              <dt class="text-gray-500 font-medium">Guests</dt>
              <dd class="text-gray-800">{{ reservation()!.guests }}</dd>
            </div>
            <div *ngIf="reservation()!.notes" class="flex justify-between">
              <dt class="text-gray-500 font-medium">Notes</dt>
              <dd class="text-gray-800 text-right max-w-xs">{{ reservation()!.notes }}</dd>
            </div>
          </dl>

          <!-- Action buttons (only for non-cancelled, future reservations) -->
          <ng-container *ngIf="reservation()!.status !== 'CANCELLED' && isFuture(reservation()!.date)">
            <div class="flex gap-3 mt-8">
              <button (click)="startEdit()"
                      class="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl font-semibold transition">
                Edit Reservation
              </button>
              <button (click)="confirmCancel.set(true)"
                      class="flex-1 border border-red-300 text-red-500 hover:bg-red-50 py-3 rounded-xl font-semibold transition">
                Cancel Reservation
              </button>
            </div>
          </ng-container>

          <!-- Past reservation notice -->
          <p *ngIf="!isFuture(reservation()!.date) && reservation()!.status !== 'CANCELLED'"
             class="mt-6 text-center text-sm text-gray-400 bg-gray-50 rounded-xl py-3">
            This reservation has passed. <a routerLink="/reservation" class="text-amber-600 underline">Book a new table →</a>
          </p>
        </div>

        <!-- Cancel confirmation overlay -->
        <div *ngIf="confirmCancel()" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div class="bg-white rounded-2xl p-8 max-w-sm w-full shadow-xl text-center">
            <div class="text-4xl mb-4">⚠️</div>
            <h3 class="text-lg font-bold text-gray-800 mb-2">Cancel Reservation?</h3>
            <p class="text-gray-500 text-sm mb-6">This action cannot be undone. Your table will be released.</p>
            <div class="flex gap-3">
              <button (click)="confirmCancel.set(false)"
                      class="flex-1 border border-gray-200 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition">
                Keep it
              </button>
              <button (click)="doCancel()" [disabled]="cancelling()"
                      class="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition">
                {{ cancelling() ? 'Cancelling…' : 'Yes, Cancel' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Edit form -->
        <div *ngIf="editing()" class="bg-white rounded-2xl shadow-sm border border-amber-100 p-8">
          <h2 class="text-xl font-bold text-gray-800 mb-6">Edit Reservation</h2>

          <form [formGroup]="editForm" (ngSubmit)="submitEdit()" class="space-y-6">

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input formControlName="date" type="date" [min]="today"
                       (change)="onDateChange()"
                       class="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"/>
                <span *ngIf="ef['date'].errors?.['pastDate']" class="text-red-500 text-xs mt-1 block">
                  Please select today or a future date.
                </span>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Guests *</label>
                <input formControlName="guests" type="number" min="1" max="20"
                       class="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"/>
              </div>
            </div>

            <!-- Time slot picker -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">Preferred Time *</label>

              <div *ngIf="slotsLoading()" class="flex gap-2 flex-wrap">
                <div *ngFor="let i of [1,2,3,4,5,6]"
                     class="h-10 w-24 rounded-xl bg-gray-100 animate-pulse"></div>
              </div>

              <ng-container *ngIf="!slotsLoading()">
                <!-- Lunch -->
                <div *ngIf="lunchSlots().length > 0" class="mb-5">
                  <div class="flex items-center gap-2 mb-3">
                    <span class="text-base">🍛</span>
                    <span class="text-xs font-semibold text-gray-500 uppercase tracking-widest">Lunch &nbsp;·&nbsp; 12:30 PM – 3:30 PM</span>
                    <div class="flex-1 h-px bg-gray-100"></div>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <button *ngFor="let slot of lunchSlots()" type="button"
                            (click)="ef['time'].setValue(slot)"
                            [ngClass]="ef['time'].value === slot
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
                            (click)="ef['time'].setValue(slot)"
                            [ngClass]="ef['time'].value === slot
                              ? 'bg-amber-600 text-white border-amber-600 shadow-md scale-105'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-amber-400 hover:text-amber-700 hover:bg-amber-50'"
                            class="px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-amber-400">
                      {{ slot }}
                    </button>
                  </div>
                </div>

                <p *ngIf="lunchSlots().length === 0 && dinnerSlots().length === 0"
                   class="text-sm text-amber-600 bg-amber-50 rounded-xl px-4 py-3">
                  No slots available for this date. Please choose another day.
                </p>
              </ng-container>

              <span *ngIf="ef['time'].invalid && ef['time'].touched && !ef['time'].value"
                    class="text-red-500 text-xs mt-2 block">Please select a time slot.</span>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
              <textarea formControlName="notes" rows="3"
                        placeholder="Dietary requirements, special occasions…"
                        class="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"></textarea>
            </div>

            <div *ngIf="editError()" class="text-red-600 text-sm bg-red-50 p-3 rounded-xl">{{ editError() }}</div>

            <div class="flex gap-3">
              <button type="button" (click)="editing.set(false)"
                      class="flex-1 border border-gray-200 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition">
                Cancel
              </button>
              <button type="submit" [disabled]="saving()"
                      class="flex-1 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition">
                {{ saving() ? 'Saving…' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>

      </ng-container>
    </div>
  `
})
export class MyReservationComponent implements OnInit {

  today = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  })();

  private readonly LUNCH_SLOTS  = ['12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM'];
  private readonly DINNER_SLOTS = ['6:30 PM','7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM','9:30 PM','10:00 PM','10:30 PM'];

  reservation   = signal<Reservation | null>(null);
  loading       = signal(true);
  fetchError    = signal('');
  editing       = signal(false);
  saving        = signal(false);
  editError     = signal('');
  confirmCancel = signal(false);
  cancelling    = signal(false);
  cancelled     = signal(false);

  slotsLoading = signal(false);
  lunchSlots   = signal<string[]>([...this.LUNCH_SLOTS]);
  dinnerSlots  = signal<string[]>([...this.DINNER_SLOTS]);

  editForm = this.fb.group({
    date:   ['', [Validators.required, this.futureDateValidator.bind(this)]],
    time:   ['', Validators.required],
    guests: [2,  [Validators.required, Validators.min(1), Validators.max(20)]],
    notes:  ['']
  });

  get ef() { return this.editForm.controls; }

  constructor(
    private auth: CustomerAuthService,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.auth.getMyReservation().subscribe({
      next: res => {
        this.reservation.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.fetchError.set('Could not load your reservation. Please try again.');
        this.loading.set(false);
      }
    });
  }

  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    return control.value < this.today ? { pastDate: true } : null;
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
  }

  isFuture(dateStr: string): boolean {
    if (!dateStr) return false;
    return dateStr >= this.today;
  }

  startEdit(): void {
    const res = this.reservation();
    if (!res) return;
    this.editForm.patchValue({
      date:   res.date,
      time:   res.time,
      guests: res.guests,
      notes:  res.notes || ''
    });
    this.onDateChange(res.date);
    this.editing.set(true);
    this.editError.set('');
  }

  onDateChange(presetDate?: string): void {
    const selectedDate = presetDate ?? this.ef['date'].value;
    if (!selectedDate) return;

    this.slotsLoading.set(true);
    this.http.get<string[]>(`${environment.apiUrl}/reservations/available-slots?date=${selectedDate}`)
      .subscribe({
        next: slots => {
          let filtered = slots;
          if (selectedDate === this.today) {
            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();
            filtered = slots.filter(slot => {
              const [timePart, period] = slot.split(' ');
              let [h, m] = timePart.split(':').map(Number);
              if (period === 'PM' && h !== 12) h += 12;
              if (period === 'AM' && h === 12) h = 0;
              return (h * 60 + m) > currentMinutes + 30;
            });
          }
          this.lunchSlots.set(filtered.filter(s => this.LUNCH_SLOTS.includes(s)));
          this.dinnerSlots.set(filtered.filter(s => this.DINNER_SLOTS.includes(s)));
          this.slotsLoading.set(false);
        },
        error: () => {
          this.lunchSlots.set([...this.LUNCH_SLOTS]);
          this.dinnerSlots.set([...this.DINNER_SLOTS]);
          this.slotsLoading.set(false);
        }
      });
  }

  submitEdit(): void {
    if (this.editForm.invalid) { this.editForm.markAllAsTouched(); return; }
    const res = this.reservation();
    if (!res?.id) return;

    this.saving.set(true);
    this.editError.set('');
    this.auth.updateReservation(res.id, this.editForm.value as any).subscribe({
      next: updated => {
        this.reservation.set(updated);
        // Update localStorage so session reflects new date/time
        this.auth.saveSession(
          this.auth.getToken()!,
          this.auth.getCustomerName()!,
          this.auth.getContact()!,
          updated.date,
          updated.time
        );
        this.saving.set(false);
        this.editing.set(false);
      },
      error: (err) => {
        this.editError.set(err.error?.error || 'Failed to update reservation. Please try again.');
        this.saving.set(false);
      }
    });
  }

  doCancel(): void {
    const res = this.reservation();
    if (!res?.id) return;

    this.cancelling.set(true);
    this.auth.cancelReservation(res.id).subscribe({
      next: () => {
        this.confirmCancel.set(false);
        this.cancelling.set(false);
        this.cancelled.set(true);
        this.auth.logout();
      },
      error: () => {
        this.cancelling.set(false);
        this.confirmCancel.set(false);
      }
    });
  }
}
