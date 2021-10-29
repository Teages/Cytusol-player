<template>
  <v-overlay
    absolute class="drop-box"
    opacity="0.85"
    align="center"
    :style="dropping? null : {display: 'none', opacity: '0'}"
  >
    <v-row
      justify="center" style="height: 100vh"
      @dragleave="dropping = false"
      @dragenter="dropping = true"
      @drop="e=>{dropped(e)}"
      @dragover="e=>{e.preventDefault();}"
      class="no-child-drag"
    >
      <v-list-item-title
        style="text-align: center; width: 100vw;"
      >
        Drop to open
      </v-list-item-title>
    </v-row>
  </v-overlay>
</template>

<script>
export default {
  name:"Drop",
  data() {
    return {
      dropping: false
    }
  },
  methods: {
    log(data) {
      console.log(data)
    },
    dropped(e) {
      this.dropping = false
      e.preventDefault()
      let file = e.dataTransfer.files[0]
      window["openLevel"] = file
      window.open('/')
      console.log(file)
    }
  },
  mounted() {
    window.addEventListener("dragenter",()=>{
      this.dropping = true
    })
  }
}
</script>

<style>
.drop-box {
  display: block;
}

.no-child-drag *{
  pointer-events: none;
}
</style>