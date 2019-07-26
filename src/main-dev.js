import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 引入字体图标
import './assets/fonts/iconfont.css'
// 引入初始样式
import './assets/css/base.less'

// 引入element-ui
import './plugins/element.js'
import 'nprogress/nprogress.css'

// 引入axios请求
import './api'

import TreeTable from 'vue-table-with-tree-grid'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import moment from 'moment'

Vue.filter('dateFormat', function (originVal) {
  // const dt = new Date(originVal)

  // const y = dt.getFullYear()
  // const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  // const d = (dt.getDate() + '').padStart(2, '0')

  // const hh = (dt.getHours() + '').padStart(2, '0')
  // const mm = (dt.getMinutes() + '').padStart(2, '0')
  // const ss = (dt.getSeconds() + '').padStart(2, '0')

  // return `${y}-${m}-${d} ${hh}:${mm}:${ss}`

  return moment(originVal).format('YYYY-MM-DD hh:mm:ss')
})

Vue.use(VueQuillEditor)

Vue.component('tree-table', TreeTable)

Vue.config.productionTip = false

new Vue({
  // 6. 挂载路由
  router,
  render: h => h(App)
}).$mount('#app')
