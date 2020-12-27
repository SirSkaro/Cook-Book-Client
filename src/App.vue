<template>
  <div id="app">
    <b-navbar fixed="top" variant="primary">
      <b-navbar-brand href="#/">Jena's Recipes</b-navbar-brand>
      <b-navbar-nav>
        <b-nav-item href="#/cookbook">Cook Book</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right>
          <template slot="button-content"><b-icon-gear-fill></b-icon-gear-fill> Manage</template>
          <b-dropdown-item href="#/tags"><template><b-icon-card-list></b-icon-card-list> Recipe Tags</template></b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-navbar>
    <router-view id="content"/>
  </div>
</template>

<script>
import { BIconGearFill, BIconCardList } from 'bootstrap-vue'

export default {
  name: 'App',
  components: {
    BIconGearFill, BIconCardList
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#content {
  padding-top: 55px;
}

</style>
