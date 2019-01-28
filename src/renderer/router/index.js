import Vue from 'vue'
import Router from 'vue-router'

// 引入首页
const Home = () => import("@/pages/Home")

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
