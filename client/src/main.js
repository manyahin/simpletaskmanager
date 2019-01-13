import Vue from 'vue'
import App from './App.vue'
import router from './router'

import axios from 'axios'
import Notifications from 'vue-notification'
import PrettyCheckbox from 'pretty-checkbox-vue'

Vue.use(Notifications)
Vue.use(PrettyCheckbox)

Vue.config.productionTip = false

axios.defaults.baseURL = `http://${window.location.hostname}:3010/api/`

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
