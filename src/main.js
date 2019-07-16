import Vue from 'vue'
import App from './App.vue'
import router from './router'

import './assets/fonts/iconfont.css'
import './assets/css/base.less'

import './plugins/element.js'

Vue.config.productionTip = false

new Vue({
  el: '#app',
  // 6. 挂载路由
  router,
  render: h => h(App)
})
