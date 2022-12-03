<template>
  <b-card :title="recipe.label" class="h-100">
    <b-card-text>{{recipe.shortDescription}}</b-card-text>
    <template #footer>
      <b-button size="lg" variant="secondary" @click="viewRecipeDetails()" @click.middle="viewRecipeDetailsInNewTab()"><b-icon-eye/></b-button>
      <b-button size="lg" variant="info" v-if="canUpdate" @click="gotoEditRecipe()"><b-icon-pencil/></b-button>
    </template>
  </b-card>
</template>

<script>
import { BIconEye, BIconPencil } from 'bootstrap-vue'
import RecipesService from '../../services/RecipesService.js'
import PermissionService from '../../services/PermissionService.js'
import RecipeDetails from '../../views/RecipeDetails.vue'

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
      this.$router.push(this.recipeRouteConfig)
    },
    viewRecipeDetailsInNewTab() {
      let routeData = this.$router.resolve(this.recipeRouteConfig)
      window.open(routeData.href, '_blank')
    },
    gotoEditRecipe() {
      let routeConfig = this.recipeRouteConfig 
      routeConfig.params.editMode = true
      this.$router.push(routeConfig)
    }
  },
  computed: {
    canUpdate: function() {
      return PermissionService.canUpdate(this.recipe)
    },
    recipeRouteConfig: function() {
      return { 
        name: RecipeDetails.name, 
        params: {id: RecipesService.getId(this.recipe)}
      }
    }
  }
};
</script>
