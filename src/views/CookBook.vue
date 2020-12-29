<template>
  <b-container>
    <h1>Cookbooks</h1>
    <LoadingScreen :show="hasPendingCall" ref="loadingScreen">
      <b-row class="mt-3">
        <b-col md="3" offset-md="9"> 
          <b-button size="lg" variant="primary" @click="openNewRecipeForm()"><b-icon-plus-square/> Add Recipe</b-button>
          <NewRecipeForm :handleSubmit="createRecipe"/>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col md="12">
          <b-card bg-variant="light"> 
            <RecipeFilterForm v-bind:search-criteria.sync="searchCriteria"/>
            <hr />
            <b-col align-self="center">
              <b-button-group>
                <b-button size="lg" variant="outline-primary" @click="loadRecipes()"><b-icon-search/> Search for recipes</b-button>
                <b-button size="lg" variant="outline-danger" @click="clearSearch()"><b-icon-x-circle/> Clear search</b-button>
              </b-button-group>
            </b-col>
          </b-card>
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
            You don't have any recipes that match your search! <br /> 
            Click the Add Recipe button in the corner to create one.
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
import { BIconPlusSquare, BIconSearch, BIconXCircle } from 'bootstrap-vue'
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
        ingredients: [],
        title: null,
        serveCount: null
      }
    };
  },
  components: {
    LoadingScreen, 
    BIconPlusSquare, BIconSearch, BIconXCircle,
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
        }).catch(() => this.showErrorBanner('Unable to load recipes'))
    },
    clearSearch() {
      this.searchCriteria.tags = []
      this.searchCriteria.ingredients = []
      this.searchCriteria.title = null
      this.searchCriteria.serveCount = null
      return this.loadRecipes()
    },
    togglePendingCall() {
      this.hasPendingCall = !this.hasPendingCall;
    },
    showErrorBanner(message) {
      this.$refs.loadingScreen.showError(message)
    },
    openNewRecipeForm() {
      this.$bvModal.show(NewRecipeForm.modalId);
    },
    createRecipe(recipe) {
      this.togglePendingCall()
      return RecipesService.save(recipe)
        .catch(() => this.showErrorBanner('Unable to create new recipe'))
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
