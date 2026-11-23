import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@unhead/vue/client'
import { vReveal } from '@/directives/vReveal'

// Import Font Lokal
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'
import '@fontsource/plus-jakarta-sans/400.css'
import '@fontsource/plus-jakarta-sans/500.css'
import '@fontsource/plus-jakarta-sans/600.css'

// Import Tailwind CSS
import '@/assets/main.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()
const head = createHead()

app.use(pinia)
app.use(head)
app.use(router)

app.directive('reveal', vReveal)

app.mount('#app')
