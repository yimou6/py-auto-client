import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/fonts/iconfont.css'
import './samples/node-api'

const app = createApp(App)

app.use(ElementPlus)

app.mount('#app').$nextTick().then(r => {
    postMessage({ payload: 'removeLoading' }, '*')
})
