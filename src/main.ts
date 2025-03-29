import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './index.css'
import { createRouter, createWebHistory } from 'vue-router'

import Login from './components/Login.vue'
import Room from './components/Room.vue'

const routes = [
    {path: "/", component: Login},
    {path: "/play", component: Room } 
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')
