<template>
  <div>
    <v-row>
      <v-col
              cols="12"
             sm="4"
             xs="4" v-for="timer in formattedTimers" :key="timer.id">

        <v-card :class="{jiggle : editmode}" max-width="200" class="mx-auto" outlined>
          <v-list-item three-line>
            <v-list-item-content>
              <div class="headline mb-8 text-center">{{ timer.name }}</div>
              <v-list-item-title class="headline mb-4 text-center">{{ parseTime(timer.timeLeft) }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-card-actions>
            <div v-if="!editmode">
              <v-btn @click="zeroTimer(timer.id)" left>Zero</v-btn>
              <v-btn color="primary" @click="resetTimer(timer.id)" right absolute>Reset</v-btn>
            </div>
            <div v-else>
              <v-btn color="primary" @click="deleteTimer(timer.id)" left>Delete</v-btn>
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

.jiggle {
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
  data: () => {
    return {
      now: new Date().getTime(),
    }
  },
  created() {
    let _this = this;
    setInterval(function () {
      _this.now = (new Date().getTime()) - _this.getOffset;
    }, 1000);
    console.log("Timers" + this.getTimers)
  },
  computed: {
    getOffset() {
      return this.$store.getters.getOffset;
    },
    editmode() {
      return this.$store.getters.getEdit;
    },
    formattedTimers() {
      if(typeof (this.getTimers) !== "object"){
        console.log("typeof is not object.");
        return [];
      }
      let timers = [];
      this.getTimers.forEach( e => {
        let hasExpirey = e.hasOwnProperty("expires_at");
        if(!hasExpirey)
          console.log("Timer " + e.name + " has no expires property. " + JSON.stringify(e));
        timers.push({
          id: e.id,
          name: e.name,
          timeLeft: hasExpirey ? (e.expires_at - this.now) / 1000 : 0,
        })
      });
      return timers;
    }
  },
  methods: {
    //Time in seconds
    parseTime(time) {
      if (time <= 0) {
        return "00:00"
      }
      let Seconds = 0;
      let Minutes = 0;
      let Hours = 0;
      let HRTime = "";
      Hours = Math.trunc(time / 3600);
      Minutes = Math.trunc((time - (Hours * 3600)) / 60);
      Seconds = Math.trunc(time - ((Minutes * 60) + (Hours * 3600)));
      if (Hours > 0) {
        HRTime = HRTime + Hours + ":"
      }
      HRTime += Minutes < 10 ? "0" + Minutes + ":" : Minutes + ":";
      HRTime += Seconds < 10 ? "0" + Seconds : Seconds;
      return HRTime;
    }
  }

};
</script>
