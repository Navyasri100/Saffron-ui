import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuItem, Category } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMenuItems(categoryId?: number, tag?: string): Observable<MenuItem[]> {
    let url = `${this.api}/menu`;
    if (categoryId) url += `?categoryId=${categoryId}`;
    else if (tag) url += `?tag=${tag}`;
    return this.http.get<MenuItem[]>(url);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.api}/categories`);
  }

  createMenuItem(item: MenuItem): Observable<MenuItem> {
    return this.http.post<MenuItem>(`${this.api}/menu`, item);
  }

  updateMenuItem(id: number, item: MenuItem): Observable<MenuItem> {
    return this.http.put<MenuItem>(`${this.api}/menu/${id}`, item);
  }

  deleteMenuItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/menu/${id}`);
  }

  uploadImage(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(`${this.api}/admin/upload`, formData);
  }
}
