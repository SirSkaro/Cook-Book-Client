<template>
  <b-container>
    <h1>Cookbook</h1>
    <LoadingScreen :show="hasPendingCall" ref="loadingScreen">
      <b-row class="mt-3" v-if="permissions.create">
        <b-col md="3" offset-md="9"> 
          <b-button size="lg" variant="primary" @click="openNewRecipeForm()"><b-icon-plus-square/> Add Recipe</b-button>
          <NewRecipeForm :handleSubmit="createRecipe"/>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col md="12">
          <b-card bg-variant="light"> 
            <RecipeFilterForm 
              v-bind:search-criteria.sync="searchCriteria"
              :on-enter="syncSearchCriteriaToQueryParams"/>
            <hr />
            <b-col align-self="center">
              <b-button-group>
                <b-button size="lg" variant="outline-primary" @click="syncSearchCriteriaToQueryParams()"><b-icon-search/> Search for recipes</b-button>
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
            @input="syncSearchCriteriaToQueryParams">
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
import PermissionService from '../services/PermissionService'

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
      },
      permissions: {
        create: false
      }
    }
  },
  components: {
    LoadingScreen, 
    BIconPlusSquare, BIconSearch, BIconXCircle,
    RecipeCard, NewRecipeForm, RecipeFilterForm
  },
  created() {
    this.syncQueryParamsToSearchCriteria()
    this.loadRecipes()
  },
  methods: {
    syncQueryParamsToSearchCriteria() {
      this.searchCriteria.ingredients = this.$route.query.ingredients?.split(',') || []
      this.searchCriteria.title = this.$route.query.title || null
      this.searchCriteria.serveCount = this.$route.query.serveCount || null
      this.pageConfig.currentPage = this.$route.query.page || 1

      this.searchCriteria.tags = this.$route.query.tags?.split(',') || []
      this.searchCriteria.tags = this.searchCriteria.tags.map(tagLabel => {return {label: tagLabel}})
    },
    syncSearchCriteriaToQueryParams() {
      function formatList(list) {
        return list.length 
          ? list.join(',')
          : undefined;
      }

      let queryParams = {}
      queryParams.ingredients = formatList(this.searchCriteria.ingredients)
      queryParams.tags = formatList(this.searchCriteria.tags.map(tag => tag.label))
      queryParams.title = this.searchCriteria.title || undefined
      queryParams.serveCount = this.searchCriteria.serveCount || undefined
      queryParams.page = this.pageConfig.currentPage

      let routeConfig = {
        path: this.$route.path,
        query: queryParams
      }

      return this.$router.push(routeConfig)
    },
    loadRecipes() {
      let page = this.pageConfig.currentPage - 1
      this.togglePendingCall()
      return RecipesService.searchPage(page, this.searchCriteria)
        .then(recipePage => {
            this.recipes = recipePage._embedded.recipes;
            this.pageConfig.currentPage = recipePage.page.number + 1
            this.pageConfig.itemsPerPage = recipePage.page.size
            this.pageConfig.totalItems = recipePage.page.totalElements
            this.permissions.create = PermissionService.canCreate(recipePage)
        }).catch(() => this.showErrorBanner('Unable to load recipes'))
        .finally(this.togglePendingCall)
    },
    clearSearch() {
      this.searchCriteria.tags = []
      this.searchCriteria.ingredients = []
      this.searchCriteria.title = null
      this.searchCriteria.serveCount = null
      return this.syncSearchCriteriaToQueryParams()
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
  },
  watch: {
    $route() {
      this.syncQueryParamsToSearchCriteria()
      this.loadRecipes()
    }
  }
}
</script>

<style scoped>
.uniform-card {
  height: 425px;
}
</style>
