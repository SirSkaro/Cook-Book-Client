<template>
  <b-container>
    <h1>Recipies</h1>
    <LoadingScreen :show="hasPendingCall">
      <b-row>
        <b-col md="3" offset-md="9"> 
          <b-button size="lg" variant="primary"><b-icon-plus-square></b-icon-plus-square> Add Recipe</b-button>
        </b-col>
      </b-row>
      <b-row>
        <RecipeCard v-for="recipe in recipes" v-bind:key="recipe._links.self.href"/>
      </b-row>
      <b-row>
        <b-col md="12">
          <b-pagination align="center"
            v-model="pageConfig.currentPage"
            :total-rows="pageConfig.totalItems"
            :per-page="pageConfig.itemsPerPage"
            @input="loadRecipes"
          ></b-pagination>
        </b-col>
      </b-row>
    </LoadingScreen>
  </b-container>
</template>

<script>
import RecipesService from "../services/RecipesService.js"
import RecipeCard from "../components/recipe/RecipeCard"
import LoadingScreen from '../components/common/loading-screen'
import { BIconPlusSquare } from 'bootstrap-vue'

export default {
  name: "Recipes",
  data() {
    return {
      recipes: [],
      pageConfig: {
        currentPage: 1,
        itemsPerPage: 0,
        totalItems: 0
      },
      hasPendingCall: false
    };
  },
  components: {
    LoadingScreen, BIconPlusSquare, RecipeCard
  },
  created() {
    this.togglePendingCall()
    this.loadRecipes()
      .finally(this.togglePendingCall)
  },
  methods: {
    loadRecipes: function() {
      return RecipesService.getPage(0)
        .then(recipePage => {
            this.recipes = recipePage._embedded.recipes;
            this.pageConfig.currentPage = recipePage.page.number + 1;
            this.pageConfig.itemsPerPage = recipePage.page.size;
            this.pageConfig.totalItems = recipePage.page.totalElements;
        })
    },
    togglePendingCall() {
      this.hasPendingCall = !this.hasPendingCall;
    }
  }
}
</script>

<style scoped>
</style>
