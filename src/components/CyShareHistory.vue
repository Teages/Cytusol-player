<template>
  <v-dialog
    v-model="display"
    hide-overlay
    max-width="600"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color=""
        rounded

        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-history</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-toolbar
        dark
        dense
        color="primary"
      >
        <v-avatar size="32" class="mr-3">
          <img src="/favicon_red.ico" alt="CyPlayer" />
        </v-avatar>
        <v-toolbar-title>CyShare</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card-text class="py-3 px-3">
        <v-card-title
          v-if="history.length < 1"
        >
          {{$t('history').void}}
        </v-card-title>
        <v-card-title v-else>
          {{$t('history').title}}
        </v-card-title>
        <v-list dense>

          <v-list-item
            v-for="item of history"
            :key="item.shareId"
            link
            :href="'/?shareId=' + item.shareId"
          >
            <!-- <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon> -->
            <v-list-item-content>
              <div v-show="false">
                {{cache = ((levelCache.find(c => c.shareId === item.shareId) || {}).metadata || {})}}
              </div>
              <v-list-item-title>
                {{cache.title || ('share id: ' + item.shareId)}}
                {{cache.artist ? ' - ' + cache.artist : null}}
              </v-list-item-title>
              <v-list-item-subtitle v-if="cache.charter || cache.level">
                {{cache.charter}} {{cache.level? `(${cache.level})`:null}}
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                {{getDate(item.date)}}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

        </v-list>

      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn
          color=""
          rounded text
          @click="cleanHistory"
        >
          <v-icon>mdi-delete-outline</v-icon>
        </v-btn>
        <v-spacer />
        <v-btn rounded text @click="display = false">{{$t('close')}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: "CyShareHistory",

  props: {
    shareId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      display: false,
      history: [],
      levelCache: []
    }
  },
  methods: {
    cleanHistory() {
      this.history = []
      localStorage.history = '{"history":[]}'
    },
    getDate(time) {
      let date = new Date(time)
      return (`${String(date.getFullYear()).padStart(4,"0")}-${String(date.getMonth()).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")} `
        + `${String(date.getHours()).padStart(2,"0")}:${String(date.getMinutes()).padStart(2,"0")}:${String(date.getSeconds()).padStart(2,"0")}`)
    },
    getHistory() {
      if (!localStorage.history) {
        localStorage.history = '{"history":[]}'
      }
      this.history = JSON.parse(localStorage.history).history

      try {
        this.levelCache = JSON.parse(localStorage.levelCache).cache
      } catch {
        this.levelCache = []
      }
    }
  },
  mounted() {
    if (!localStorage.history) {
      localStorage.history = '{"history":[]}'
    }
    this.history = JSON.parse(localStorage.history).history

    if (this.shareId && this.shareId != '') {
      for (let i in this.history) {
        if (this.history[i].shareId == this.shareId) {
          this.history.splice(i,1)
          break;
        }
      }
      this.history.unshift({
        shareId: this.shareId,
        date: Date.now()
      })
      localStorage.history = JSON.stringify({
        history: this.history
      })
    }
    this.getHistory()
    window.addEventListener('storage', (event) => {
      if (event.key && ['levelCache', 'history'].indexOf(event.key)) {
        this.getHistory()
      }
    })

  }
};
</script>
