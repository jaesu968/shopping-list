import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router.js'
import './assets/base.css' // <-- this should exist to reset body margin/padding

const app = createApp(App)
app.use(router)
app.mount('#app')