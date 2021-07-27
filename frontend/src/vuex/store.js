import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
    isUser: false,

    // 로그인 관련 - 두호
    token: localStorage.getItem('token') || '',
    loginState: false,

    searchGet: [],
    searchLive: {},

    scrapList: [],
    scrapMode: false,
}

export default new Vuex.Store({
    state,
    mutations,
    getters,
    actions
})