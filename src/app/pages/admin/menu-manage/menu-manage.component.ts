import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MenuService } from '../../../services/menu.service';
import { MenuItem, Category } from '../../../models/models';

@Component({
  selector: 'app-menu-manage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div>
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Menu Items</h1>
        <button (click)="showForm.set(true)"
                class="bg-amber-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-amber-700 transition">
          + Add Item
        </button>
      </div>

      <!-- Add/Edit Form -->
      <div *ngIf="showForm()" class="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
        <h2 class="font-semibold mb-5">{{ editingId() ? 'Edit Item' : 'New Menu Item' }}</h2>
        <form [formGroup]="form" (ngSubmit)="submit()" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Name</label>
            <input formControlName="name" class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"/>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Price ($)</label>
            <input formControlName="price" type="number" step="0.01"
                   class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"/>
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <textarea formControlName="description" rows="2"
                      class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"></textarea>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Category</label>
            <select formControlName="categoryId" class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
              <option value="">Select category</option>
              <option *ngFor="let cat of categories()" [value]="cat.id">{{ cat.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Tags (comma-separated)</label>
            <input formControlName="tags" placeholder="veg, bestseller"
                   class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"/>
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs font-medium text-gray-600 mb-1">Image</label>
            <input type="file" accept="image/*" (change)="onFileChange($event)"
                   class="text-sm text-gray-500"/>
            <input formControlName="imageUrl" placeholder="or paste image URL"
                   class="mt-2 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"/>
          </div>
          <div class="md:col-span-2 flex gap-3">
            <button type="submit" class="bg-amber-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-amber-700 transition">
              {{ editingId() ? 'Update' : 'Add Item' }}
            </button>
            <button type="button" (click)="cancelForm()" class="border border-gray-200 text-gray-600 px-6 py-2 rounded-xl text-sm hover:bg-gray-50 transition">
              Cancel
            </button>
          </div>
        </form>
      </div>

      <!-- Menu items list -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div *ngFor="let item of menuItems()"
             class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <img [src]="item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300'"
               [alt]="item.name" class="w-full h-36 object-cover"/>
          <div class="p-4">
            <div class="flex justify-between">
              <h3 class="font-semibold text-sm">{{ item.name }}</h3>
              <span class="text-amber-600 font-bold text-sm">\${{ item.price.toFixed(2) }}</span>
            </div>
            <p class="text-gray-400 text-xs mt-1 mb-3 line-clamp-2">{{ item.description }}</p>
            <div class="flex gap-2">
              <button (click)="edit(item)" class="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-100 transition">Edit</button>
              <button (click)="delete(item.id!)" class="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-lg hover:bg-red-100 transition">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MenuManageComponent implements OnInit {
  menuItems = signal<MenuItem[]>([]);
  categories = signal<Category[]>([]);
  showForm = signal(false);
  editingId = signal<number | null>(null);

  form = this.fb.group({
    name:        ['', Validators.required],
    description: [''],
    price:       [0, Validators.required],
    categoryId:  [''],
    tags:        [''],
    imageUrl:    ['']
  });

  constructor(private fb: FormBuilder, private menuService: MenuService) {}

  ngOnInit(): void {
    this.menuService.getCategories().subscribe(cats => this.categories.set(cats));
    this.load();
  }

  load(): void {
    this.menuService.getMenuItems().subscribe(items => this.menuItems.set(items));
  }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.menuService.uploadImage(file).subscribe(res => this.form.patchValue({ imageUrl: res.url }));
  }

  submit(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    const item: any = {
      name: v.name, description: v.description, price: v.price, imageUrl: v.imageUrl,
      category: { id: v.categoryId },
      tags: v.tags ? (v.tags as string).split(',').map(t => t.trim()) : [],
      isAvailable: true
    };
    const obs = this.editingId()
      ? this.menuService.updateMenuItem(this.editingId()!, item)
      : this.menuService.createMenuItem(item);
    obs.subscribe(() => { this.load(); this.cancelForm(); });
  }

  edit(item: MenuItem): void {
    this.editingId.set(item.id!);
    this.showForm.set(true);
    this.form.patchValue({
      name: item.name, description: item.description, price: item.price,
      imageUrl: item.imageUrl, categoryId: String(item.category?.id ?? ''),
      tags: item.tags?.join(', ') ?? ''
    });
  }

  delete(id: number): void {
    if (confirm('Delete this item?')) this.menuService.deleteMenuItem(id).subscribe(() => this.load());
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.form.reset();
  }
}
