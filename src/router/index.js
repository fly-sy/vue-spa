import Vue from 'vue'
import Router from 'vue-router'

// import Reports from '../views/home/reports/index'
const Reports = () => import(/* webpackChunkName: "reports" */ '../views/home/reports')

// import Orders from '../views/home/orders/index'
const Orders = () => import(/* webpackChunkName: "orders" */ '../views/home/orders')

// import Categories from '../views/home/goods/categories'
const Categories = () => import(/* webpackChunkName: "categories-params-list-add" */ '../views/home/goods/categories')

// import Params from '../views/home/goods/params'
const Params = () => import(/* webpackChunkName: "categories-params-list-add" */ '../views/home/goods/params')

// import List from '../views/home/goods/list'
const List = () => import(/* webpackChunkName: "categories-params-list-add" */ '../views/home/goods/list')

// import Add from '../views/home/goods/add'
const Add = () => import(/* webpackChunkName: "categories-params-list-add" */ '../views/home/goods/add')

// import Rights from '../views/home/power/rights'
const Rights = () => import(/* webpackChunkName: "right-roles" */ '../views/home/power/rights')

// import Roles from '../views/home/power/roles'
const Roles = () => import(/* webpackChunkName: "right-roles" */ '../views/home/power/roles')

// import Users from '../views/home/users/index'
const Users = () => import(/* webpackChunkName: "users" */ '../views/home/users/index')

// import WelCome from '../views/home/welcome'
const WelCome = () => import(/* webpackChunkName: "login-home-welcome" */ '../views/home/welcome')

// import Home from '../views/home'
const Home = () => import(/* webpackChunkName: "login-home-welcome" */ '../views/home')

// import Login from '../views/login'
const Login = () => import(/* webpackChunkName: "login-home-welcome" */ '../views/login')

// 2. 注册路由中间件
Vue.use(Router)

// 4. 实例化路由对象
const router = new Router({
  // 5. 定义路由规则
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        {
          path: '/welcome',
          component: WelCome
        },
        {
          path: '/users',
          component: Users
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/categories',
          component: Categories
        },
        {
          path: '/params',
          component: Params
        },
        {
          path: '/goods',
          component: List
        },
        {
          path: '/goods/add',
          component: Add
        },
        {
          path: '/orders',
          component: Orders
        },
        {
          path: '/reports',
          component: Reports
        }

      ]
    }
    // {
    //   path: '/',
    //   name: 'home',
    //   component: Home
    // },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ]
})

// 路由全局守卫
router.beforeEach((to, from, next) => {
  /**
   * 1. 登录不拦截
   * 2. 非登录颜值 token 页面拦截
   *  2.1  有token 放行  next
   *  2.2  没有token 强制跳转到 登录
   */

  if (to.path === '/login') return next()
  const token = sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

export default router
