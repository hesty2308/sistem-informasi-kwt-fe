<script setup>
import { useHead } from '@unhead/vue'
import { RouterLink } from 'vue-router'
import { ShieldAlert, Home, ArrowLeft } from 'lucide-vue-next'
import logoUrl from '@/assets/logo.png'

useHead({
  title: 'Akses Ditolak (403) - Paguyuban KWT Kartini',
  meta: [
    {
      name: 'robots',
      content: 'noindex, nofollow',
    },
  ],
})
</script>

<template>
  <main class="min-h-screen bg-surface flex flex-col justify-center items-center p-4 sm:p-8">
    <div class="max-w-md w-full bg-white rounded-3xl shadow-card border border-secondary/20 p-8 sm:p-10 text-center">
      <!-- Logo Bundar -->
      <img
        :src="logoUrl"
        alt="Logo Paguyuban KWT Kartini"
        class="w-20 h-20 mx-auto mb-6 rounded-full object-contain p-1 border border-secondary/20 bg-white shadow-xs"
      />

      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-wider mb-3 border border-amber-200">
        <ShieldAlert class="w-3.5 h-3.5" />
        <span>Galat 403</span>
      </div>

      <h1 class="text-2xl sm:text-3xl font-black text-ink mb-2">
        Akses Ditolak
      </h1>

      <p class="text-muted text-sm sm:text-base leading-relaxed mb-8">
        Anda tidak berhak mengakses fitur ini. Halaman ini dikhususkan untuk tingkat kewenangan Super Admin.
      </p>

      <div class="flex flex-col gap-3">
        <RouterLink
          to="/"
          class="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-full font-bold bg-accent text-primary-dark hover:bg-yellow-400 active:scale-95 transition shadow-sm"
        >
          <Home class="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </RouterLink>

        <RouterLink
          to="/pengelola"
          class="inline-flex items-center justify-center gap-2 w-full py-3 px-6 rounded-full font-semibold text-primary hover:bg-surface border border-secondary/30 transition text-sm"
        >
          <ArrowLeft class="w-4 h-4" />
          <span>Kembali ke Panel Pengelola</span>
        </RouterLink>
      </div>
    </div>
  </main>
</template>
