<template>
  <b-container>
    <LoadingScreen :show="hasPendingCall">
      <h1>Recipe Details</h1>
      <b-row>
        <b-col md="3">
          <b-button href="#/cookbook" size="lg" variant="outline-secondary"><b-icon-backspace/> Back to Cookbook</b-button>
        </b-col>
        <b-col md="1" offset-md="8"> 
          <b-button v-if="!isEditMode" variant="info" @click="toggleEditMode()"><b-icon-pencil/></b-button>
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
    </LoadingScreen>
  </b-container>
</template>

<script>
import RecipeForm from '../components/recipe/RecipeForm'
import LoadingScreen from '../components/common/loading-screen'
import RecipesService from '../services/RecipesService.js'
import { BIconCloudUpload, BIconBackspace, BIconPencil, BIconSlashCircle } from 'bootstrap-vue'

export default {
  name: 'RecipeDetails',
  components: {
    RecipeForm, LoadingScreen,
    BIconCloudUpload, BIconBackspace, BIconPencil, BIconSlashCircle
  },
  data() {
    return {
      hasPendingCall: false,
      recipe: {},
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
    toggleEditMode() {
      this.isEditMode = !this.isEditMode;
    },
    fetchRecipe() {
      let recipeId = this.$route.params.id;
      return RecipesService.getById(recipeId)
        .then(recipe => {this.recipe = recipe})
    },
    cancelEdit() {
      this.togglePendingCall()
      this.fetchRecipe()
        .then(this.toggleEditMode)
        .finally(this.togglePendingCall)
    },
    saveRecipe() {
      this.togglePendingCall()
      return RecipesService.save(this.recipe.data)
        .then(recipe => this.recipe = recipe)
        .then(this.toggleEditMode)
        .finally(this.togglePendingCall)
    }
  }

}
</script>