import Axios from 'axios';
import UserService from '../services/UserService'

Axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;


let sessionToken = UserService.getSessionToken()
Axios.defaults.headers.common['Authorization'] = sessionToken 
  ? 'Bearer ' + sessionToken
  : null;