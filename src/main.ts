// Global Styles
import './assets/main.css'
import 'floating-vue/dist/style.css'

import { createApp } from 'vue'

// Import Plugins
import FloatingVue from 'floating-vue'
import { createPinia } from 'pinia'

import App from './App.vue'

const app = createApp(App)

// Install Plugins
app.use(createPinia())
app.use(FloatingVue)

app.mount('#app')
