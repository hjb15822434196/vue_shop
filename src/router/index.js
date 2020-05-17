import Vue from 'vue'
import VueRouter from 'vue-router'
/*import Login from '../components/Login.vue'*/
import Map from '../components/Map'
import vueJsonp from 'vue-jsonp'
import BaiduMap from 'vue-baidu-map'
/*import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/user/Users'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles'
import Cate from '../components/goods/Cate'
import Params from '../components/goods/Params'
import List from  '../components/goods/List'
import Add from  '../components/goods/Add'
import Order from  '../components/order/order'
import Report from  '../components/report/report'*/
//路由懒加载：当路由被访问时才加载对应的路由文件，就是路由懒加载。
const Login = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Home')
const Welcome = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Welcome')
const Users = () => import(/* webpackChunkName:"user" */ '../components/user/Users')
const Rights = () => import(/* webpackChunkName:"power" */ '../components/power/Rights')
const Roles = () => import(/* webpackChunkName:"power" */ '../components/power/Roles')
const Cate = () => import(/* webpackChunkName:"goods" */ '../components/goods/Cate')
const Params = () => import(/* webpackChunkName:"goods" */ '../components/goods/Params')
const List = () => import(/* webpackChunkName:"goods" */ '../components/goods/List')
const Add = () => import(/* webpackChunkName:"goods" */ '../components/goods/Add')
const Order = () => import(/* webpackChunkName:"order" */ '../components/order/order')
const Report = () => import(/* webpackChunkName:"report" */ '../components/report/report')
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
  //访问home组件即重定向到welcome组件
  {path: '/Home', component: Home,
    redirect:'/welcome',
    children:[
      {path: '/welcome', component: Welcome},
      {path: '/users', component: Users},
      {path: '/rights', component: Rights},
      {path: '/roles', component: Roles},
      {path:'/categories',component:Cate},
      {path:'/params',component:Params},
      {path:'/goods',component:List},
      {path:'/goods/add',component:Add},
      {path:'/orders',component:Order},
      {path:'/reports',component:Report}
  ]
  }
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
