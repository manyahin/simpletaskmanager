import Vue from 'vue'
import App from './App.vue'
import router from './router'

import axios from 'axios'
import Notifications from 'vue-notification'

Vue.use(Notifications)

Vue.config.productionTip = false

axios.defaults.baseURL = `http://${window.location.hostname}:3000/api/`

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
