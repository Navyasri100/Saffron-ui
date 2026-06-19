import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../../../services/reservation.service';
import { Reservation } from '../../../models/models';

@Component({
  selector: 'app-reservations-manage',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h1 class="text-2xl font-bold text-gray-900 mb-8">Reservations</h1>

      <div *ngIf="loading()" class="text-gray-400">Loading...</div>

      <div *ngIf="!loading()" class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
            <tr>
              <th class="px-6 py-4 text-left">Guest</th>
              <th class="px-6 py-4 text-left">Date & Time</th>
              <th class="px-6 py-4 text-left">Guests</th>
              <th class="px-6 py-4 text-left">Status</th>
              <th class="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr *ngFor="let r of reservations()" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4">
                <p class="font-medium text-gray-900">{{ r.name }}</p>
                <p class="text-gray-400 text-xs">{{ r.email }}</p>
                <p class="text-gray-400 text-xs">{{ r.phone }}</p>
              </td>
              <td class="px-6 py-4">
                <p>{{ r.date }}</p>
                <p class="text-gray-400">{{ r.time }}</p>
              </td>
              <td class="px-6 py-4">{{ r.guests }}</td>
              <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full text-xs font-medium"
                      [ngClass]="{
                        'bg-yellow-100 text-yellow-700': r.status === 'PENDING',
                        'bg-green-100 text-green-700': r.status === 'CONFIRMED',
                        'bg-red-100 text-red-700': r.status === 'CANCELLED'
                      }">
                  {{ r.status }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex gap-2">
                  <button *ngIf="r.status === 'PENDING'"
                          (click)="updateStatus(r.id!, 'CONFIRMED')"
                          class="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 transition">
                    Confirm
                  </button>
                  <button *ngIf="r.status !== 'CANCELLED'"
                          (click)="updateStatus(r.id!, 'CANCELLED')"
                          class="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition">
                    Cancel
                  </button>
                  <button (click)="delete(r.id!)"
                          class="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-lg hover:bg-gray-200 transition">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div *ngIf="reservations().length === 0" class="text-center py-12 text-gray-400">
          No reservations yet.
        </div>
      </div>
    </div>
  `
})
export class ReservationsManageComponent implements OnInit {
  reservations = signal<Reservation[]>([]);
  loading = signal(true);

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.reservationService.getAllReservations().subscribe({
      next: data => { this.reservations.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  updateStatus(id: number, status: string): void {
    this.reservationService.updateStatus(id, status).subscribe(() => this.load());
  }

  delete(id: number): void {
    if (confirm('Delete this reservation?')) {
      this.reservationService.deleteReservation(id).subscribe(() => this.load());
    }
  }
}
