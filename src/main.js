import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible/index.js'

Vue.config.productionTip = false
import {Button,Overlay,Popup,Icon,Toast  } from 'vant';
import axios from 'axios'
Vue.prototype.$axios = axios  
import Vconsole from 'vconsole'

Vue.use(Button);
Vue.use(Overlay);
Vue.use(Popup);
Vue.use(Icon);
Vue.use(Toast);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
