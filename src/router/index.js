import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Map from '../components/Map'
import vueJsonp from 'vue-jsonp'
import BaiduMap from 'vue-baidu-map'
import Home from '../components/Home'

Vue.use(BaiduMap, {
  /* 申请的百度密钥，可以在百度地图官网申请 */
  ak: 'brdBS22T3Ic5zeAqnqHXGisSWhQNU91P'
})
Vue.use(vueJsonp)
Vue.use(VueRouter)


const routes = [
  { path:'/',redirect: '/Login'},
  { path: '/Login',component: Login},
  {path: '/Map',component: Map},
  {path: '/home',component: Home}
]


const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
  //to 要访问的路径
  //from 从哪个路径跳转而来
  //next() 放行到一个路径
  if (to.path==='/Login') return next()
  //获取token
  const tokenStr=  sessionStorage.getItem('token')
  if (!tokenStr) return next('/Login')
  //放行
  next()
})


export default router
