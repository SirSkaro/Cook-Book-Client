<template>
  <b-modal :id="modalId" title="Login"
    :ref="modalId"
    no-close-on-backdrop
    :hide-header-close="hasPendingCall"
    :ok-disabled="!canSubmit || hasPendingCall"
    :busy="hasPendingCall"
    @ok="submitLogin"
    @show="resetForm"
    ok-title="Login">
    <LoadingScreen :show="hasPendingCall" ref="loadingScreen">
        <b-card bg-variant="light" border-variant="dark">
          <b-form>
            <b-form-group label="Username" label-for="username">
              <b-form-input id="username" autofocus v-model="$v.loginForm.username.$model" aria-describedby="titleFeedback" :state="validateState('username')"></b-form-input>
              <b-form-invalid-feedback id="usernameFeedback">Username is required</b-form-invalid-feedback>
            </b-form-group>
            <b-form-group label="Password" label-for="password">
              <b-form-input type="password" id="password" v-model="$v.loginForm.password.$model" aria-describedby="passwordFeedback" :state="validateState('password')"></b-form-input>
              <b-form-invalid-feedback id="passwordFeedback">Password is required</b-form-invalid-feedback>
            </b-form-group>
          </b-form>
          <b-card-text>New account registration is disallowed. Contact an administrator if you need an account.</b-card-text>
        </b-card>
    </LoadingScreen>
  </b-modal>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import LoadingScreen from '../common/loading-screen'
import UserService from '../../services/UserService'
const modalId = 'login-form-modal'

export default {
  name: 'LoginForm',
  modalId: modalId,
  mixins: [validationMixin],
  props: {
    onLogin: { type: Function, required: false }
  },
  components: {
    LoadingScreen
  },
  data() {
    return {
      loginForm: {
        username: null,
        password: null
      },
      modalId,
      hasPendingCall: false
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
    submitLogin(modalEvent) {
      modalEvent.preventDefault()
      this.togglePendingCall()
      return UserService.login(this.$v.loginForm.username.$model, this.$v.loginForm.password.$model)
        .then(() => this.showSuccessBanner('Successfully logged in'))
        .then(() => new Promise((resolve) => setTimeout(resolve, 1000)))
        .then(() => this.onLogin())
        .then(() => this.$refs[this.modalId].hide())
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
    },
    resetForm() {
      this.loginForm.username = null
      this.loginForm.password = null
      this.$v.loginForm.$reset()
    }
  },
  computed: {
    canSubmit: function() {
      return this.$v.loginForm.$dirty ? !this.$v.loginForm.$anyError : false
    }
  }
}
</script>

<style scoped>

</style>