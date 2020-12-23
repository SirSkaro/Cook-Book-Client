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
      <b-row class="mt-3">
        <b-col md="12">
          <b-card bg-variant="light">
            <TagForm :is-edit-mode="isEditMode" 
              :selected-tags="tags"
              :handle-select-tag="addTag"
              :handle-remove-tag="deleteTag"/>
          </b-card>
        </b-col>
      </b-row>
      <b-row class="mt-5"/>
    </LoadingScreen>
  </b-container>
</template>

<script>
import RecipeForm from '../components/recipe/RecipeForm'
import LoadingScreen from '../components/common/loading-screen'
import RecipesService from '../services/RecipesService.js'
import IngredientsService from '../services/IngredientsService.js'
import IngredientList from '../components/ingredient/IngredientList'
import TagForm from '../components/tag/TagForm'
import { BIconCloudUpload, BIconBackspace, BIconPencil, BIconSlashCircle, BIconEye } from 'bootstrap-vue'

export default {
  name: 'RecipeDetails',
  components: {
    RecipeForm, TagForm, LoadingScreen,
    IngredientList,
    BIconCloudUpload, BIconBackspace, BIconPencil, BIconSlashCircle, BIconEye
  },
  props: {
    editMode: { type: Boolean, default: false}
  },
  created() {
    this.isEditMode = this.editMode
    this.togglePendingCall()
    this.fetchData()
      .finally(this.togglePendingCall)
  },
  data() {
    return {
      hasPendingCall: false,
      recipe: {},
      ingredients: [],
      tags: [],
      isEditMode: false
    }
  },
  methods: {
    togglePendingCall() {
      this.hasPendingCall = !this.hasPendingCall;
    },
    startEdit() {
      this.isEditMode = true;
    },
    cancelEdit() {
      this.togglePendingCall()
      this.fetchData()
        .then(() => {this.isEditMode = false})
        .finally(this.togglePendingCall)
    },
    fetchData() {
      return this.fetchRecipe()
        .then(this.fetchIngredients)
        .then(this.fetchTags)
    },
    fetchRecipe() {
      let recipeId = this.$route.params.id;
      return RecipesService.getById(recipeId)
        .then(recipe => {this.recipe = recipe})
    },
    fetchIngredients() {
      return RecipesService.getIngredients(this.recipe)
        .then(ingredients => {this.ingredients = ingredients})
    },
    fetchTags() {
      return RecipesService.getTags(this.recipe)
        .then(tags => {this.tags = tags})
    },
    saveRecipe() {
      this.togglePendingCall()
      return RecipesService.save(this.recipe)
        .then(recipe => this.recipe = recipe)
        .finally(this.togglePendingCall)
    },
    saveIngredient(ingredient) {
      this.togglePendingCall()
      return IngredientsService.save(ingredient, this.recipe)
        .then(this.fetchData)
        .finally(this.togglePendingCall)
    },
    deleteIngredient(ingredient) {
      this.togglePendingCall()
      return IngredientsService.delete(ingredient)
        .then(this.fetchData)
        .finally(this.togglePendingCall)
    },
    addTag(tag) {
      this.togglePendingCall()
      return RecipesService.addTag(this.recipe, tag)
        .then(this.fetchData)
        .finally(this.togglePendingCall)
    },
    deleteTag(tag) {
      this.togglePendingCall()
      return RecipesService.deleteTag(this.recipe, tag)
        .then(this.fetchData)
        .finally(this.togglePendingCall)
    }
  }

}
</script>