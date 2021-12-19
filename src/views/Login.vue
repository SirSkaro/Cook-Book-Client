<template>
  <b-container class="mt-5">
    <LoadingScreen :show="false" ref="loadingScreen">
      <b-row class="justify-content-md-center">
        <b-col md="4">
          <b-card header="Log in" bg-variant="light" border-variant="dark">
            <b-form>
              <b-form-group label="Username" label-for="username">
                <b-form-input id="username" autofocus v-model="$v.loginForm.username.$model" aria-describedby="titleFeedback" :state="validateState('username')"></b-form-input>
                <b-form-invalid-feedback id="usernameFeedback">Username is required</b-form-invalid-feedback>
              </b-form-group>
              <b-form-group label="Password" label-for="password">
                <b-form-input type="password" id="password" v-model="$v.loginForm.password.$model" aria-describedby="passwordFeedback" :state="validateState('password')"></b-form-input>
                <b-form-invalid-feedback id="passwordFeedback">Password is required</b-form-invalid-feedback>
              </b-form-group>
              <b-button class="mb-4" type="submit" variant="primary" @click="submitLogin()">Log in</b-button>
            </b-form>
            <b-card-text>New account registration is disallowed. Contact an administrator if you need an account.</b-card-text>
          </b-card>
        </b-col>
      </b-row>
    </LoadingScreen>
  </b-container>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import LoadingScreen from '../components/common/loading-screen'
import UserService from '../services/UserService'

export default {
  name: 'Login',
  mixins: [validationMixin],
  components: {
    LoadingScreen
  },
  data() {
    return {
      loginForm: {
        username: null,
        password: null
      }
    }
  },
  validations: {
    loginForm: {
      username: { required },
      password: { required }
    }
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.loginForm[name]
      return $dirty && $error ? false : null;
    },
    submitLogin() {
      this.togglePendingCall()
      return UserService.login(this.$v.loginForm.username.$model, this.$v.loginForm.password.$model)
        .then(() => this.showSuccessBanner('Successfully logged in'))
        .then(() => new Promise((resolve) => setTimeout(resolve, 1000)))
        .then(() => this.$router.push({name: 'CookBook'}))
        .catch(() => this.showErrorBanner('Username or password incorrect'))
        .finally(this.togglePendingCall)
    },
    showErrorBanner(message) {
      this.$refs.loadingScreen.showError(message)
    },
    showSuccessBanner(message) {
      this.$refs.loadingScreen.showSuccess(message)
    },
    togglePendingCall() {
      this.hasPendingCall = !this.hasPendingCall;
    }
  }
}
</script>

<style scoped>

</style>