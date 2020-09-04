import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //Microsoft Authentication Library Instance is stored here.
    websocket: null,
    timers: [],
    

  },
  mutations: {

    setWebsocket(state, val) {state.websocket = val},
    setTimers(state, val) {state.timers = val},

  },
  getters: {
    getWebsocket: state => {return state.websocket},
    getTimers: state => {return state.timers},
  },
})
