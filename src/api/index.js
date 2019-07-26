import Vue from 'vue'
import axios from 'axios'
import Nprogress from 'nprogress'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 请求拦截 每次携带 Authorization 字段
axios.interceptors.request.use(function (config) {
  Nprogress.start()
  config.headers.common['Authorization'] = sessionStorage.getItem('token')

  return config
})

// 响应拦截
axios.interceptors.response.use(function (config) {
  Nprogress.done()

  return config
})

Vue.prototype.$http = axios
