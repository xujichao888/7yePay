import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '七夜-纯净健康的社交互动平台'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
