<template>
  <v-container fill-height>
    <v-card class="mx-auto" max-width="100vw" width="500">
      <v-card-title class="text-h6 font-weight-regular justify-space-between">
        <span v-text="currentTitle()" />
        <v-spacer />
        <!-- <v-btn icon @click="()=>{$vuetify.lang.current = 'zhHans'; log($t('uploadWay'))}">
          <v-icon>mdi-translate</v-icon>
        </v-btn> -->
        <CyShare v-if="way === 2 && step === 1 && chartData != null" :levelBlob="localFile" />
      </v-card-title>

      <v-window v-model="step" touchless>
        <v-window-item :value="0">
          <v-card-text>
            <div v-if="(shareId ? true : false)">
              <v-alert
                type="info" dense justify-end
              >
                {{ $t("downloadingLevel", {progress: downloadProgress}) }}
                <!-- 正在下载谱面... ({{ downloadProgress }}%) -->
              </v-alert>
              <v-progress-linear rounded :value="downloadProgress"/>
            </div>
            <v-select
              v-model="way"
              :items="ways"
              item-text="state"
              item-value="abbr"
              :label="$t('uploadWay')"
              :disabled="(shareId ? true : false)"
            ></v-select>

            <div v-if="way === 1">
              <v-alert
                type="info" dense justify-end
                v-if="cdnCharts.length < 1"
              >
                {{ $t("loadingCDN") }}
              </v-alert>
              <v-list v-else two-line>
                <v-list-item-group
                  v-model="cdnSelected"
                  active-class="blue--text"
                >
                  <v-list-item v-for="item in cdnCharts" :key="item.id">
                    <template>
                      <v-list-item-content>
                        <v-list-item-title
                          v-text="item.title"
                        ></v-list-item-title>

                        <v-list-item-subtitle
                          class="text--primary"
                          v-text="item.headline"
                        ></v-list-item-subtitle>

                        <v-list-item-subtitle
                          v-text="item.subtitle"
                        ></v-list-item-subtitle>
                      </v-list-item-content>
                    </template>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </div>

            <div v-else-if="way === 2">
              <v-file-input
                v-model="localFile"
                show-size
                truncate-length="50"
                accept=".cytoidlevel, .zip"
              />
            </div>
          </v-card-text>
        </v-window-item>

        <v-window-item :value="1">
          <div style="height: 430px;">
            <v-card-text v-if="chartData">
              <h4>{{ $t("preview") }}</h4>
              <CytoidLevelCard :leveldata="chartData" />
              <h4>{{ $t("chooseDifficulty") }}</h4>
              <v-list>
                <v-list-item-group
                  v-model="chartSelect"
                  active-class="blue--text"
                >
                  <v-list-item
                    v-for="chart in chartData.chartList"
                    :key="chart.type"
                  >
                    <ctd-diff
                      :type="chart.type"
                      :name="chart.title"
                      :diff="chart.difficulty"
                    />
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card-text>
            <v-card-text v-else class="pa-4 text-center" style="height: 100%">
              <v-alert
                type="error" dense justify-end
                v-if="chartError"
              >
                {{ $t("chartErrMessage")[chartError] }}
              </v-alert>
              <v-alert
                type="info" dense justify-end
                v-else
              >
                {{ $t("loadingChart") }}
              </v-alert>
            </v-card-text>
          </div>
        </v-window-item>

        <v-window-item :value="2">
          <div class="pa-4 text-center" v-if="chartData">
            <!-- <p v-text="chartData.chartList[Object.keys(chartData.chartList)[chartSelect]].type"></p> -->
            <span class="">{{ $t("ready") }}</span>
          </div>
        </v-window-item>
      </v-window>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn v-if="!shareId" :disabled="step === 0" rounded plain @click="step--">
          <v-icon>mdi-arrow-left-thick</v-icon>
        </v-btn>
        <v-btn v-else :disabled="step === 0" rounded plain href="/">
          <v-icon>mdi-home</v-icon>
        </v-btn>
        <v-spacer />
        <v-btn
          v-if="step < 1"
          :disabled="!canNextStep()"
          color="primary"
          background-color="primary"
          rounded
          :loading="way === 1 && cdnCharts.length < 1"
          @click="nextStep"
        >
          <v-icon>mdi-arrow-right-thick</v-icon>
        </v-btn>
        <CytoidPlayer
          v-else-if="chartData != null && chartSelect >= 0"
          :leveldata="chartData"
          :chartType="
            chartData.chartList[Object.keys(chartData.chartList)[chartSelect]]
              .type
          "
        ></CytoidPlayer>
        <v-btn v-else disabled rounded :loading="chartData == null">
          <v-icon>mdi-play</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import Axios from "axios";
import jsZip from "jszip";

import CtdDiff from "./CtdDiff.vue";
import CytoidPlayer from "./CytoidPlayer.vue";
import CytoidLevelCard from "./CytoidLevelCard.vue";
import CyShare from "./CyShare.vue";
export default {
  name: "Main",

  components: {
    CytoidPlayer,
    CytoidLevelCard,
    CtdDiff,
    CyShare
  },

  data: function () {
    return {
      step: 0,
      way: 0,
      ways: [
        { state: "", abbr: 0 },
        { state: "", abbr: 1 },
        { state: "", abbr: 2 },
      ],
      steps: ["", "", ""],
      chartError: null,
      cdnSelected: 0,
      cdnCharts: [],
      chartData: null,
      chartSelect: 0,
      localFile: null,
      localChart: null,
      shareId: null,
      downloadProgress: 0,
    };
  },

  computed: {},

  methods: {
    log(msg) {
      console.log(msg);
    },
    getCdnChart() {
      console.log("Downloading from CDN...");
      Axios.get(JSON.parse(localStorage.setting).cdnUrl + "levels.json")
        .then((response) => {
          console.log(response);
          if (response.data) {
            this.cdnCharts = response.data.level;
          }
        })
      return true
    },
    canNextStep() {
      switch (this.step) {
        case 0:
          switch (this.way) {
            case 0:
              return true;
            case 1:
              return this.cdnCharts[this.cdnSelected] ? true : false;
            case 2:
              return this.localFile ? true : false;
          }
          break;
        case 1:
          return false;
        // return (this.chartData != null ? true : false) & (this.chartSelect >= 0);
        case 2:
          return false;
      }
    },
    nextStep() {
      this.chartError = null
      this.chartData = null;
      this.initChart();
      this.step++;
    },
    canPlay() {
      switch (this.way) {
        case 0:
          return this.chartData != null ? true : false;
        case 1:
          return this.chartData != null ? true : false;
        case 2:
          return this.chartData != null ? true : false;
      }
    },
    loadChart(url) {
      (async () => {
        let levelJsonUrl = url + "/level.json";
        let levelJson = {};
        await Axios.get(levelJsonUrl)
          .then((response) => {
            levelJson = response.data;
          })
          .catch(() => {
            levelJson = null;
          });
        if (levelJson != null) {
          let metadata = {
            title: levelJson.title || "",
            artist: levelJson.artist || "",
            charter: levelJson.charter || "",
          };

          let backgroundURL = url + "/" + levelJson.background.path;
          let background;
          await Axios({
            url: backgroundURL,
            responseType: "blob",
            method: "get",
          }).then((response) => (background = response.data));

          let chartList = {};
          for (let chart of levelJson.charts) {
            let type = chart.type;
            chartList[type] = {
              type,
              difficulty: chart.difficulty,
              title: chart.name || type,
              chart: await (async () => {
                let chartURL = url + "/" + chart.path;
                let chartJson;
                await Axios.get(chartURL).then((response) => {
                  chartJson = response.data;
                });
                return chartJson;
              })(),
              audio: await (async () => {
                let audioURL =
                  url +
                  "/" +
                  (chart["music_override"]
                    ? chart["music_override"].path
                    : levelJson.music.path);
                let audio;
                await Axios({
                  url: audioURL,
                  responseType: "blob",
                  method: "get",
                }).then((response) => {
                  audio = response.data;
                });
                return audio;
              })(),
            };
          }
          this.chartData = { metadata, background, chartList };
          console.log(this.chartData);
        }
      })();
    },
    initChart() {
      (async () => {
        if (this.way === 0) {
          let defaultChartUrl = "/chart/teages.yunomi.yumeiroparedo";
          this.loadChart(defaultChartUrl);
          return;
        } else if (this.way === 1) {
          let url = JSON.parse(localStorage.setting).cdnUrl + this.cdnCharts[this.cdnSelected].id;
          this.loadChart(url);
          return;
        } else if (this.way === 2) {
          console.log(this.localFile);
          this.loadLocalChart();
          return;
        } else if (this.way === 3) {
          console.log(this.localFile);
          this.loadLocalChart();
          return;
        }
      })();
    },
    loadLocalChart() {
      if (this.localFile == null) {
        return;
      }
      (async () => {
        let new_zip = new jsZip();
        let levelJson = null;
        await new_zip.loadAsync(this.localFile).then(async (data) => {
          console.log(data);
          try {
            await new_zip
              .file("level.json")
              .async("string")
              .then((str) => {
                levelJson = JSON.parse(str);
              });
          } catch (error) {
            console.log(error)
            this.chartError = "level"
            return;
          }
          if (levelJson != null) {
            console.log(levelJson);
            let metadata = {
              title: levelJson.title || "",
              artist: levelJson.artist || "",
              charter: levelJson.charter || "",
            };

            let backgroundURL = levelJson.background.path;
            let background;
            try {
              await new_zip
                .file(backgroundURL)
                .async("blob")
                .then((blob) => {
                  background = blob;
                });
            } catch (error) {
              console.log(error)
              this.chartError = "background"
              return;
            }
            let chartList = {};
            for (let chart of levelJson.charts) {
              let type = chart.type;
              chartList[type] = {
                type,
                difficulty: chart.difficulty,
                title: chart.name || type,
                chart: await (async () => {
                  let chartURL = chart.path;
                  let chartJson;
                  try {
                    await new_zip
                      .file(chartURL)
                      .async("string")
                      .then((str) => {
                        chartJson = JSON.parse(str);
                      });
                  } catch (error) {
                    console.log(error)
                    this.chartError = "chart"
                    return;
                  }
                  return chartJson;
                })(),
                audio: await (async () => {
                  let audioURL = chart["music_override"]
                    ? chart["music_override"].path
                    : levelJson.music.path;
                  let audio;
                  try {
                    await new_zip
                      .file(audioURL)
                      .async("blob")
                      .then((blob) => {
                        audio = blob;
                      });
                  } catch (error) {
                    console.log(error)
                    this.chartError = "audio"
                    return;
                  }
                  return audio;
                })(),
              };
            }
            this.chartData = { metadata, background, chartList };
          }
        });
      })();
    },
    loadSharedChart() {
      (async() => {
        let levelUrl = 'https://worker.teages.xyz/shareId/' + this.shareId
        console.log(levelUrl)
        // await Axios(levelUrl)
        //   .then((response)=>{console.log(response)})
        await Axios({
          url: levelUrl,
          responseType: "blob",
          method: "get",
          onDownloadProgress: (progress) => {
            this.downloadProgress = Math.round(progress.loaded / progress.total * 100)
          }
        }).then((response) => {
          console.log(response)
          if (response.data) {
            this.way = 3
            this.nextStep()
            this.localFile = response.data;
            this.loadLocalChart();
          } else (
            this.shareId = null
          )
        })
      })();
    },
    getUrlKey(name) {
      let query = window.location.search.substring(1);
      let vars = query.split("&");
      for (let i = 0;i < vars.length; i++) {
        let pair = vars[i].split("=");
        if(pair[0] == name){
          return pair[1];
        }
      }
      return null;
    },
    getHash(name) {
      if (window.location.hash) {
        let data = window.location.hash.substring(1);
        let vars = data.split("&");
        for (let i = 0;i < vars.length; i++) {
          let pair = vars[i].split("=");
          if(pair[0] == name){
            return pair[1];
          }
        }
      }
      return null;  
    },
    getToken() {
      if (window.location.hash) {
        if (!this.getHash('access_token')) return null
        localStorage.onedriveToken = JSON.stringify({
          date: Date.now(),
          expires: this.getHash('expires_in') * 1000,
          value: {
            access_token: this.getHash('access_token'),
            token_type: this.getHash('token_type'),
            scope: this.getHash('scope'),
          }
        })
        window.close()
      } else if (localStorage.onedriveToken) {
        let object = JSON.parse(localStorage.onedriveToken)
        if (object!=null && Date.now() > object.date + object.expires) {
          localStorage.onedriveToken = null
        }
      }
    },

    currentTitle() {
      return this.$t("steps")[this.step];
    },
    loadLocate() {
      for (let key in this.ways) {
        this.ways[key].state = this.$t("ways")[key];
      }
    },
  },

  mounted() {
    this.getCdnChart();
    this.loadLocate();
    if (this.getUrlKey('shareId')) {
      this.shareId = this.getUrlKey('shareId')
      this.loadSharedChart()
    }
    this.getToken()
    console.log(localStorage)
  },
  beforeUpdate() {
    this.loadLocate();
  },
};
</script>