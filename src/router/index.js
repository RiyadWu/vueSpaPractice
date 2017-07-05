import Vue from 'vue'
import Router from 'vue-router'

import Home from '../components/Home.vue'
import TimeEntries from '../components/TimeEntries.vue'

Vue.use(Router)
const routes = [{
  path : '/',
  component : Home
},{
  path : '/home',
  component : Home
},{
  path : '/time-entries',
  component : TimeEntries,
  children : [{
    path : 'log-time',
    // 懒加载
    component : resolve => require(['../components/LogTime.vue'], resolve),
  }]
}]

export default new Router({
  routes: routes
})
