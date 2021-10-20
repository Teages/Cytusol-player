<template>
  <v-dialog
    v-model="display"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    class="player-box-fullscreen"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="primary"
        rounded

        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-play</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-toolbar
        dark
        color="primary"
      >
        <v-btn
          icon
          dark
          @click="display = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Player</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          icon
          dark
          @click="$refs['player-box'].requestFullscreen()"
        >
          <v-icon>mdi-fullscreen</v-icon>
        </v-btn>
      </v-toolbar>
      <div v-if="display" style="height: 100vh; width: 100%; border: 0" id="player-context" ref='player-box'>
        <!-- <iframe style="height: 100vh; width: 100%; border: 0" src="https://ctdplayer.teages.xyz"></iframe> -->
        <iframe 
          style="height: 100vh; width: 100%; border: 0"
          src="https://ctdplayer.teages.xyz"
          ref='player'
          @load="sendData($refs['player'])"
        />
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: "CytoidPlayer",

  props: {
    leveldata: {
      type: Object,
      required: true,
    },
    chartType: {
      type: String,
      required: true,
    }
  },
  data () {
    return {
      display: false,
    }
  },
  methods: {
    sendData(dom) {
      console.log(dom)
      let type = this.chartType
      dom.contentWindow.postMessage({
        type: 'leveldata',
        context: {
          chart: this.leveldata.chartList[type].chart,
          audio: this.leveldata.chartList[type].audio,
          background: this.leveldata.background,
          info: {
            difficultyType: type,
            difficultyName: this.leveldata.chartList[type].title,
            difficultyLevel: this.leveldata.chartList[type].difficulty,
            levelName: this.leveldata.metadata.title,
          }
        }
      },'*')
    },
    sendDebug(dom) {
      dom.contentWindow.postMessage({
        type: 'd',
      }, '*')
    }
  }

};
</script>

<style>
.player-box { 
  overflow-y: hidden;
} 
.v-dialog.v-dialog--active.v-dialog--fullscreen::-webkit-scrollbar {
  width: 0;
}
</style>