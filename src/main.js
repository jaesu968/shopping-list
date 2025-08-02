import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router.js'
import './assets/global.css' // ✅ updated to use consolidated CSS

const app = createApp(App)
app.use(router)
app.mount('#app')
