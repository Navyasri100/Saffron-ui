import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../../services/menu.service';
import { OrderService } from '../../services/order.service';
import { CustomerAuthService } from '../../services/customer-auth.service';
import { MenuItem, CartItem } from '../../models/models';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <!-- Order Success Toast -->
    <div *ngIf="orderSuccess()"
         class="fixed inset-0 z-[9999] flex items-center justify-center px-4 pointer-events-none">
      <div class="bg-white rounded-3xl shadow-2xl border border-green-200 p-8 max-w-sm w-full text-center pointer-events-auto"
           style="animation: slideUp 0.3s ease-out;">
        <div class="text-6xl mb-4">🎉</div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2" style="font-family:'Georgia',serif;">Order Placed!</h2>
        <p class="text-gray-600 mb-1">Your order has been received.</p>
        <p class="text-amber-700 font-medium text-sm">We'll prepare it fresh for you shortly!</p>
        <div class="mt-6 w-full bg-gray-100 rounded-full h-1 overflow-hidden">
          <div class="h-1 bg-amber-500 rounded-full" style="animation: shrink 4s linear forwards;"></div>
        </div>
        <p class="text-xs text-gray-400 mt-2">Closing automatically...</p>
      </div>
      <style>
        @keyframes slideUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shrink { from { width:100%; } to { width:0%; } }
      </style>
    </div>

    <div class="min-h-screen" style="
      background-color: #fdf6f0;
      background-image:
        radial-gradient(ellipse at 20% 50%, rgba(251, 191, 104, 0.15) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 20%, rgba(253, 164, 175, 0.12) 0%, transparent 40%),
        radial-gradient(ellipse at 60% 80%, rgba(167, 243, 208, 0.10) 0%, transparent 40%);
    ">
      <div class="max-w-6xl mx-auto px-4 py-16">

        <!-- Header with customer info -->
        <div class="text-center mb-6 bg-white/70 rounded-2xl px-5 py-3 shadow-sm border border-amber-100">
          <span class="text-amber-700 font-semibold text-sm">Welcome, {{ customerName() }}</span>
        </div>

        <!-- Restaurant Header -->
        <div class="text-center mb-16 pt-4">
          <div class="flex justify-center mb-8">
            <div class="flex flex-col items-center justify-center w-36 h-36 rounded-full border-2 border-amber-400"
                 style="background: rgba(251,191,36,0.08);">
              <span class="text-3xl font-bold text-amber-700" style="font-family:'Georgia',serif; font-style:italic; letter-spacing:-0.02em;">S&amp;S</span>
              <div class="w-10 h-px bg-amber-400 my-1 opacity-60"></div>
              <span class="text-xs font-semibold text-amber-600 tracking-[0.18em]">SAFFRON &amp; SOUL</span>
            </div>
          </div>

          <h1 class="text-5xl md:text-6xl font-bold mb-3" style="
            background: linear-gradient(135deg, #92400e 0%, #d97706 40%, #b45309 70%, #78350f 100%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
            font-family: 'Georgia', 'Garamond', serif; letter-spacing: 0.04em; font-style: italic;">
            Saffron &amp; Soul
          </h1>
          <div class="text-sm font-semibold tracking-[0.3em] text-amber-800/60 uppercase mb-2">Est. 2024 · Fine Indian Dining</div>

          <div class="flex items-center justify-center gap-6 mb-5">
            <div class="w-16 h-px bg-gradient-to-r from-amber-100 to-amber-300"></div>
            <span class="text-amber-700 text-2xl">✦</span>
            <div class="w-16 h-px bg-gradient-to-l from-amber-100 to-amber-300"></div>
          </div>
          <p class="text-amber-900/70 text-sm font-medium tracking-widest uppercase mb-3">Where Spice Meets Soul</p>
          <p class="text-gray-600 text-base max-w-xl mx-auto leading-relaxed font-light">
            Bold flavors, handcrafted recipes, and timeless Indian traditions<br/>
            <span class="text-amber-700 font-medium">Every dish tells a story • Every bite stirs the soul</span>
          </p>
        </div>

        <!-- Loading -->
        <div *ngIf="loading()" class="text-center py-16">
          <p class="text-gray-600 font-medium">Loading menu...</p>
        </div>

        <div *ngIf="!loading()">
          <!-- Veg / Non-Veg Pills -->
          <div class="flex items-center justify-center gap-3 mb-6">
            <button (click)="vegFilter.set('all'); resetTab()"
                    [style.background]="vegFilter() === 'all' ? '#92400e' : 'rgba(255,255,255,0.8)'"
                    [style.color]="vegFilter() === 'all' ? '#fff' : ''"
                    [style.borderColor]="vegFilter() === 'all' ? '#92400e' : ''"
                    class="px-5 py-1.5 rounded-full border border-stone-300 text-stone-600 text-sm font-medium transition">
              All
            </button>
            <button (click)="vegFilter.set('veg'); resetTab()"
                    [style.background]="vegFilter() === 'veg' ? '#16a34a' : 'rgba(255,255,255,0.8)'"
                    [style.color]="vegFilter() === 'veg' ? '#fff' : ''"
                    [style.borderColor]="vegFilter() === 'veg' ? '#16a34a' : ''"
                    class="px-5 py-1.5 rounded-full border border-stone-300 text-stone-600 text-sm font-medium transition">
              🥬 Veg
            </button>
            <button (click)="vegFilter.set('non-veg'); resetTab()"
                    [style.background]="vegFilter() === 'non-veg' ? '#dc2626' : 'rgba(255,255,255,0.8)'"
                    [style.color]="vegFilter() === 'non-veg' ? '#fff' : ''"
                    [style.borderColor]="vegFilter() === 'non-veg' ? '#dc2626' : ''"
                    class="px-5 py-1.5 rounded-full border border-stone-300 text-stone-600 text-sm font-medium transition">
              🍗 Non-Veg
            </button>
          </div>

          <!-- Category Tabs (scrollable) -->
          <div class="sticky top-14 z-30 bg-amber-50/95 backdrop-blur-sm border-b border-amber-200 mb-6 -mx-4 px-4">
            <div class="flex overflow-x-auto gap-0 scrollbar-hide max-w-3xl mx-auto">
              <button *ngFor="let group of groupedMenu()"
                      (click)="activeTab.set(group.name)"
                      class="flex-shrink-0 px-5 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap"
                      [style.borderColor]="activeTab() === group.name ? '#92400e' : 'transparent'"
                      [style.color]="activeTab() === group.name ? '#92400e' : '#78716c'"
                      [style.fontWeight]="activeTab() === group.name ? '700' : '500'">
                {{ group.name }}
              </button>
            </div>
          </div>

          <!-- Active Tab Content -->
          <div class="max-w-3xl mx-auto">
            <ng-container *ngFor="let group of groupedMenu()">
              <div *ngIf="activeTab() === group.name" class="flex flex-col gap-3">
                <div *ngFor="let item of group.items"
                     class="bg-white/90 rounded-xl px-5 py-4 flex items-center justify-between gap-4 hover:shadow-md transition-all duration-200"
                     style="border: 1px solid rgba(217,119,6,0.2);">

                  <!-- Left: info -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-0.5">
                      <span class="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            [style.background]="item.tags.includes('vegetarian') ? '#16a34a' : '#dc2626'"></span>
                      <h3 class="text-base font-semibold text-gray-900 truncate">{{ item.name }}</h3>
                    </div>
                    <p class="text-gray-500 text-xs leading-relaxed line-clamp-2 ml-4">{{ item.description }}</p>
                  </div>

                  <!-- Right: price + cart -->
                  <div class="flex items-center gap-4 flex-shrink-0">
                    <span class="text-base font-bold text-amber-700">₹{{ item.price }}</span>
                    <ng-container *ngIf="getCartQty(item) === 0; else qtyControls">
                      <button (click)="addToCart(item)"
                              class="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-1.5 rounded-full transition">
                        + Add
                      </button>
                    </ng-container>
                    <ng-template #qtyControls>
                      <div class="flex items-center gap-1.5">
                        <button (click)="removeFromCart(item)" class="w-7 h-7 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-full font-bold transition">−</button>
                        <span class="font-bold text-amber-800 text-sm w-4 text-center">{{ getCartQty(item) }}</span>
                        <button (click)="addToCart(item)" class="w-7 h-7 bg-amber-600 hover:bg-amber-700 text-white rounded-full font-bold transition">+</button>
                      </div>
                    </ng-template>
                  </div>
                </div>

                <div *ngIf="group.items.length === 0" class="text-center py-10 text-gray-400 text-sm">
                  No {{ vegFilter() === 'veg' ? 'vegetarian' : 'non-vegetarian' }} items in this category.
                </div>
              </div>
            </ng-container>
          </div>
        </div>
      </div>

      <!-- ── FLOATING CART BUTTON ── -->
      <button *ngIf="cartCount() > 0 && !cartOpen()"
              (click)="cartOpen.set(true)"
              class="fixed bottom-6 right-6 z-40 flex items-center gap-3 bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-4 rounded-full shadow-2xl transition-all"
              style="animation: slideUp 0.3s ease-out;">
        <span class="text-xl">🛒</span>
        <span class="text-sm">View Cart</span>
        <span class="bg-white text-amber-700 text-xs font-extrabold w-6 h-6 rounded-full flex items-center justify-center">
          {{ cartCount() }}
        </span>
        <span class="text-sm font-semibold opacity-90">· ₹{{ cartTotal() }}</span>
      </button>

      <!-- ── CART SIDEBAR ── -->
      <div *ngIf="cartOpen()" class="fixed inset-0 z-50 flex">
        <!-- Backdrop -->
        <div class="flex-1 bg-black/40" (click)="cartOpen.set(false)"></div>

        <!-- Panel -->
        <div class="w-full max-w-sm bg-white shadow-2xl flex flex-col h-full overflow-hidden">
          <div class="flex items-center justify-between px-6 py-5 border-b border-amber-100 bg-amber-50">
            <h2 class="text-xl font-bold text-gray-900">🛒 Your Cart</h2>
            <button (click)="cartOpen.set(false)" class="text-gray-500 hover:text-gray-800 text-2xl leading-none">&times;</button>
          </div>

          <!-- Empty cart -->
          <div *ngIf="cart().length === 0" class="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3 p-6">
            <span class="text-5xl">🍽️</span>
            <p class="font-medium">Your cart is empty</p>
            <p class="text-sm text-center">Add items from the menu to get started</p>
          </div>

          <!-- Cart items -->
          <div *ngIf="cart().length > 0" class="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            <div *ngFor="let item of cart()" class="flex items-center gap-3 bg-amber-50 rounded-xl p-3">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-900 truncate">{{ item.menuItemName }}</p>
                <p class="text-xs text-amber-700 font-medium">₹{{ item.price }} × {{ item.quantity }}</p>
              </div>
              <div class="flex items-center gap-1">
                <button (click)="decreaseCartItem(item)" class="w-7 h-7 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-full text-sm font-bold transition">−</button>
                <span class="w-5 text-center text-sm font-bold">{{ item.quantity }}</span>
                <button (click)="increaseCartItem(item)" class="w-7 h-7 bg-amber-600 hover:bg-amber-700 text-white rounded-full text-sm font-bold transition">+</button>
              </div>
              <p class="text-sm font-bold text-gray-800 w-14 text-right">₹{{ item.price * item.quantity }}</p>
            </div>
          </div>

          <!-- Order notes + total + place order -->
          <div *ngIf="cart().length > 0" class="border-t border-amber-100 px-5 py-5 space-y-4 bg-white">
            <textarea [(ngModel)]="orderNotes" placeholder="Any special instructions? (optional)"
                      rows="2"
                      class="w-full border border-amber-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-500 resize-none"></textarea>

            <div class="space-y-1 text-sm text-gray-600 border-t border-amber-100 pt-3">
              <div class="flex justify-between">
                <span>Subtotal</span>
                <span>₹{{ cartSubtotal() }}</span>
              </div>
              <div class="flex justify-between">
                <span>CGST (9%)</span>
                <span>₹{{ cartCGST() }}</span>
              </div>
              <div class="flex justify-between">
                <span>SGST (9%)</span>
                <span>₹{{ cartSGST() }}</span>
              </div>
            </div>
            <div class="flex justify-between items-center font-bold text-gray-900 border-t border-amber-200 pt-3">
              <span>Total (incl. GST)</span>
              <span class="text-2xl text-amber-700">₹{{ cartTotal() }}</span>
            </div>

            <div *ngIf="orderSuccess()" class="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 text-center font-medium">
              ✅ Order placed successfully! We'll prepare it shortly.
            </div>
            <div *ngIf="orderError()" class="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 text-center">
              {{ orderError() }}
            </div>

            <div *ngIf="!cartAllowed()" class="bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl px-4 py-3 text-center">
              🕐 Ordering opens 1 hour before your reservation time
            </div>

            <button (click)="placeOrder()" [disabled]="orderLoading() || !cartAllowed()"
                    class="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition text-base">
              {{ orderLoading() ? 'Placing Order...' : '🍽️ Place Order' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MenuComponent implements OnInit {
  allMenuItems = signal<MenuItem[]>([]);
  loading = signal(true);
  vegFilter = signal<'all' | 'veg' | 'non-veg'>('all');
  activeTab = signal<string>('');

  cart = signal<CartItem[]>([]);
  cartOpen = signal(false);
  orderNotes = '';
  orderLoading = signal(false);
  orderSuccess = signal(false);
  orderError = signal('');

  customerName = signal('');
  customerContact = signal('');
  cartAllowed = signal(false);

  cartCount = computed(() => this.cart().reduce((s, i) => s + i.quantity, 0));
  cartSubtotal = computed(() => this.cart().reduce((s, i) => s + i.price * i.quantity, 0));
  cartCGST = computed(() => Math.round(this.cartSubtotal() * 0.09 * 100) / 100);
  cartSGST = computed(() => Math.round(this.cartSubtotal() * 0.09 * 100) / 100);
  cartTotal = computed(() => Math.round((this.cartSubtotal() + this.cartCGST() + this.cartSGST()) * 100) / 100);

  groupedMenu = computed(() => {
    const filter = this.vegFilter();
    let items = this.allMenuItems();
    if (filter === 'veg') {
      items = items.filter(i => i.tags?.includes('vegetarian'));
    } else if (filter === 'non-veg') {
      items = items.filter(i => i.tags?.includes('non-vegetarian'));
    }

    const groupMap = new Map<string, MenuItem[]>();
    for (const item of items) {
      const catName = item.category?.name ?? 'Other';
      if (!groupMap.has(catName)) {
        groupMap.set(catName, []);
      }
      groupMap.get(catName)!.push(item);
    }

    return Array.from(groupMap.entries()).map(([name, groupItems]) => ({ name, items: groupItems }));
  });

  constructor(
    private menuService: MenuService,
    private orderService: OrderService,
    private authService: CustomerAuthService
  ) {}

  ngOnInit(): void {
    this.customerName.set(this.authService.getCustomerName() || '');
    this.customerContact.set(this.authService.getContact() || '');
    this.cartAllowed.set(this.authService.canAddToCart());
    // Re-check every minute so the cart unlocks automatically when the 1hr window opens
    setInterval(() => this.cartAllowed.set(this.authService.canAddToCart()), 60_000);
    this.loading.set(true);
    this.menuService.getMenuItems().subscribe({
      next: items => {
        this.allMenuItems.set(items);
        this.loading.set(false);
        // Auto-select first tab
        const groups = this.groupedMenu();
        if (groups.length > 0 && !this.activeTab()) this.activeTab.set(groups[0].name);
      },
      error: () => this.loading.set(false)
    });
  }

  resetTab(): void {
    const groups = this.groupedMenu();
    if (groups.length > 0) this.activeTab.set(groups[0].name);
  }

  getCartQty(item: MenuItem): number {
    return this.cart().find(c => c.menuItemId === item.id)?.quantity ?? 0;
  }

  addToCart(item: MenuItem): void {
    const current = this.cart();
    const idx = current.findIndex(c => c.menuItemId === item.id);
    if (idx >= 0) {
      const updated = [...current];
      updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
      this.cart.set(updated);
    } else {
      this.cart.set([...current, {
        menuItemId: item.id!,
        menuItemName: item.name,
        quantity: 1,
        price: item.price,
        imageUrl: item.imageUrl
      }]);
    }
  }

  removeFromCart(item: MenuItem): void {
    const current = this.cart();
    const idx = current.findIndex(c => c.menuItemId === item.id);
    if (idx < 0) return;
    if (current[idx].quantity === 1) {
      this.cart.set(current.filter(c => c.menuItemId !== item.id));
    } else {
      const updated = [...current];
      updated[idx] = { ...updated[idx], quantity: updated[idx].quantity - 1 };
      this.cart.set(updated);
    }
  }

  increaseCartItem(item: CartItem): void {
    this.cart.set(this.cart().map(c =>
      c.menuItemId === item.menuItemId ? { ...c, quantity: c.quantity + 1 } : c
    ));
  }

  decreaseCartItem(item: CartItem): void {
    const updated = this.cart()
      .map(c => c.menuItemId === item.menuItemId ? { ...c, quantity: c.quantity - 1 } : c)
      .filter(c => c.quantity > 0);
    this.cart.set(updated);
  }

  placeOrder(): void {
    if (this.cart().length === 0) return;
    this.orderLoading.set(true);
    this.orderError.set('');
    this.orderSuccess.set(false);

    const order = {
      customerName: this.customerName(),
      customerContact: this.customerContact(),
      items: this.cart(),
      totalAmount: this.cartTotal(),
      notes: this.orderNotes
    };

    this.orderService.placeOrder(order).subscribe({
      next: () => {
        this.orderLoading.set(false);
        this.orderSuccess.set(true);
        this.cart.set([]);
        this.orderNotes = '';
        setTimeout(() => { this.orderSuccess.set(false); this.cartOpen.set(false); }, 4000);
      },
      error: err => {
        this.orderLoading.set(false);
        this.orderError.set(err.error?.error || 'Failed to place order. Please try again.');
      }
    });
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/menu-login';
  }
}
