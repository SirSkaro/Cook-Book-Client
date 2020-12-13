import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/tags',
    name: 'Tags',
    component: () => import('../views/ManageRecipeTags.vue')
  },
  {
    path: '/recipes',
    name: 'Recipies',
    component: () => import('../views/Recipes.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
