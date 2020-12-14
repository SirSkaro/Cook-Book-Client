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
    name: 'Recipes',
    component: () => import('../views/Recipes.vue')
  },
  {
    path: '/recipe/:id',
    name: 'RecipeDetails',
    component: () => import('../views/RecipeDetails.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
