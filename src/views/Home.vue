<template>
  <div>
    <v-row>
      <v-col cols="4"
             xl="3"
             lg="4"
             md="6"
             sm="12"
             xs="12" v-for="timer in formattedTimers" :key="timer.name">

        <v-card :color='changeColor(timer.minLeft, timer.secLeft)'  class="mx-auto" outlined >
          <v-list-item three-line>
            <v-list-item-content>
              <div class="overline mb-5">{{ timer.name }}</div>
              <v-list-item-title class="headline mb-1">


                  <v-list-item-title class="headline mb-1">{{ timer.timeLeft }}</v-list-item-title>


              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-card-actions>
            <v-btn @click="deleteTimer(timer.name)" text>Delete</v-btn>
            <v-btn @click="resetTimer(timer.name)" text>Reset</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
// @ is an alias to /src
import socketFunctions from '../mixins/socketFunctions'

export default {
  mixins: [socketFunctions],
  name: "Home",
  data: ()=>{
    return{
    now: new Date().getTime()

    }
  },
  computed: {
    getTimers() {
      return this.$store.getters.getTimers;
    },
    formattedTimers() {
      let timers = [];
      this.getTimers.forEach( e => {
        timers.push({
          name: e[0],
          timeLeft: this.timeLeft(e[1]),
          minLeft: this.minLeft(e[1]),
          secLeft: this.secLeft(e[1]),


        })
      })
      return timers;
    }

  },
  created(){
    let self = this;
    setInterval(function () {
    self.now = new Date().getTime();
  }, 1000)
  },
  methods: {
    timeLeft: function (timestamp) {
      if(timestamp < this.now){
        return "00:00"
      }
      let timeleft = timestamp - this.now;
      timeleft = timeleft/1000
      let secondsLeft = Math.trunc(timeleft) % 60;
      let minutesLeft = Math.trunc(timeleft / 60);
      if(secondsLeft >9){
        return minutesLeft + ":" + secondsLeft;
      }else{
        return minutesLeft + ":0" + secondsLeft;
      }

    },
    minLeft: function (timestamp) {
      if(timestamp < this.now){
        return 0
      }
      let timeleft = timestamp - this.now;
      timeleft = timeleft/1000
      let minutesLeft = Math.trunc(timeleft / 60);
      return minutesLeft;

    },
    secLeft: function (timestamp) {
      if(timestamp < this.now){
        return 0
      }
      let timeleft = timestamp - this.now;
      timeleft = timeleft/1000
      return Math.trunc(timeleft) % 60;

    },
    changeColor(temp, seconds) {
      let opacity;
      if(temp<=0 && seconds === 0){
        opacity = 1;
        return "rgba(40, 255, 40,"+opacity+")";
      }
      else if(temp<=4){
        opacity = (temp)/2.5;
        return "rgba(255, 173, 40,"+opacity+")";

      }
      else if(temp>4 && temp<=10){
        opacity = (temp-3)/2.5;
        return "rgba(255, 173, 40,"+opacity+")";
      }

      else if(temp>10){
        opacity = 1;
        return "rgba(255,40,40,"+opacity+")";

      }
    },

  },

};
</script>
