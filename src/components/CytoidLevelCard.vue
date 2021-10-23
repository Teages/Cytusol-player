<template>
  <div>
    <p v-if="err" v-text="'Failed'" style="opacity: 0.3" />
    <div class="cytoid-level-card" v-else-if="leveldata">
      <div
        class="background"
        :style="'background-image: url(' + getBlobUrl(leveldata.background) + ')'"
      />
      <div class="background-dim" />
      <div class="index">
        <div class="top-content">
          <div />
          <div class="difficulty-box" v-if="leveldata">
            <ctd-diff
              v-for="diff in leveldata.chartList"
              :key="diff.type"
              :type="diff.type"
              :name="diff.title"
              :diff="diff.difficulty"
            />
          </div>
        </div>
        <div class="info-box">
          <p class="artist" v-text="leveldata.metadata.artist" />
          <h1 class="title" v-text="leveldata.metadata.title" />
          <div class="owner-box" v-if="leveldata.metadata.charter">
            <div class="owner">
              <span v-text="leveldata.metadata.charter" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <p v-else v-text="'Loading'" style="height: 10rem" />
  </div>
</template>

<script>
import CtdDiff from "./CtdDiff.vue";
export default {
  name: "CytoidLevelCard",

  components: { CtdDiff },

  props: {
    leveldata: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      io: null,
      err: null,
    };
  },
  methods: {
    loadcard() {
      let data;
      this.leveldata = data;
    },
    getBlobUrl(blob) {
      // console.log(blob)
      return URL.createObjectURL(blob)
    }
  },
};
</script>

<style>
.cytoid-level-card {
  margin: 1rem 0.5rem;
  border-radius: 0.5rem;
  position: relative;
}

.cytoid-level-card .background, .cytoid-level-card .link, .cytoid-level-card .background-dim {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 0.5rem;
  /* z-index: -1; */
}

.cytoid-level-card .background-dim {
  opacity: 0.75;
  background: #333;
  /* z-index: -2; */
}

.cytoid-level-card .background {
  opacity: 1;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}


.cytoid-level-card .index {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100% - 1rem);
  padding: 0.5rem 0.75rem;
  position: relative;
}

.cytoid-level-card .index .top-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cytoid-level-card .index .featured {
  background: linear-gradient(to right bottom, #b91d73, #f953c6);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.3rem;
  max-height: 2.3rem;
  color: #fff;
  font-weight: bold;
  border-radius: 2.3rem;
  padding: 0 1rem;
}

.cytoid-level-card .index .difficulty-box {
  text-align: end;
}

.cytoid-level-card .index .info-box {
  color: #fff;
  margin: 0.5rem 0.2rem;
}

.cytoid-level-card .index .info-box h1, .cytoid-level-card .index .info-box h2, .cytoid-level-card .index .info-box h3, .cytoid-level-card .index .info-box h4, .cytoid-level-card .index .info-box h5, .cytoid-level-card .index .info-box p {
  margin: 0.1rem 0;
}

.cytoid-level-card .index .info-box .artist {
  font-size: 1rem;
}

.cytoid-level-card .index .info-box .title {
  font-size: 1.5rem;
}

.cytoid-level-card .index .info-box .owner-box {
  min-height: 32px;
}

.cytoid-level-card .index .info-box .owner-box .owner {
  position: absolute;
  display: inline-block;
  box-sizing: border-box;
  height: 32px;
  margin: 2px 0;
  color: inherit;
  white-space: nowrap;
  background-color: rgba(51, 51, 51, 0.7);
  border-radius: 16px;
  user-select: none;
  will-change: box-shadow;
}

.cytoid-level-card .index .info-box .owner-box .owner img {
  position: relative;
  display: inline-block;
  width: 32px;
  height: 32px;
  margin-right: -4px;
  overflow: hidden;
  color: #fff;
  font-size: 18px;
  line-height: 32px;
  text-align: center;
  vertical-align: middle;
  background-color: #333;
  border-radius: 50%;
}

.cytoid-level-card .index .info-box .owner-box .owner span {
  display: inline-block;
  height: 32px;
  padding: 0 12px;
  font-size: 14px;
  line-height: 32px;
  vertical-align: middle;
  font-weight: 500;
}

.cytoid-level-card .index .info-box .owner-box .owner a {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
</style>
