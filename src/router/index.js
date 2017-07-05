import Vue from 'vue'
import Router from 'vue-router'

import Content from '../components/Content.vue'
import Content1 from '../components/Content1.vue'

Vue.use(Router)
const routes = [
  {
    path : '/content',
    component : Content
  },
  {
    path : '/content1',
    component : Content1,
    // children : [
    //   {
    //     path : 'log-time',
    //     // 懒加载
    //     component : resolve => require(['../components/LogTime.vue'], resolve),
    //   }
    // ]
  },
]

export default new Router({
  routes: routes
})
