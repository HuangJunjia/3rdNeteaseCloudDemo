import Vue from 'vue'
import Router from 'vue-router'

const Main = () => import("@/pages/home");

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Main
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
