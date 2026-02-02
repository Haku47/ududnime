import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // <--- PASTIKAN ADA INI
import './style.css' // Jika ada CSS global

const app = createApp(App)

app.use(router) // <--- WAJIB DIPASANG
app.mount('#app')