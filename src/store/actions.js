/**
 * Created by qiangxl on 2017/7/5.
 */

import * as types from './mutation-types'

export default {
    addTotalTime({ commit }, time) {
        commit(types.ADD_TOTAL_TIME, time)
    },
    decTotalTime({ commit }, time) {
        commit(types.DEC_TOTAL_TIME, time)
    },
    savePlan({ commit }, plan) {
        commit(types.SAVE_PLAN, plan);
    },
    deletePlan({ commit }, plan) {
        commit(types.DELETE_PLAN, plan)
    },
    prepareDataPool({ commit }, data) {
        commit(types.PREPARE_DATA_POOL, data)
    }

};
