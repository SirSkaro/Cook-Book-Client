<template>
  <b-container>
    <h1>Recipes</h1>
    <LoadingScreen :show="hasPendingCall">
      <b-row class="mt-3">
        <b-col md="12">
          <b-card bg-variant="light"> 
            <RecipeFilterForm v-bind:search-criteria.sync="searchCriteria"/>
            <hr />
            <b-col align-self="center">
              <b-button size="lg" @click="loadRecipes()"><b-icon-search/> Search for recipes</b-button>
            </b-col>
          </b-card>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col md="3" offset-md="9"> 
          <b-button size="lg" variant="primary" @click="openNewRecipeForm()"><b-icon-plus-square/> Add Recipe</b-button>
          <NewRecipeForm :handleSubmit="createRecipe"/>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col class="mb-2 uniform-card" md="3" v-for="recipe in recipes" v-bind:key="getRecipeId(recipe)">
          <RecipeCard class="h-100" :recipe="recipe"/>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col md="12" v-if="pageConfig.totalItems">
          <b-pagination align="center"
            v-model="pageConfig.currentPage"
            :total-rows="pageConfig.totalItems"
            :per-page="pageConfig.itemsPerPage"
            @input="loadRecipes">
          </b-pagination>
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
import RecipesService from '../services/RecipesService.js'
import RecipeCard from '../components/recipe/RecipeCard'
import LoadingScreen from '../components/common/loading-screen'
import { BIconPlusSquare, BIconSearch } from 'bootstrap-vue'
import NewRecipeForm from '../components/recipe/NewRecipeForm'
import RecipeFilterForm from '../components/recipe/RecipeFilterForm'

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
      },
      searchCriteria: {
        tags: [],
        ingredients: [null],
        title: null,
        serveCount: null
      }
    };
  },
  components: {
    LoadingScreen, 
    BIconPlusSquare, BIconSearch,
    RecipeCard, NewRecipeForm, RecipeFilterForm
  },
  created() {
    this.togglePendingCall()
    this.loadRecipes()
      .finally(this.togglePendingCall)
  },
  methods: {
    loadRecipes() {
      let page = this.pageConfig.currentPage - 1
      return RecipesService.searchPage(page, this.searchCriteria)
        .then(recipePage => {
            this.recipes = recipePage._embedded.recipes;
            this.pageConfig.currentPage = recipePage.page.number + 1
            this.pageConfig.itemsPerPage = recipePage.page.size
            this.pageConfig.totalItems = recipePage.page.totalElements
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
        .then(this.goToNewRecipe)
        .catch(this.togglePendingCall)
    },
    getRecipeId(recipe) {
      return RecipesService.getId(recipe);
    },
    goToNewRecipe(recipe) {
      let routeConfig = { 
        name: 'RecipeDetails', 
        params: {id: RecipesService.getId(recipe), editMode: true}
      }
      this.$router.push(routeConfig)
    }
  }
}
</script>

<style scoped>
.uniform-card {
  height: 325px;
}
</style>
