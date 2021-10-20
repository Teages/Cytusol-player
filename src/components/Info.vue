<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" scrollable style="height: 400px; width: 50px;" max-width="500px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon>mdi-information-outline</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>{{ $t("about") }}</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 300px;">
          <blockquote><p style="color: red;">Beta build</p></blockquote>

          <p>A web tool to play Cytoid / C2V3 Chart.</p>

          <p>Share with <a href="https://www.gnu.org/licenses/gpl-3.0.html">GPL v3.0</a>.</p>
          <p>Copyright (c) Teages 2021</p>

          <br><h2>Special Thanks</h2><br>
          <p>
            <a href="https://github.com/Cytoid/Cytoid">Reference: Cytoid/Cytoid</a>
          </p>
          <p>
            <a href="https://github.com/Cytoid/Cytoid">Built-in Level(CC BY-NC-SA 3.0 with Level): 夢色パレード (w/ 桃箱 & miko) - Yunomi</a>
          </p>

          <br><h2>Copyright Notice</h2><br>
          <p>No resources from Rayark Inc. / Cytoid Official were used. </p>
          <p>And it is not Rayark Inc. / Cytoid Official.</p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="dialog = false">
            {{ $t("close") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: "Language",
  data: function () {
    return {
      dialog: false
    };
  },
  beforeMount() {
  },
};
</script>
