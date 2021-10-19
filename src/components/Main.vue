<template>
  <v-container fill-height>
    <v-card class="mx-auto" max-width="100vw" width="500">
      <v-card-title class="text-h6 font-weight-regular justify-space-between">
        <span>{{ currentTitle }}</span>
        <v-avatar
          color="primary lighten-2"
          class="subheading white--text"
          size="24"
          v-text="step"
        ></v-avatar>
      </v-card-title>

      <v-window v-model="step">
        <v-window-item :value="0">
          <v-card-text>
            <v-select
              v-model="way"
              :items="ways"
              item-text="state"
              item-value="abbr"
              label="上传方式"
            ></v-select>

            <div v-if="way === 1" @load="getCdnChart()">
              <div v-if="cdnCharts.length < 1" class="pa-4 text-center">
                <p>正在读取数据库...</p>
              </div>
              <v-list two-line>
                <v-list-item-group
                  v-model="cdnSelected"
                  active-class="blue--text"
                >
                  <v-list-item v-for="item in cdnCharts" :key="item.id">
                    <template>
                      <v-list-item-content>
                        <v-list-item-title v-text="item.title"></v-list-item-title>

                        <v-list-item-subtitle
                          class="text--primary"
                          v-text="item.headline"
                        ></v-list-item-subtitle>

                        <v-list-item-subtitle v-text="item.subtitle"></v-list-item-subtitle>
                      </v-list-item-content>
                    </template>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </div>

            <div v-else-if="way === 2">
              <v-file-input
                show-size
               />
            </div>
          </v-card-text>
        </v-window-item>

        <v-window-item :value="1">
          <v-card-text v-if="chartData">
            <h4>您的谱面</h4>
            <CytoidLevelCard :leveldata="chartData" />
            <h4>选择难度</h4>
            <v-list>
              <v-list-item-group
                v-model="chartSelect"
                active-class="blue--text"
              >
                <v-list-item v-for="chart in chartData.chartList" :key="chart.type">
                  <ctd-diff
                    :type="chart.type"
                    :name="chart.title"
                    :diff="chart.difficulty"
                  />
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card-text>
          <div v-else class="pa-4 text-center">
            <p>正在加载谱面信息...</p>
          </div>
        </v-window-item>

        <v-window-item :value="2">
          <div class="pa-4 text-center" v-if="chartData">
              <p v-text="chartData.chartList[Object.keys(chartData.chartList)[chartSelect]].type"></p>
            <span class="">若一切准备妥当, 就开始播放吧</span>
          </div>
        </v-window-item>
      </v-window>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn :disabled="step === 0" text @click="step--"> Back </v-btn>
        <v-spacer></v-spacer>
        <v-btn v-if="step != 2" :disabled='!canNextStep()' color="primary" depressed @click="nextStep">
          Next
        </v-btn>
        <CytoidPlayer v-else-if="canPlay()" :leveldata="chartData" :chartType="chartData.chartList[Object.keys(chartData.chartList)[chartSelect]].type"></CytoidPlayer>
        <v-btn v-else disabled>
          Chart is not Ready
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import Axios from "axios";
import CtdDiff from "./CtdDiff.vue";
import CytoidPlayer from "./CytoidPlayer.vue";
import CytoidLevelCard from "./CytoidLevelCard.vue";
export default {
  name: "Main",

  components: {
    CytoidPlayer, CytoidLevelCard, CtdDiff
  },

  data: () => ({
    step: 0,
    way: 0,
    ways: [
      {state: '演示谱面', abbr: 0},
      {state: '从库中选择', abbr: 1},
      {state: '上传 .cytoidlevel 文件', abbr: 2},
    ],
    steps: [
      '选择谱面',
      '确认谱面',
      '准备就绪'
    ],
    cdnURL: "https://worker.teages.xyz/cdn/cytoidlevels/",
    cdnSelected: 0,
    cdnCharts: [],
    chartData: null,
    chartSelect: 0
  }),

  computed: {
    currentTitle() {
      return this.steps[this.step]
    },
  },

  methods: {
    getCdnChart() {
      console.log("Downloading from CDN...")
      Axios.get(this.cdnURL + 'levels.json')
        .then(response => {
          console.log(response.data)
          this.cdnCharts = (response.data.level || [])
        })
    },
    canNextStep() {
      switch(this.step) {
        case 0:
          switch(this.way) {
            case 0:
              return true;
            case 1:
              return (this.cdnCharts[this.cdnSelected] ? true : false);
            case 2:
              return false;
          }
          break;
        case 1:
          return (this.chartData != null ? true : false);
        case 2:
          return false;
      }
    },
    nextStep() {
      switch(this.step) {
        case 0:
          this.chartData = null
          this.initChart()
          break;
        case 1:
          break;
        case 2:
          break;
      }
      this.step++
    },
    canPlay() {
      switch(this.way) {
        case 0:
          return (this.chartData != null ? true : false);
        case 1:
          return (this.chartData != null ? true : false);
        case 2:
          return (this.chartData != null ? true : false);
      }
    },
    loadChart(url) {
      (async ()=>{
        let levelJsonUrl = url + '/level.json'
        let levelJson = {}
        await Axios.get(levelJsonUrl)
          .then(response => {levelJson = response.data})
          .catch(() => {levelJson = null})
        if (levelJson != null) {
          let metadata = {
            title: (levelJson.title || ''),
            artist: (levelJson.artist || ''),
            charter: (levelJson.charter || ''),
          }

          let backgroundURL = url + '/' + levelJson.background.path
          let background
          await Axios({url:backgroundURL, responseType:'blob', method: 'get'})
            .then(response => (background = response.data))

          let chartList = {}
          for (let chart of levelJson.charts) {
            let type = chart.type
            chartList[type] = {
              type,
              difficulty: chart.difficulty,
              title: chart.name || type,
              chart: (await (async ()=>{
                let chartURL = url + '/' + chart.path
                let chartJson
                await Axios.get(chartURL)
                  .then(response => {chartJson = response.data})
                return chartJson
              })()),
              audio: (await (async ()=>{
                let audioURL = url + '/' + (chart['music_override'] ? chart['music_override'].path : levelJson.music.path)
                let audio
                await Axios({url:audioURL, responseType:'blob', method: 'get'})
                  .then(response => {audio = response.data})
                return audio
              })()),
            }
          }
          this.chartData = {metadata, background, chartList}
          console.log(this.chartData)
        }
      })()
      
    },
    initChart() {
      (async () => {
        if (this.way === 0) {
          let defaultChartUrl = '/chart/teages.yunomi.yumeiroparedo'
          this.loadChart(defaultChartUrl)
          return
        } else if (this.way === 1) {
          let url = this.cdnURL + this.cdnCharts[this.cdnSelected].id
          this.loadChart(url)
          return
        } else if (this.way === 2) {
          console.log(2)
        }
      })()
    }
  },

  mounted() {
    this.getCdnChart()
  }
};
</script>