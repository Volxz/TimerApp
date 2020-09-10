<template>
  <div>
    <v-row>
      <v-col cols="4"
             xl="3"
             lg="4"
             md="6"
             sm="12"
             xs="12" v-for="timer in formattedTimers" :key="timer.name">

        <v-card :class="{jiggle : !editmode}" :color='changeColor(timer.minLeft, timer.secLeft)' max-width="200"  class="mx-auto" outlined >
          <v-list-item three-line>
            <v-list-item-content>
              <div class="headline mb-8 text-center">{{ timer.name }}</div>
                  <v-list-item-title class="headline mb-4 text-center">{{ timer.timeLeft }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-card-actions>
            <div v-if="editmode">
            <v-btn  @click="zeroTimer(timer.id)" left >Zero</v-btn>
            <v-btn  color="primary" @click="resetTimer(timer.id)" right absolute >Reset</v-btn>
            </div>
            <div v-else>
              <v-btn color="primary" @click="deleteTimer(timer.id)" left >Delete</v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<style>
@keyframes jiggle {
  0% {
    transform: rotate(-1deg);
  }
  50% {
    transform: rotate(1deg);
  }
}
.jiggle{
  animation: jiggle 0.2s infinite;
  -webkit-animation: jiggle 0.2s infinite;
  -moz-animation-duration: 0.2s;
  -moz-animation-name: jiggle;
  -moz-animation-iteration-count: infinite;
  -webkit-transform: rotate(-1deg);
  -moz-transform: rotate(-1deg);
}

</style>

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
        let hasExpirey = e.hasOwnProperty("expires_at");
        if(!hasExpirey)
        console.log("Timer " + e.name + " has no expires property. " + JSON.stringify(e));

        timers.push({
          id: e.id,
          name: e.name,
          timeLeft: hasExpirey ? this.timeLeft(e.expires_at) : "00:00",
          minLeft: hasExpirey ? this.minLeft(e.expires_at) : 0,
          secLeft: hasExpirey ? this.secLeft(e.expires_at) : 0,
        })
      });
      return timers;
    },
    editmode(){
      return this.$store.getters.getEdit;
    }

  },
  created(){
    let _this = this;
    setInterval(function () {
      _this.now = new Date().getTime();
  }, 1000)
  },
  methods: {
    timeLeft: function (timestamp) {
      //timestamp = timestamp + this.$store.getters.getOffset;
      if(timestamp < this.now){
        return "00:00"
      }
      let timeleft = timestamp - this.now;
      timeleft = timeleft/1000;
      let secondsLeft = Math.trunc(timeleft) % 60;
      let minutesLeft = Math.trunc(timeleft / 60);
      if(secondsLeft >9){
        return minutesLeft + ":" + secondsLeft;
      }else{
        return minutesLeft + ":0" + secondsLeft;
      }

    },
    minLeft: function (timestamp) {
      //timestamp = timestamp + this.$store.getters.getOffset;

      if(!timestamp || timestamp < this.now){
        return 0
      }
      let timeleft = timestamp - this.now;
      timeleft = timeleft/1000;
      return Math.trunc(timeleft / 60);

    },
    secLeft: function (timestamp) {
      //timestamp = timestamp + this.$store.getters.getOffset;

      if(!timestamp || timestamp < this.now){
        return 0
      }
      let timeleft = timestamp - this.now;
      timeleft = timeleft/1000;
      return Math.trunc(timeleft) % 60;

    },
    changeColor(temp, seconds) {
      let opacity;
      if(temp<=0 && seconds === 0){
        opacity = 1;
        return "rgba(40, 255, 40,"+opacity+")";
      }
      else if(temp===0){
        opacity = (temp)/2.5;
        return "rgba(255, 173, 40,"+opacity+")";

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
