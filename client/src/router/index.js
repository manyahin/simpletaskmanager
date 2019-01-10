import Vue from 'vue'
import Router from 'vue-router'

import Tasks from '../Tasks.vue'
import Task from '../Task.vue'

Vue.use(Router)

const routes = [
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
      console.log('completed!')
    }
  },
  { path: '*', redirect: '/' }
]

export default new Router({
  routes
})
