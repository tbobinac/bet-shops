import './assets/scss/common/index.scss'

import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueGeolocation from 'vue-browser-geolocation'
import './filters/filters'

Vue.use(VueAxios, axios);
Vue.use(VueGeolocation);

export const bus = new Vue();

new Vue({
  el: '#app',
  render: h => h(App)
})
