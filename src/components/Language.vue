<template>
  <v-row justify="end">
    <v-dialog v-model="dialog" scrollable max-width="300px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon class="mx-2" v-bind="attrs" v-on="on">
          <v-icon>mdi-translate</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>{{ $t("selectLanguage") }}</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 300px">
          <v-radio-group v-model="$i18n.locale" column>
            <v-radio
              v-for="(lang, i) in langs"
              :key="`Lang${i}`"
              :value="lang.value"
              :label="lang.name"
            />
          </v-radio-group>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer />
          <v-btn color="darken-1" rounded text @click="dialog = false">
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
      dialog: false,
      langs: [
        { 
          value: "en", 
          name: "English",
          support: null
        },
        { 
          value: "zhHans", 
          name: "中文(简体)",
          support: [
            'zh', 'zh-cn', 'zh-hans', 'zh-hans_cn'
          ]
        },
      ],
    };
  },
  beforeMount() {
    (()=>{
      let userLang = window.navigator.userLanguage || window.navigator.language
      for (let lang of this.langs) {
        if (lang.support != null && lang.support.length > 0) {
          // console.log(lang.support.indexOf(userLang))
          if (lang.support.indexOf(userLang.toLowerCase()) >= 0) {
            this.$i18n.locale = lang.value
            console.log(lang.value)
          }
        }
      }
    })()
  },
};
</script>
