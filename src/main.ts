import { createApp } from 'vue'
import App from './App.vue'
import './assets/fonts/iconfont.css'
import './samples/node-api'
import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)

app.mount('#app').$nextTick().then(r => {
    postMessage({ payload: 'removeLoading' }, '*')
})
