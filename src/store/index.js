import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    websocket: null,
    edit: true,
    timers: [],
    

  },
  mutations: {

    setWebsocket(state, val) {state.websocket = val},
    setTimers(state, val) {state.timers = val},
    setEdit(state, val) {state.edit = val},


  },
  getters: {
    getWebsocket: state => {return state.websocket},
    getTimers: state => {return state.timers},
    getEdit: state => {return state.edit},
  },
})
