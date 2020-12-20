<template>
  <b-card :title="recipe.label" class="h-100">
    <b-card-text>{{recipe.shortDescription}}</b-card-text>
    <template #footer>
      <b-button variant="info" @click="viewRecipeDetails()"><b-icon-eye></b-icon-eye></b-button>
    </template>
  </b-card>
</template>

<script>
import { BIconEye } from 'bootstrap-vue'
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
    BIconEye
  },
  methods: {
    viewRecipeDetails: function() {
      let routeConfig = { 
        name: 'RecipeDetails', 
        params: {id: RecipesService.getId(this.recipe)}
      }
      this.$router.push(routeConfig)
    }
  }
};
</script>
