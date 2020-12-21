<template>
  <b-container>
    <LoadingScreen :show="hasPendingCall">
      <h1>Recipe Details</h1>
      <b-row>
        <b-col md="3">
          <b-button href="#/cookbook" size="lg" variant="outline-secondary"><b-icon-backspace/> Back to Cookbook</b-button>
        </b-col>
        <b-col md="1" offset-md="8"> 
          <b-button v-if="!isEditMode" variant="info" @click="startEdit()"><b-icon-pencil /></b-button>
          <b-button v-if="isEditMode" variant="secondary" @click="cancelEdit()"><b-icon-eye /></b-button>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col md="12">
          <b-card bg-variant="light"> 
            <RecipeForm :recipe="recipe" :is-edit-mode="isEditMode"/>
            <b-col md="5" offset-md="7">
              <b-button v-if="isEditMode" size="lg" variant="primary" @click="saveRecipe()"><b-icon-cloud-upload/> Save</b-button>
              <b-button v-if="isEditMode" size="lg" variant="danger" @click="cancelEdit()"><b-icon-slash-circle/> Discard Changes</b-button>
            </b-col>
          </b-card>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col md="12">
          <b-card bg-variant="light">
            <IngredientList :is-edit-mode="isEditMode" 
              v-bind:ingredients="ingredients"
              :handle-save="saveIngredient"
              :handle-delete="deleteIngredient"/>
          </b-card>
        </b-col>
      </b-row>
    </LoadingScreen>
  </b-container>
</template>

<script>
import RecipeForm from '../components/recipe/RecipeForm'
import LoadingScreen from '../components/common/loading-screen'
import RecipesService from '../services/RecipesService.js'
import IngredientsService from '../services/IngredientsService.js'
import IngredientList from '../components/ingredient/IngredientList'
import { BIconCloudUpload, BIconBackspace, BIconPencil, BIconSlashCircle, BIconEye } from 'bootstrap-vue'

export default {
  name: 'RecipeDetails',
  components: {
    RecipeForm, LoadingScreen,
    IngredientList,
    BIconCloudUpload, BIconBackspace, BIconPencil, BIconSlashCircle, BIconEye
  },
  data() {
    return {
      hasPendingCall: false,
      recipe: {},
      ingredients: [],
      isEditMode: false
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
    startEdit() {
      this.isEditMode = !this.isEditMode;
    },
    fetchRecipe() {
      let recipeId = this.$route.params.id;
      return RecipesService.getById(recipeId)
        .then(recipe => {
          this.recipe = recipe
          return RecipesService.getIngredients(this.recipe);
        }).then(ingredients => {this.ingredients = ingredients});
    },
    cancelEdit() {
      this.togglePendingCall()
      this.fetchRecipe()
        .then(this.startEdit)
        .finally(this.togglePendingCall)
    },
    saveRecipe() {
      this.togglePendingCall()
      return RecipesService.save(this.recipe)
        .then(recipe => this.recipe = recipe)
        .then(this.startEdit)
        .finally(this.togglePendingCall)
    },
    saveIngredient(ingredient) {
      this.togglePendingCall()
      return IngredientsService.save(ingredient, this.recipe)
        .then(this.fetchRecipe)
        .finally(this.togglePendingCall)
    },
    deleteIngredient(ingredient) {
      this.togglePendingCall()
      return IngredientsService.delete(ingredient)
        .then(this.fetchRecipe)
        .finally(this.togglePendingCall)
    }
  }

}
</script>