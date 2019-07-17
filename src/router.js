import Vue from 'vue'
// 1. 引入安装好的 vue-router  
import Router from 'vue-router'

// 3. 引入定义好的 .vue 类型的组件
import Login from './views/login'
import Home from './views/home'

// 2. 注册路由中间件
Vue.use(Router)

// 4. 实例化路由对象
const router = new Router({
  // 5. 定义路由规则
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home
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

router.beforeEach((to, from, next) => {
  /**
   * 1. 登录不拦截
   * 2. 非登录颜值 token 页面拦截
   *  2.1  有token 放行  next 
   *  2.2  没有token 强制跳转到 登录  
   */

  if (to.path === '/login') return next();
  const token = sessionStorage.getItem('token')
  if (!token) return next('/login')
  next();
})


export default router
