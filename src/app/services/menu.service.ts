import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MenuItem, Category } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private api = environment.apiUrl;
  private menuCache = signal<MenuItem[] | null>(null);

  constructor(private http: HttpClient) {}

  getMenuItems(categoryId?: number, tag?: string): Observable<MenuItem[]> {
    // Return cached if exists
    if (this.menuCache()) {
      const items = this.menuCache()!;
      if (categoryId) return of(items.filter(i => i.category?.id === categoryId));
      if (tag) return of(items.filter(i => i.tags?.includes(tag)));
      return of(items);
    }

    // Load from JSON file (static asset - very fast)
    return this.http.get<MenuItem[]>('/assets/data/menu.json').pipe(
      tap(items => this.menuCache.set(items)),
      catchError(() => {
        // Fallback to server API if JSON fails
        let url = `${this.api}/menu`;
        if (categoryId) url += `?categoryId=${categoryId}`;
        else if (tag) url += `?tag=${tag}`;
        return this.http.get<MenuItem[]>(url).pipe(
          tap(items => this.menuCache.set(items)),
          catchError(() => {
            console.error('Failed to load menu from both sources');
            return of([]);
          })
        );
      })
    );
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
