<template>
  <v-app
    style="user-select: none"
    @dragenter="dropping = true && log"
    @dragleave="dropping = false"
  >
    <Drop/>
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-sheet
        class="pa-4"
      >
      <div style="display: flex;"> 
        <v-avatar size="32" class="mx-1">
          <img src="/favicon.ico" alt="Cytusol Player" />
        </v-avatar>
        <v-toolbar-title v-text="'Player'" class="mx-3"/>
      </div>
      </v-sheet>

      <v-divider></v-divider>

      <v-list>
        <v-list-item
          draggable="false"
        >
          <v-list-item-icon>
            <v-icon>mdi-information</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{version}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          link
          href="https://github.com/Teages/Cytusol-player" target="_blank"
          draggable="false"
        >
          <v-list-item-icon>
            <v-icon>mdi-github</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>View on GitHub</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          link
          href="https://cytoid.io" target="_blank"
          draggable="false"
        >
          <v-list-item-icon>
            <v-icon>mdi-open-in-new</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Cytoid.io</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

    </v-navigation-drawer>
    <v-app-bar
      app
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"/>
      <div 
        v-show="!drawer"
        style="display: contents;"
      >
        <v-avatar size="32" class="mx-2">
          <img src="/favicon.ico" alt="Cytusol Player" />
        </v-avatar>
        <v-toolbar-title v-text="'Player'" class="mx-2"/>
        <v-badge :content="version" v-if="!$vuetify.breakpoint.xs"></v-badge>
      </div>
    <v-spacer/>
    <Language />
    <Setting />
    </v-app-bar>
    <v-main>
      <Main/>
    </v-main>
  </v-app>
</template>

<script>
import Main from './components/Main';
import Setting from './components/Setting.vue';
import Language from './components/Language.vue';
import Drop from './components/Drop.vue';

export default {
  name: 'App',

  components: {
    Main,
    Setting,
    Language,
    Drop
  },

  data: () => ({
    version: "v 1.1.0",
    drawer: false,
    dropping: false,
  }),
  methods: {
    
    log(data) {
      console.log(data)
    }
  },
  mounted() {
    window.matchMedia('(prefers-color-scheme: light)').addEventListener("change", ()=>{
      this.$vuetify.theme.dark = window.matchMedia('(prefers-color-scheme: dark)').matches
    })
    this.$vuetify.theme.dark = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
};
</script>

<style>
html { overflow-y: auto } 
</style>