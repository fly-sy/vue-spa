import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/base.less'

import './plugins/element.js'

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
