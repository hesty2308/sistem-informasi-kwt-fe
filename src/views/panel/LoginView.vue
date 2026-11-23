<script setup>
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'
import { useAuthStore } from '@/stores/auth'
import { Eye, EyeOff, Lock, Mail, AlertCircle, Loader2 } from 'lucide-vue-next'
import logoUrl from '@/assets/logo.png'

useHead({
  title: 'Masuk Pengelola - Paguyuban KWT Kartini',
  meta: [
    {
      name: 'robots',
      content: 'noindex, nofollow',
    },
  ],
})

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const countdown = ref(0)
let timer = null

const startCountdown = (seconds) => {
  countdown.value = seconds
  clearInterval(timer)
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      errorMessage.value = ''
    }
  }, 1000)
}

const handleLogin = async () => {
  if (countdown.value > 0 || isLoading.value) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    })
    router.replace('/pengelola')
  } catch (error) {
    if (error?.status === 429) {
      const match = error?.message?.match(/(\d+)\s*detik/)
      const seconds = match ? parseInt(match[1], 10) : 60
      startCountdown(seconds)
      errorMessage.value = `Terlalu banyak percobaan. Harap tunggu ${seconds} detik.`
    } else if (error?.status === 422 && error?.errors?.email) {
      errorMessage.value = error.errors.email[0]
    } else {
      errorMessage.value = error?.message || 'Email atau kata sandi salah.'
    }
  } finally {
    isLoading.value = false
  }
}

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <main class="min-h-screen bg-surface flex flex-col justify-center items-center p-4 sm:p-6">
    <div class="max-w-md w-full bg-background rounded-2xl shadow-lg border border-secondary/20 p-6 sm:p-8">
      <!-- Header -->
      <div class="text-center mb-6">
        <img
          :src="logoUrl"
          alt="Logo Paguyuban KWT Kartini"
          class="w-16 h-16 mx-auto mb-3 rounded-full object-contain shadow-sm border border-secondary/20 bg-white p-1"
        />
        <h1 class="text-2xl font-bold text-primary">
          Masuk Pengelola
        </h1>
        <p class="text-sm text-muted mt-1">
          Sistem Informasi Paguyuban KWT Kartini OKU Timur
        </p>
      </div>

      <!-- Alert Error -->
      <div
        v-if="errorMessage"
        class="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2"
      >
        <AlertCircle class="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
        <div>
          <p class="font-medium">{{ errorMessage }}</p>
          <p v-if="countdown > 0" class="text-xs text-red-600 mt-1">
            Dapat mencoba kembali dalam <span class="font-bold font-mono">{{ countdown }}</span> detik.
          </p>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-semibold text-ink mb-1.5">
            Alamat Email
          </label>
          <div class="relative">
            <Mail class="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              id="email"
              v-model="email"
              type="email"
              required
              autocomplete="email"
              placeholder="nama@gmail.com"
              class="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-ink placeholder:text-muted"
            />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-semibold text-ink mb-1.5">
            Kata Sandi
          </label>
          <div class="relative">
            <Lock class="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              autocomplete="current-password"
              placeholder="Masukkan kata sandi"
              class="w-full pl-11 pr-11 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-ink placeholder:text-muted"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink cursor-pointer focus:outline-none"
              :title="showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'"
            >
              <EyeOff v-if="showPassword" class="w-5 h-5" />
              <Eye v-else class="w-5 h-5" />
            </button>
          </div>
        </div>

        <button
          type="submit"
          :disabled="isLoading || countdown > 0"
          class="w-full py-3 px-4 rounded-xl font-bold bg-accent text-primary hover:bg-yellow-400 active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        >
          <Loader2 v-if="isLoading" class="w-5 h-5 animate-spin" />
          <span>{{ isLoading ? 'Memproses...' : (countdown > 0 ? `Tunggu (${countdown}s)` : 'Masuk') }}</span>
        </button>
      </form>
    </div>
  </main>
</template>
