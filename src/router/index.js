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
    component: () => import('../views/RecipeTags.vue')
  },
  {
    path: '/cookbook',
    name: 'CookBook',
    component: () => import('../views/CookBook.vue')
  },
  {
    path: '/recipe/:id',
    name: 'RecipeDetails',
    component: () => import('../views/RecipeDetails.vue'),
    props: true
  }
]

const router = new VueRouter({
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

export default router
