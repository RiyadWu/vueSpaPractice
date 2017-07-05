/**
 * Created by qiangxl on 2017/7/5.
 */

import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex);

// 先写个假数据
const state = {
    totalTime: 0,
    list: [],
    baidu: 'https://www.baidu.com',
    username: 'AC',
    isAdmin: true,
    dataPool: {},
}

export default new Vuex.Store({
    state,
    mutations,
    actions
})
