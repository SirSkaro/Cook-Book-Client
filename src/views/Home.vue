<template>
  <div>
    <b-jumbotron header="Jena's Recipes" lead="The Coffey (one-stop) shop for Jena's collection of home-cooked meals and treats">
      <p>Use the cards below order the navigation bar above to get started</p>
      <b-card-group deck>
        <b-card>
          <template #header><h4 class="mb-0">Cookbook</h4></template>
          <b-card-text>View, create, and change your recipes. Search through your recipes quickly and easily by name, ingredients, and custom categories.</b-card-text>
          <b-button href="#/cookbook" variant="primary">Go to Recipies</b-button>
        </b-card>
        <b-card>
          <template #header><h4 class="mb-0">Tags</h4></template>
          <b-card-text>Create custom tags to categorize your recipes with for easy lookups. Mark recipes as "dinner", "dessert", "big crowd", and more.</b-card-text>
          <b-button href="#/tags" variant="primary">Go to Tag Managment</b-button>
        </b-card>
      </b-card-group>
    </b-jumbotron>
  </div>
</template>

<script>
export default {
  name: 'Home',
  props: {
    
  }
}
</script>
