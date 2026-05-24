import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'  // 如果有全局样式文件
import '@fortawesome/fontawesome-free/css/all.min.css'
import { createPinia } from 'pinia'


const app = createApp(App)
app.use(router)
app.use(createPinia())
app.mount('#app')