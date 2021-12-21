<template>
  <b-container class="mt-5">
    <LoadingScreen :show="hasPendingCall" ref="loadingScreen">
      <h1>{{recipe.label}}</h1>
      <b-row>
        <b-col md="3">
          <b-button @click="goToCookbook()" size="lg" variant="outline-secondary"><b-icon-backspace/> Back to Recipes</b-button>
        </b-col>
        <b-col md="3" offset-md="6">
          <b-button-group>
            <b-button size="lg" v-if="!isEditMode" variant="secondary" @click="downloadExport()"><b-icon-printer /></b-button>
            <b-button size="lg" v-if="permissions.update && !isEditMode" variant="info" @click="startEdit()"><b-icon-pencil /></b-button>
            <b-button size="lg" v-if="isEditMode" variant="secondary" @click="cancelEdit()"><b-icon-eye /></b-button>
            <b-button size="lg" variant="danger" v-if="permissions.delete" @click="showDeleteModal()">
              <b-icon-trash />
              <b-modal :id="deleteModalId"
                title="Delete Recipe" ok-variant="danger" ok-title="Yes, delete"
                @ok="deleteRecipe">
                <p>You are about to delete the recipe <b>{{recipe.label}}</b>.</p>
                <p>Are you sure you want to remove this recipe?</p>
              </b-modal>
            </b-button>
          </b-button-group>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col md="12">
          <b-card bg-variant="light">
            <IngredientList :is-edit-mode="isEditMode" 
              v-bind:ingredients="ingredients"
              :handle-single-save="saveIngredient"
              :handle-multi-save="saveIngredients"
              :handle-delete="deleteIngredient"/>
          </b-card>
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
            <h3>Tags</h3>
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
import PermissionService from '../services/PermissionService.js'
import TagForm from '../components/tag/TagForm'
import { BIconCloudUpload, BIconBackspace, BIconPencil,
  BIconSlashCircle, BIconEye, BIconTrash, BIconPrinter } from 'bootstrap-vue'
const deleteModalId = 'delete-recipe-modal'

export default {
  name: 'RecipeDetails',
  components: {
    RecipeForm, TagForm, LoadingScreen,
    IngredientList,
    BIconCloudUpload, BIconBackspace, BIconPencil, 
    BIconSlashCircle, BIconEye, BIconTrash, BIconPrinter
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
      isEditMode: false,
      deleteModalId,
      permissions: {
        update: false,
        delete: false
      }
    }
  },
  methods: {
    togglePendingCall() {
      this.hasPendingCall = !this.hasPendingCall;
    },
    showErrorBanner(message) {
      this.$refs.loadingScreen.showError(message)
    },
    showSuccessBanner(message) {
      this.$refs.loadingScreen.showSuccess(message)
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
        .catch(() => this.showErrorBanner('Unable to fetch all recipe info'))
    },
    fetchRecipe() {
      let recipeId = this.$route.params.id;
      return RecipesService.getById(recipeId)
        .then(recipe => {
          this.recipe = recipe
          this.permissions.update = PermissionService.canUpdate(recipe)
          this.permissions.delete = PermissionService.canDelete(recipe)
        })
    },
    fetchIngredients() {
      return RecipesService.getIngredients(this.recipe)
        .then(ingredients => {
          this.ingredients = ingredients
          this.ingredients.sort((ingredient1, ingredient2 ) => ingredient1.sortOrder - ingredient2.sortOrder)
        })
    },
    fetchTags() {
      return RecipesService.getTags(this.recipe)
        .then(tags => {this.tags = tags})
    },
    saveRecipe() {
      this.togglePendingCall()
      return RecipesService.save(this.recipe)
        .then(recipe => this.recipe = recipe)
        .then(() => this.showSuccessBanner('Recipe saved'))
        .catch(() => this.showErrorBanner('Unable to save recipe'))
        .finally(this.togglePendingCall)
    },
    saveIngredient(ingredient) {
      return this.saveIngredients([ingredient])
    },
    saveIngredients(ingredients) {
      let savePromises = ingredients.map(ingredient => IngredientsService.save(ingredient, this.recipe))
      this.togglePendingCall()
      return Promise.all(savePromises)
        .then(() => this.showSuccessBanner('Ingredients saved'))
        .catch(() => this.showErrorBanner('Unable to save ingredients'))
        .then(this.fetchData)
        .finally(this.togglePendingCall)
    },
    deleteIngredient(ingredient) {
      this.togglePendingCall()
      return IngredientsService.delete(ingredient)
        .then(() => this.showSuccessBanner('Ingredient deleted'))
        .catch(() => this.showErrorBanner('Unable to delete ingredient'))
        .then(this.fetchData)
        .finally(this.togglePendingCall)
    },
    addTag(tag) {
      this.togglePendingCall()
      return RecipesService.addTag(this.recipe, tag)
        .then(() => this.showSuccessBanner('Tag added'))
        .catch(() => this.showErrorBanner('Unable to add tag'))
        .then(this.fetchData)
        .finally(this.togglePendingCall)
    },
    deleteTag(tag) {
      this.togglePendingCall()
      return RecipesService.deleteTag(this.recipe, tag)
        .then(() => this.showSuccessBanner('Tag removed'))
        .catch(() => this.showErrorBanner('Unable to remove tag'))
        .then(this.fetchData)
        .finally(this.togglePendingCall)
    },
    showDeleteModal() {
      this.$bvModal.show(deleteModalId);
    },
    deleteRecipe() {
      this.togglePendingCall()
      return RecipesService.delete(this.recipe)
        .then(this.goToCookbook)
        .catch(() => this.showErrorBanner('Unable to delete recipe'))
        .finally(this.togglePendingCall)
    },
    goToCookbook() {
      this.$router.push({name: 'CookBook'})
    },
    downloadExport() {
      this.togglePendingCall()
      return RecipesService.getExport(this.recipe)
        .then(recipeExport => fetch("data:application/pdf;base64," + recipeExport.exportFile))
        .then(file => file.blob())
        .then(fileBlob =>  {
          let fileUrl = URL.createObjectURL(fileBlob)
          window.open(fileUrl)
        }).then(() => this.showSuccessBanner('Recipe downloaded'))
        .catch(() => this.showErrorBanner('Unable to download recipe'))
        .finally(this.togglePendingCall)
    }
  }

}
</script>