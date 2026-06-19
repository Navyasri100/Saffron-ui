import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.api}/reservations`, reservation);
  }

  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.api}/admin/reservations`);
  }

  updateStatus(id: number, status: string): Observable<Reservation> {
    return this.http.put<Reservation>(
      `${this.api}/admin/reservations/${id}/status?status=${status}`, {}
    );
  }

  deleteReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/admin/reservations/${id}`);
  }
}
