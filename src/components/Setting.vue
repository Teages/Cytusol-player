<template>
  <div>
    <v-dialog v-model="dialog" scrollable style="height: 500px; width: 50px;" max-width="500px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon class="ml-2" v-bind="attrs" v-on="on">
          <v-icon>mdi-cog</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>{{ $t("setting.title") }}</v-card-title>
        <v-divider></v-divider>
        <v-card-text>

          <v-card-title>{{ $t("setting.playingTitle") }}</v-card-title>
          <v-slider
            v-model="setting.deviceOffset"
            max="1"
            min="-1"
            step="0.010"
            :label="$t('setting.offset')"
            @change="saveSetting()"
          >
            <template v-slot:append>
              <v-text-field
                v-model="setting.deviceOffset"
                class="mt-0 pt-0"
                type="number"
                style="width: 60px"
                max="1"
                min="-1"
                step="0.01"
                @change="saveSetting()"
              ></v-text-field>
            </template>
          </v-slider>
          <v-slider
            v-model="setting.playSpeed"
            max="2"
            min="0.25"
            step="0.25"
            tick-size="0"
            thumb-label
            ticks="always"
            :label="$t('setting.playspeed')"
            @change="saveSetting()"
          >
          </v-slider>
          <v-dialog
            max-width="600" scrollable
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn block color="primary" v-bind="attrs" v-on="on">{{ $t("setting.editColor") }}</v-btn>
            </template>
            <template v-slot:default="dialog">
              <v-card>
                <v-toolbar
                  color="primary"
                  dark
                >{{ $t("setting.editColor") }}</v-toolbar>
                <v-card-text>
                  <v-btn block color="error" class="mt-3" @click="setDefaultColor()">{{ $t("setting.resetColor") }}</v-btn>
                  <div
                    v-for="(regs, key) in setting.colorReg"
                    v-bind:key="key"
                  >
                    <v-card-title>{{ key }}</v-card-title>
                    <div
                      v-for="(reg, subkey) in regs"
                      v-bind:key="subkey"
                      :style="`filter: hue-rotate(${reg}deg);`"
                    >
                      <v-slider
                        v-model="regs[subkey]"
                        max="360"
                        min="0"
                        step="1"
                        tick-size="0"
                        ticks="always"
                        :color="noteColor[key][subkey]"
                        :label="subkey"
                        @change="saveSetting()"
                      >
                        <template v-slot:prepend>
                          <v-icon
                            :color="noteColor[key][subkey]"
                          >
                            mdi-checkbox-blank-circle
                          </v-icon>
                        </template>
                        <template v-slot:append>
                          <v-text-field
                            v-model="regs[subkey]"
                            class="mt-0 pt-0"
                            type="number"
                            style="width: 60px"
                            max="360"
                            min="0"
                            step="1"
                            @change="saveSetting()"
                          ></v-text-field>
                        </template>
                      </v-slider>
                    </div>
                  </div>


                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn color="darken-1 primary" rounded text @click="dialog.value = false">
                    {{ $t("close") }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>


          <v-card-title>{{ $t('setting.luncherTitle') }}</v-card-title>
          <v-autocomplete
            disabled
            :label="$t('setting.cdnUrl')"
            :items="['https://worker.teages.xyz/cdn/cytoidlevels/']"
            v-model="setting.cdnUrl"
            @change="saveSetting()"
          ></v-autocomplete>

          <v-btn block color="error" @click="setDefaultSetting()">{{ $t('setting.reset') }}</v-btn>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <Info />
          <v-spacer />
          <v-btn color="darken-1 primary" rounded text @click="dialog = false">
            {{ $t("close") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Info from "./Info.vue";
export default {
  name: "Setting",
  components: {
    Info
  },
  data: function () {
    return {
      dialog: false,
      setting: {},
      defaultSetting: {
        deviceOffset: 0,
        playSpeed: 1,
        cdnUrl: "https://worker.teages.xyz/cdn/cytoidlevels/",
        colorReg: {
          click: {
            up: 0,
            down: 0
          },
          hold: {
            up: 30,
            down: 330
          },
          flick: {
            up: 0,
            down: 0
          }
        }
      },
      noteColor: {
        click: {
          up: '#78C2EE',
          down: '#EE7E78'
        },
        hold: {
          up: '#78C2EE',
          down: '#EE7E78'
        },
        flick: {
          up: '#78C2EE',
          down: '#EE7E78'
        }
      }
    };
  },
  methods: {
    saveSetting() {
      localStorage.setting = JSON.stringify(this.setting)
    },
    setDefaultSetting() {
      localStorage.setting = JSON.stringify(this.defaultSetting)
      this.setting = JSON.parse(localStorage.setting)
    },
    setDefaultColor() {
      this.setting.colorReg = JSON.parse(JSON.stringify(this.defaultSetting.colorReg))
      this.saveSetting()
    }
  },
  beforeMount() {
    if (localStorage.setting) {
      this.setting = Object.assign({}, this.defaultSetting, JSON.parse(localStorage.setting))
    } else {
      this.setDefaultSetting()
    }
  },
  mounted() {
    // window.addEventListener('storage', (event) => {
    //   // if (event.key && event.key == 'setting') {
    //   //   this.setting.deviceOffset = event.newValue.deviceOffset || 0
    //   // }
    //     console.log(event)
    // })
  },
};
</script>
