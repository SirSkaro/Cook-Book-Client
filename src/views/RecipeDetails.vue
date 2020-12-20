<template>
  <b-container>
    <LoadingScreen :show="hasPendingCall">
      <h1>Recipe Details</h1>
      <RecipeForm :recipe="recipe"/>
    </LoadingScreen>
  </b-container>
</template>

<script>
import RecipeForm from '../components/recipe/RecipeForm'
import LoadingScreen from '../components/common/loading-screen'
import RecipesService from '../services/RecipesService.js'

export default {
  name: 'RecipeDetails',
  components: {
    RecipeForm, LoadingScreen
  },
  data() {
    return {
      hasPendingCall: false,
      recipe: {}
    }
  },
  created() {
    this.togglePendingCall()
    this.fetchRecipe()
      .finally(this.togglePendingCall)
  },
  methods: {
    togglePendingCall() {
      this.hasPendingCall = !this.hasPendingCall;
    },
    fetchRecipe() {
      let recipeId = this.$route.params.id;
      return RecipesService.getById(recipeId)
        .then(recipe => {this.recipe = recipe})
    }
  }

}
</script>