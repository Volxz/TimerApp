import io from 'socket.io-client';

let socketFunctions = {
    methods: {
        setWebsocket: function () {
            this.$store.commit('setWebsocket', io('https://75ad872d9dcd.ngrok.io/'))
            console.log("Websocket Set")
        },
        setTimers: function () {
            this.getWebsocket.on('timers', (data) => {
                this.$store.commit('setTimers', data)
                console.log("Timer Set")
            })


        },
        createTimer: function (name) {
            this.getWebsocket.emit('reset-timer', name)
        },
        deleteTimer: function (name) {
            this.getWebsocket.emit('delete-timer', name)
        },
        zeroTimer: function (name) {
            this.getWebsocket.emit('zero-timer', name)
        },
        resetTimer: function (name) {
            this.getWebsocket.emit('reset-timer', name)
        },

    },
    computed: {
        getWebsocket() {
            return this.$store.getters.getWebsocket;
        },
        getTimers() {
            return this.$store.getters.getTimers;
        }
    }
}
export default socketFunctions;
