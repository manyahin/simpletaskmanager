import Vue from 'vue'
import App from './App.vue'
import Router from 'vue-router'

import Tasks from './Tasks.vue'
import Task from './Task.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      component: Tasks
    },
    {
      path: '/task/:id',
      component: Task
    },
    {
      path: '/all', 
      component: Tasks,
      beforeEnter: () => {
        console.log('all!')
      }
    },
    {
      path: '/active',
      component: Tasks,
      beforeEnter: () => {
        console.log('active!')
      }
    },
    {
      path: '/completed',
      component: Tasks,
      beforeEnter: () => {
        window.visibility = 
        console.log('completed!')
      }
    },
    { path: '*', redirect: '/' },  
  ]
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
