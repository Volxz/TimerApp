import io from 'socket.io-client';

let socketFunctions = {
    methods: {
        setWebsocket: function () {
            let socket = io(":3000");
            socket.on('timers', (data) => {
                this.$store.commit('setTimers', data);
                console.log("Timer Set");
            });
            socket.on('timer-update', (data)=> {
                this.$store.commit('updateTimer', data)
            });
            socket.on('timer-remove', (id) => {
                this.$store.commit('deleteTimer', id)
            });
            socket.on('time-sync', (serverTime) => {
                this.$store.commit('setOffset', new Date().getTime() - serverTime);
            });
            this.$store.commit('setWebsocket', socket);
            console.log("Websocket Set")
        },
        createTimer: function (timerObj) {
            this.getWebsocket.emit('create-timer', timerObj)
        },
        deleteTimer: function (id) {
            this.getWebsocket.emit('delete-timer', id)
        },
        zeroTimer: function (id) {
            this.getWebsocket.emit('zero-timer', id)
        },
        resetTimer: function (id) {
            this.getWebsocket.emit('reset-timer', id)
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
};
export default socketFunctions;
