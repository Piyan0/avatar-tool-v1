import './assets/main.css'
import Vue3TouchEvents from "vue3-touch-events";

import { createApp } from 'vue'
import App from './App.vue'

const app= createApp(App)
  .use(Vue3TouchEvents, {
    swipeTolerance: 10
  })
  .mount('#app')
  
