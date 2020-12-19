<template>
  <b-card :title="recipe.label">
    <b-card-text>{{recipe.shortDescription}}</b-card-text>
    <template #footer>
      <b-button href="#" variant="info"><b-icon-eye></b-icon-eye></b-button>
    </template>
  </b-card>
</template>

<script>
import { BIconEye } from "bootstrap-vue"

export default {
  name: "RecipeCard",
  props: {
    recipe: {
      type: Object,
      required: true
    }
  },
  components: {
    BIconEye
  }
};
</script>