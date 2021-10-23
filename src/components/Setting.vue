<template>
  <div>
    <v-dialog v-model="dialog" scrollable style="height: 400px; width: 50px;" max-width="500px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon class="ml-2" v-bind="attrs" v-on="on">
          <v-icon>mdi-cog</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>{{ $t("setting.title") }}</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 400px;">

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
            v-model="setting.playspeed"
            disabled
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

          <v-card-title>{{ $t('setting.luncherTitle') }}</v-card-title>
          <v-autocomplete
            disabled
            :label="$t('setting.cdnUrl')"
            :items="['https://worker.teages.xyz/cdn/cytoidlevels/']"
            v-model="setting.cdnUrl"
            @change="saveSetting()"
          ></v-autocomplete>

          <v-btn block color="primary" @click="setDefaultSetting()">{{ $t('setting.reset') }}</v-btn>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <Info />
          <v-spacer />
          <v-btn color="darken-1 primary" text @click="dialog = false">
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
      defaultSetting: {
        deviceOffset: 0.05,
        playspeed: 1,
        cdnUrl: "https://worker.teages.xyz/cdn/cytoidlevels/",
      },
      setting: {},
    };
  },
  methods: {
    saveSetting() {
      localStorage.setting = JSON.stringify(this.setting)
    },
    setDefaultSetting() {
      localStorage.setting = JSON.stringify(this.defaultSetting)
      this.setting = JSON.parse(localStorage.setting)
    }
  },
  beforeMount() {
    if (localStorage.setting) {
      this.setting = JSON.parse(localStorage.setting)
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
