import Vue from 'vue'
import Axios from 'axios';

const TOKEN_COOKIE = 'cookbook-session'
const USER_COOKIE = 'cookbook-username'
const LOGIN_RESOURCE = '/login'

export default {
  getSessionToken() {
    return Vue.$cookies.get(TOKEN_COOKIE)
  },
  getSessionUsername() {
    return Vue.$cookies.get(USER_COOKIE)
  },
  login(username, password) {
    return Axios.post(LOGIN_RESOURCE, {username, password})
      .then(response => {
        let session = response.data
        Vue.$cookies.set(TOKEN_COOKIE, session.token, new Date(session.expiration))
        Vue.$cookies.set(USER_COOKIE, session.username, new Date(session.expiration))
      })
  }
}

