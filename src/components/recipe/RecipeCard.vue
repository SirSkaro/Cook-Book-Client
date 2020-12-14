<template>
  <b-card title="recipe.label">
    <b-card-text>Serves {{recipe.serveCount}}</b-card-text>
    <b-button href="#" variant="info">
      <b-icon-eye></b-icon-eye>
    </b-button>
  </b-card>
</template>

<script>
import { BIconEye } from "bootstrap-vue"

export default {
  name: "LoadingScreen",
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