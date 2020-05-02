import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//导入全局样式表
import './assets/css/global.css'
import axios from 'axios'
//配置请求的根路径
axios.defaults.baseURL='http://timemeetyou.com:8889/api/private/v1/'
//通过axios请求拦截器添加token,保证拥有获取数据的权限
axios.interceptors.request.use(config =>{
  config.headers.Authorization=window.sessionStorage.getItem('token')
  //最后必须返回config
  return config
})
//挂载原型属性，通过this调用
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
