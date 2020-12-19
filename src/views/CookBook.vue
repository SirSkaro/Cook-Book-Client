<template>
  <b-container>
    <h1>My Cookbook</h1>
    <LoadingScreen :show="hasPendingCall">
      <b-row>
        <b-col md="3" offset-md="9"> 
          <b-button size="lg" variant="primary" @click="openNewRecipeForm()"><b-icon-plus-square></b-icon-plus-square> Add Recipe</b-button>
          <NewRecipeForm :handleSubmit="createRecipe"/>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col style="height: 325px" class="mb-2" md="3" v-for="recipe in recipes" v-bind:key="recipe._links.self.href">
          <RecipeCard class="h-100" :recipe="recipe"/>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col md="12" v-if="pageConfig.totalItems">
          <b-pagination align="center"
            v-model="pageConfig.currentPage"
            :total-rows="pageConfig.totalItems"
            :per-page="pageConfig.itemsPerPage"
            @input="loadRecipes"
          ></b-pagination>
        </b-col>
        <b-col md="12" v-else>
          <h3>
            You don't have any recipes yet! <br /> 
            Click the Add Recipe button in the corner and let's get cooking.
          </h3>
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
import NewRecipeForm from '../components/recipe/NewRecipeForm'

export default {
  name: "CookBook",
  data() {
    return {
      recipes: [],
      pageConfig: {
        currentPage: 1,
        itemsPerPage: 0,
        totalItems: 0
      },
      hasPendingCall: false,
      newRecipeForm: {
        label: null,
        shortDescritpion: null
      }
    };
  },
  components: {
    LoadingScreen, BIconPlusSquare, 
    RecipeCard, NewRecipeForm
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
    },
    openNewRecipeForm() {
      this.$bvModal.show(NewRecipeForm.modalId);
    },
    createRecipe(recipe) {
      this.togglePendingCall()
      return RecipesService.save(recipe)
        .then(this.loadRecipes)
        .finally(this.togglePendingCall)
    }
  }
}
</script>

<style scoped>
</style>
