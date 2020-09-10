import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        websocket: null,
        edit: false,
        timers: [],
        offset: 0,
    },
    mutations: {

        setWebsocket(state, val) {
            state.websocket = val
        },

        deleteTimer(state, val) {
            state.timers = state.timers.filter((obj) => {
                return obj.id !== val;
            })
        },

        updateTimer(state, val) {
            let timerIndex = state.timers.findIndex((obj => obj.id === val.id));
            if(timerIndex >= 0){
                state.timers[timerIndex] = val;
            } else {
                state.timers.push(val);
            }
        },

        setTimers(state, val) {
            state.timers = val
        },

        setOffset(state, val) {
            state.offset = val
        },

        setEdit(state, val) {
            state.edit = val
        },


    },
    getters: {
        getWebsocket: state => {
            return state.websocket
        },
        getTimers: state => {
            return state.timers
        },
        getEdit: state => {
            return state.edit
        },
        getOffset: state => {
            return state.offset
        },
    },
})
