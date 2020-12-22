import Vue from 'vue'
import vueDebounce from 'vue-debounce'

Vue.use(vueDebounce, {
  lock: true
})