import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <!-- Hero -->
    <section class="relative bg-gray-900 text-white min-h-screen flex items-center">
      <div class="absolute inset-0 bg-cover bg-center opacity-40"
           style="background-image: url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400')">
      </div>
      <div class="relative max-w-6xl mx-auto px-4 text-center">
        <!-- Hero Logo -->
        <div class="flex justify-center mb-8">
          <div class="flex flex-col items-center justify-center w-40 h-40 rounded-full border-2 border-amber-400" style="background: rgba(0,0,0,0.25);">
            <span class="text-3xl font-bold text-amber-300" style="font-family:'Georgia',serif; font-style:italic; letter-spacing:-0.02em;">S&amp;S</span>
            <div class="w-12 h-px bg-amber-400 my-1 opacity-70"></div>
            <span class="text-xs font-semibold text-amber-200 tracking-[0.2em]">SAFFRON &amp; SOUL</span>
          </div>
        </div>

        <p class="text-amber-300 font-medium tracking-widest text-sm uppercase mb-4">Welcome to</p>
        <h1 class="text-5xl md:text-7xl font-bold mb-6" style="background: linear-gradient(135deg, #fbbf24 0%, #f97316 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-family: 'Georgia', serif; letter-spacing: -0.01em; font-style: italic; line-height: 1.2; padding-bottom: 0.12em;">Saffron &amp; Soul</h1>
        <p class="text-xl text-gray-200 max-w-2xl mx-auto mb-10">
          Authentic flavours. Unforgettable evenings. Every dish is a story.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a routerLink="/reservation"
             class="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition">
            Book a Table
          </a>
          <a routerLink="/menu"
             class="border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-4 rounded-full font-semibold text-lg transition">
            View Menu
          </a>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="py-20 bg-white">
      <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
        <div class="p-8 rounded-2xl bg-amber-50">
          <div class="text-4xl mb-4">🍽️</div>
          <h3 class="text-xl font-bold mb-2">Authentic Recipes</h3>
          <p class="text-gray-600 text-sm">Passed down through generations, our recipes bring the true taste of tradition.</p>
        </div>
        <div class="p-8 rounded-2xl bg-amber-50">
          <div class="text-4xl mb-4">🌿</div>
          <h3 class="text-xl font-bold mb-2">Fresh Ingredients</h3>
          <p class="text-gray-600 text-sm">We source locally every morning. What's on your plate was in the farm yesterday.</p>
        </div>
        <div class="p-8 rounded-2xl bg-amber-50">
          <div class="text-4xl mb-4">⭐</div>
          <h3 class="text-xl font-bold mb-2">Award Winning</h3>
          <p class="text-gray-600 text-sm">Recognised as the city's finest dining experience three years running.</p>
        </div>
      </div>
    </section>

    <!-- About -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
        <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700"
             alt="Restaurant interior" class="rounded-2xl w-full h-96 object-cover"/>
        <div>
          <p class="text-amber-600 font-medium uppercase tracking-widest text-sm mb-3">Our Story</p>
          <h2 class="text-4xl font-bold mb-6">Cooking with passion since 1998</h2>
          <p class="text-gray-600 leading-relaxed mb-6">
            What started as a small family kitchen has grown into one of the most beloved dining destinations in the city. Every dish is made from scratch, every guest is treated like family.
          </p>
          <a routerLink="/menu" class="bg-amber-600 text-white px-6 py-3 rounded-full hover:bg-amber-700 transition font-medium">
            Explore Our Menu
          </a>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 bg-amber-600 text-white text-center">
      <h2 class="text-4xl font-bold mb-4">Ready for an unforgettable meal?</h2>
      <p class="text-amber-100 mb-8 text-lg">Reserve your table today. Walk-ins welcome, but booking is recommended.</p>
      <a routerLink="/reservation"
         class="bg-white text-amber-700 px-10 py-4 rounded-full font-bold text-lg hover:bg-amber-50 transition">
        Make a Reservation
      </a>
    </section>
  `
})
export class HomeComponent {}
