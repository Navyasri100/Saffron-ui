import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-gray-900 text-gray-300 py-12 mt-16">
      <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h3 class="text-xl font-bold text-white mb-3">Saffron &amp; Soul</h3>
          <p class="text-sm leading-relaxed">Authentic flavours crafted with love. Experience the finest dining in the heart of the city.</p>
        </div>
        <div>
          <h4 class="text-white font-semibold mb-3">Opening Hours</h4>
          <p class="text-sm">Mon – Fri: 11am – 10pm</p>
          <p class="text-sm">Sat – Sun: 10am – 11pm</p>
        </div>
        <div>
          <h4 class="text-white font-semibold mb-3">Contact</h4>
          <p class="text-sm">Hyderabad, Telangana, India</p>
          <p class="text-sm">+91 98765 43210</p>
          <p class="text-sm">saffronsoul2024&#64;gmail.com</p>
          <div class="flex gap-4 mt-4">
            <a href="#" class="text-amber-400 hover:text-amber-300 text-sm">Instagram</a>
            <a href="#" class="text-amber-400 hover:text-amber-300 text-sm">Facebook</a>
            <a href="https://wa.me/919876543210" class="text-amber-400 hover:text-amber-300 text-sm">WhatsApp</a>
          </div>
        </div>
      </div>
      <div class="text-center text-xs text-gray-500 mt-10">
        &copy; 2024 Saffron &amp; Soul. All rights reserved.
      </div>
    </footer>
  `
})
export class FooterComponent {}
