<template>
  <b-card :title="recipe.label" class="h-100">
    <b-card-text>{{recipe.shortDescription}}</b-card-text>
    <template #footer>
      <b-button variant="secondary" @click="viewRecipeDetails()"><b-icon-eye/></b-button>
      <b-button variant="info" @click="gotoEditRecipe()"><b-icon-pencil/></b-button>
    </template>
  </b-card>
</template>

<script>
import { BIconEye, BIconPencil } from 'bootstrap-vue'
import RecipesService from '../../services/RecipesService.js'

export default {
  name: 'RecipeCard',
  props: {
    recipe: {
      type: Object,
      required: true
    }
  },
  components: {
    BIconEye, BIconPencil
  },
  methods: {
    viewRecipeDetails() {
      let routeConfig = { 
        name: 'RecipeDetails', 
        params: {id: RecipesService.getId(this.recipe)}
      }
      this.$router.push(routeConfig)
    },
    gotoEditRecipe() {
      let routeConfig = { 
        name: 'RecipeDetails', 
        params: {id: RecipesService.getId(this.recipe), editMode: true}
      }
      this.$router.push(routeConfig)
    }
  }
};
</script>
