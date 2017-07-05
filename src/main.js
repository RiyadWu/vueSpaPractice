import Vue from 'vue'
import VueRouter from  'vue-router'
import VueResource from 'vue-resource'


import App from './App.vue'
import store from './store'
import router from './router'
import 'bootstrap/dist/css/bootstrap.css'

Vue.use(VueRouter)
Vue.use(VueResource)

var app = new Vue({
  el: '#app',
  router,
  store,
  ...App,
});
