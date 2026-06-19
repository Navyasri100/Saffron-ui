import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-6xl mx-auto px-4 py-16">
      <!-- Page Header with Branding -->
      <div class="text-center mb-16 pb-8 border-b border-amber-100">
        <p class="text-amber-600 font-medium uppercase tracking-widest text-sm mb-3">Visual Story</p>
        <h1 class="text-5xl font-bold mb-1" style="font-family: 'Georgia', serif; color: #1a1a1a;">Our Gallery</h1>
        <p class="text-gray-600 mt-3 text-lg">A glimpse into our world of flavour and atmosphere.</p>
        <div class="flex items-center justify-center gap-3 mt-6">
          <div class="w-8 h-px bg-gradient-to-r from-transparent to-amber-300"></div>
          <span class="text-amber-600">✦</span>
          <div class="w-8 h-px bg-gradient-to-l from-transparent to-amber-300"></div>
        </div>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <img *ngFor="let img of images"
             [src]="img.url"
             [alt]="img.alt"
             loading="lazy"
             (error)="onImgError($event)"
             class="w-full h-52 object-cover rounded-xl hover:scale-105 transition-transform duration-300 cursor-pointer bg-amber-50"/>
      </div>
    </div>
  `
})
export class GalleryComponent {
  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop';
    img.onerror = null;
  }

  images = [
    // INDIAN FOOD — CURRIES & MAINS
    { url: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=400&fit=crop', alt: 'Butter chicken curry' },
    { url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=400&fit=crop', alt: 'Dal makhani' },
    { url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=400&fit=crop', alt: 'Palak paneer' },
    { url: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop', alt: 'Biryani rice dish' },

    // BREAD & STARTERS
    { url: 'https://images.unsplash.com/photo-1601050915588-248e827007ce?w=400&h=400&fit=crop', alt: 'Samosa starters' },
    { url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=400&fit=crop', alt: 'Paneer tikka' },
    { url: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=400&fit=crop', alt: 'Freshly baked naan' },
    { url: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=400&fit=crop', alt: 'Indian street food' },

    // DESSERTS & SWEETS
    { url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop', alt: 'Gulab jamun dessert' },
    { url: 'https://images.unsplash.com/photo-1516100882582-96c3a05fe590?w=400&h=400&fit=crop', alt: 'Kulfi ice cream' },
    { url: 'https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?w=400&h=400&fit=crop', alt: 'Indian sweets' },
    { url: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=400&h=400&fit=crop', alt: 'Mango dessert' },

    // BEVERAGES
    { url: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop', alt: 'Mango lassi drink' },
    { url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop', alt: 'Masala chai' },
    { url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop', alt: 'Refreshing beverages' },
    { url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&h=400&fit=crop', alt: 'Cocktail drinks' },

    // RESTAURANT AMBIANCE
    { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=400&fit=crop', alt: 'Elegant restaurant interior' },
    { url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=400&fit=crop', alt: 'Fine dining atmosphere' },
    { url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop', alt: 'Beautifully plated dish' },
    { url: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=400&fit=crop', alt: 'Chef special creation' },
  ];
}
