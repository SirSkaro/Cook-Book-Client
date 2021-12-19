<template>
  <div id="app">
    <b-navbar fixed="top" variant="primary">
      <b-navbar-brand href="#/">Jena's Recipes</b-navbar-brand>
      <b-navbar-nav>
        <b-nav-item href="#/cookbook">Cookbook</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav>
        <b-nav-item href="#/tags">Recipe Tags</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right v-if="username">
          <template slot="button-content"><b-icon-person-fill></b-icon-person-fill> Logged in as {{username}}</template>
          <b-dropdown-item href="#/tags"><template><b-icon-card-list></b-icon-card-list> Log Out</template></b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item v-else href="#/login"><b-icon-person-fill></b-icon-person-fill> Log In</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
    <router-view id="content"/>
  </div>
</template>

<script>
import { BIconCardList, BIconPersonFill } from 'bootstrap-vue'
import UserService from './services/UserService.js'

export default {
  name: 'App',
  components: {
    BIconCardList, BIconPersonFill
  },
  data() {
    return {
      username: null
    }
  },
  created: function() {
    this.username = UserService.getSessionUsername()
    //UserService.events.$on(UserService.USER_LOGIN_EVENT, (username) => this.username = username)
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
