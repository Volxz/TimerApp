<template>
  <v-app>
    <v-app-bar app color="primary" dark>

      <v-spacer></v-spacer>

      <v-btn v-if="!getEditmode" @click="dialog = true" :text="true">
        <v-icon >mdi-plus-box-outline</v-icon>
      </v-btn>
      <v-btn @click="setEdit(!getEditmode)" :text="true">
        <v-icon >mdi-grease-pencil</v-icon>
      </v-btn>
      <v-dialog v-model="dialog" persistent max-width="600px">
        <template v-slot:activator="{ on, attrs }">
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">Create New Timer</span>
          </v-card-title>
          <v-card-text>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="name" label="Timer Name" hint="Must Be Unique"></v-text-field>
            </v-col>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="cancelCreation()">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="createNewTimer()">Create</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app-bar>

    <v-content>
      <router-view/>
    </v-content>
    <v-footer class="font-weight-medium" fixed>
      <v-col class="text-center" cols="12">
        {{ new Date().getFullYear() }} |
        <strong>
          Timer -
          <a href="https://exclnetworks.com" target="_blank">ExclNetworks</a>
        </strong>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
import socketFunctions from './mixins/socketFunctions'

export default {
  name: "App",
  mixins: [socketFunctions],

  data: () => {
    return {
      dialog: false,
      name: null,
    };
  },
  mounted() {
    this.setWebsocket();
    this.setTimers();
  },
  computed: {
    getEditmode() {
      return this.$store.getters.getEdit;
    },
  },
  methods:{
    cancelCreation: function(){
      this.name = null;
      this.dialog = false;
    },
    setEdit: function(data){
      this.$store.commit('setEdit', data)
    },
    createNewTimer: function(){
      console.log("name:" + name)
      if(this.name === "" || !this.name){
        this.dialog = false;
        this.name = "";
      }else{
        this.createTimer(this.name);
        this.setEdit(true)
        this.dialog = false;
        this.name = "";
      }

    }
  }
};
</script>
