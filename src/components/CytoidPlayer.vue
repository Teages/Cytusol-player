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
        dense
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
      <v-progress-linear
        :active="loading"
        :indeterminate="loading"
        absolute
        color="primary"
      ></v-progress-linear>

      <v-toolbar
        dark
        v-show="!$vuetify.breakpoint.xs"
        v-if="!loading"
      >
        <v-btn
          class="mx-2"
          fab
          dark
          x-small
          color="primary"
          @click="onlyJump($refs['player'], Math.max(playerState.time - 5, 0))"
        >
          <v-icon dark>
            mdi-minus
          </v-icon>
        </v-btn>
        <v-btn
          v-if="false"
          :color="playerState.state ? 'orange' : 'primary'"
          rounded
          @click="switchState($refs['player'])"
        >
          <v-icon v-if="!playerState.state">mdi-play</v-icon>
          <v-icon v-else>mdi-pause</v-icon>
        </v-btn>
        <v-btn
          class="mx-2"
          fab
          dark
          x-small
          color="primary"
          @click="onlyJump($refs['player'], Math.min(playerState.time + 5, playerState.length))"
        >
          <v-icon dark>
            mdi-plus
          </v-icon>
        </v-btn>
        <div style="flex: 1 1 auto;position: relative;"
        >
          <!-- <div style="position: absolute; height: 100%; width: 100%; z-index: 10;"
            v-if="!disableMutual"
            @mousedown="disableMutual = true;log('ss')"
          ></div> -->
          <v-slider
            dense
            class="mx-5"
            hide-details
            step="0.01"
            inverse-label
            :label="`${String(Math.floor(playerState.time / 60)).padStart(2,'0')}:${String(Math.floor(playerState.time) % 60).padStart(2,'0')} / ${String(Math.floor(playerState.length / 60)).padStart(2,'0')}:${String(Math.floor(playerState.length) % 60).padStart(2,'0')}`"
            :max="playerState.length"
            v-model="toolbarTime"
            @mousedown="disableMutual = true"
            @mouseup="disableMutual = false;onlyJump($refs['player'], toolbarTime)"
          >
          </v-slider>
        </div>
        <!-- <v-btn
          v-if="flagTime < 0"
          class="mx-1"
          fab
          dark
          small
          color="orange"
            @mousedown="log('a')"
            @mouseup="log('b')"
        >
          <v-icon dark>
            mdi-map-marker-star
          </v-icon>
        </v-btn> -->
        <v-btn
          v-if="flagTime < 0"
          class="mx-1"
          fab
          dark
          small
          color="green"
          @click="flagTime = playerState.time"
        >
          <v-icon dark>
            mdi-map-marker-star-outline
          </v-icon>
        </v-btn>
        <v-btn
          v-else
          class="mx-1"
          fab
          dark
          small
          color="error"
          @click="flagTime = -1"
        >
          <v-icon dark>
            mdi-map-marker-off
          </v-icon>
        </v-btn>
        <v-btn
          :disabled="flagTime < 0 || flagTime > playerState.length"
          class="mx-1"
          fab
          dark
          small
          color="primary"
          @click="onlyJump($refs['player'], flagTime)"
        >
          <v-icon dark>
            mdi-map-marker-right
          </v-icon>
        </v-btn>
          
        <v-menu transition="slide-y-transition">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              class="ma-2"
              v-bind="attrs"
              v-on="on"
              text
              small
            >
              {{playerState.playSpeed + ' x'}}
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="n of speedList"
              :key="n"
              link
              @click="onlyJump($refs['player'], undefined, n)"
            >
              <v-list-item-title v-text="n+'x'"></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>


        <!-- <v-btn
          class="mx-2"
          icon
          dark
          small
        >
          <v-icon dark>
            mdi-information-outline
          </v-icon>
        </v-btn> -->

      </v-toolbar>
      <div v-if="display" style="height: 100vh; width: 100%; border: 0" id="player-context" ref='player-box'>
        <iframe 
          style="height: 100vh; width: 100%; border: 0"
          :class="{disableMutual: disableMutual}"
          src="https://ctdplayer.teages.xyz"
          ref='player'
          @load="sendData($refs['player'])"
        />
        <!-- <iframe 
          style="height: 100vh; width: 100%; border: 0"
          :class="{disableMutual: disableMutual}"
          :src="'http://' + '192.168.137.1' + ':8080'"
          ref='player'
          @load="sendData($refs['player'])"
        /> -->
        <v-btn
          v-if="isFullScreen"
          class="mx-2"
          absolute
          fab
          small
          dark
          left
          color="primary"
          style="top: 12px; left: 25%"
          v-show="flagTime >= 0 && flagTime <= playerState.length"
          @click="onlyJump($refs['player'], flagTime)"
        >
          <v-icon dark>
            mdi-map-marker-right
          </v-icon>
        </v-btn>

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
      loading: true,
      display: false,
      disableMutual: false,
      isFullScreen: false,
      toolbarTime: 0,
      playerState: {
        state: '',
        playSpeed: 1,
        deviceOffset: 0,
        time: 0,
        tick: 0,
        length: 1,
      },
      newTime: null,
      speedList: [0.25,0.5,0.75,1.0,1.25,1.5,1.75,2.0],
      flagTime: -1,
    }
  },
  methods: {
    sendData(dom) {
      // console.log(dom)
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
            levelName: this.leveldata.metadata.title
          },
          player: {
            deviceOffset: JSON.parse(localStorage.setting).deviceOffset || 0,
            playSpeed: JSON.parse(localStorage.setting).playSpeed || 1
          }
        }
      },'*')
    },
    sendDebug(dom) {
      dom.contentWindow.postMessage({
        type: 'd',
      }, '*')
    },
    log(m) {
      console.log(m)
    },
    switchState(dom) {
      if (this.playerState.state) {
        this.pause(dom)
      } else {
        this.continue(dom)
      }
    },
    continue(dom) {
      if (this.loading) return
      dom.contentWindow.postMessage({
        type: 'command',
        command: 'contiune'
      },'*')
    },
    pause(dom) {
      if (this.loading) return
      dom.contentWindow.postMessage({
        type: 'command',
        command: 'pause'
      },'*')
    },
    jump(dom, time = this.playerState.time, speed = this.playerState.playSpeed) {
      if (this.loading) return
      dom.contentWindow.postMessage({
        type: 'command',
        command: 'jump',
        value: {
          time: time * 1000,
          speed,
        }
      },'*')
    },
    play(dom, time = this.playerState.time, speed = this.playerState.playSpeed) {
      if (this.loading) return
      dom.contentWindow.postMessage({
        type: 'command',
        command: 'setPlayState',
        value: {
          time: time * 1000,
          speed,
        }
      },'*')
    },
    onlyJump(dom, time = this.playerState.time, speed = this.playerState.playSpeed) {
      if (this.loading) return
      dom.contentWindow.postMessage({
        type: 'command',
        command: this.playerState.state ? 'setPlayState' : 'jump',
        value: {
          time: time * 1000,
          speed,
        }
      },'*')
    },
  },
  mounted() {
    // this.log(this.$vuetify.breakpoint.xs, 'd')
    window.addEventListener('message', (event)=>{
      // console.log(event)
      if (event.data.type == 'playerState') {
        if (this.isFullScreen) return;
        this.loading = false
        this.playerState.state = event.data.value.state == 'playing' ? true : false
        this.playerState.playSpeed = event.data.value.playSpeed
        this.playerState.deviceOffset = event.data.value.deviceOffset
        this.playerState.time = event.data.value.time
        if (!this.disableMutual) {
          this.toolbarTime = event.data.value.time
        }
        this.playerState.tick = event.data.value.tick
        this.playerState.length = event.data.value.length
      }
    })
    window.onresize = ()=>{
      this.isFullScreen = (document.fullscreenElement != null)
      console.log(this.isFullScreen)
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
.disableMutual {
  pointer-events: none;
}
</style>