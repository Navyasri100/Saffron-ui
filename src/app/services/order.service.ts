import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order } from '../models/models';
import { CustomerAuthService } from './customer-auth.service';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private api = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient, private auth: CustomerAuthService) {}

  private headers(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
  }

  placeOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.api, order, { headers: this.headers() });
  }

  getMyOrders(): Observable<Order[]> {
    const contact = this.auth.getContact() || '';
    return this.http.get<Order[]>(`${this.api}/my?contact=${encodeURIComponent(contact)}`, { headers: this.headers() });
  }
}
