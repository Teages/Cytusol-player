import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

import 'typeface-roboto/index.css'
import '@mdi/font/css/materialdesignicons.min.css'

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi'
  }
});
