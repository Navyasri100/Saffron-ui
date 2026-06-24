import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Reservation } from '../models/models';

interface VerifyAccessResponse {
  token: string;
  customerName: string;
  contact: string;
  reservationDate: string;
  reservationTime: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class CustomerAuthService {
  private api = `${environment.apiUrl}/customer`;

  constructor(private http: HttpClient) {}

  verifyAccess(contact: string): Observable<VerifyAccessResponse> {
    return this.http.post<VerifyAccessResponse>(`${this.api}/verify-access`, { contact });
  }

  saveSession(token: string, customerName: string, contact: string, reservationDate = '', reservationTime = ''): void {
    localStorage.setItem('customer_token', token);
    localStorage.setItem('customer_name', customerName);
    localStorage.setItem('customer_contact', contact);
    localStorage.setItem('customer_reservation_date', reservationDate);
    localStorage.setItem('customer_reservation_time', reservationTime);
  }

  getToken(): string | null { return localStorage.getItem('customer_token'); }
  getCustomerName(): string | null { return localStorage.getItem('customer_name'); }
  getContact(): string | null { return localStorage.getItem('customer_contact'); }
  getReservationDate(): string { return localStorage.getItem('customer_reservation_date') || ''; }
  getReservationTime(): string { return localStorage.getItem('customer_reservation_time') || ''; }

  /** Returns true only if today is the reservation day AND current time is within 1hr before reservation time */
  canAddToCart(): boolean {
    const resDate = this.getReservationDate();
    const resTime = this.getReservationTime();
    if (!resDate || !resTime) return false;

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    if (todayStr !== resDate) return false;

    // Parse "8:00 PM" / "12:30 PM" (12-hr) or "20:00" / "20:00:00" (24-hr)
    let h: number, m: number;
    if (/AM|PM/i.test(resTime)) {
      const [timePart, period] = resTime.trim().split(' ');
      [h, m] = timePart.split(':').map(Number);
      if (/PM/i.test(period) && h !== 12) h += 12;
      if (/AM/i.test(period) && h === 12) h = 0;
    } else {
      [h, m] = resTime.split(':').map(Number);
    }

    const resMinutes = h * 60 + m;
    const nowMinutes = today.getHours() * 60 + today.getMinutes();
    return nowMinutes >= resMinutes - 60;
  }

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.getToken()}` });
  }

  getMyReservation(): Observable<Reservation> {
    return this.http.get<Reservation>(`${environment.apiUrl}/reservations/mine`,
      { headers: this.authHeaders() });
  }

  updateReservation(id: number, data: Partial<Reservation>): Observable<Reservation> {
    return this.http.put<Reservation>(`${environment.apiUrl}/reservations/${id}`, data,
      { headers: this.authHeaders() });
  }

  cancelReservation(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/reservations/${id}`,
      { headers: this.authHeaders() });
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp * 1000 <= Date.now()) {
        this.logout();
        return false;
      }
      return true;
    } catch {
      this.logout();
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer_name');
    localStorage.removeItem('customer_contact');
  }
}
