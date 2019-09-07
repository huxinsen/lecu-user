import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/store'
import * as types from '@/store/types'
import { getLocation, getToken, getUsername } from '@/utils/auth'
import Layout from '@/views/layout/Layout'
import SignUp from '@/views/SignUp'
import Login from '@/views/Login'
import Location from '@/views/Location'
import Home from '@/views/layout/Home'
import Commodity from '@/views/layout/Commodity'
import Shop from '@/views/layout/Shop'
import Search from '@/views/layout/Search'
import My from '@/views/layout/My'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: '首页',
      component: Layout,
      meta: {
        requireAuth: true,
      },
      redirect: '/home',
      children: [
        {
          path: 'home',
          name: '附近商品',
          component: Home,
        },
        {
          path: 'commodity',
          name: '商品详情',
          component: Commodity,
        },
        {
          path: 'shop',
          name: '商店主页',
          component: Shop,
        },
        {
          path: 'search',
          name: '搜索',
          component: Search,
        },
        {
          path: 'my',
          name: '个人中心',
          component: My,
        },
      ],
    },
    {
      path: '/signup',
      name: '注册',
      component: SignUp,
    },
    {
      path: '/login',
      name: '登录',
      component: Login,
    },
    {
      path: '/location',
      name: '位置',
      component: Location,
    },
  ],
})

router.beforeEach((to, from, next) => {
  // 未登录
  if (!store.state.token) {
    if (getToken() && getUsername()) {
      store.commit(types.LOGIN, { token: getToken(), username: getUsername() })
    }
  }
  // 个人主页需要登录
  if (to.path === '/my') {
    if (!store.state.token) {
      next({
        name: '登录',
        params: { type: 'my' },
      })
    } else {
      next()
    }
  }
  // 未设置地址
  if (to.matched.some(r => r.meta.requireAuth)) {
    if (store.state.addr && store.state.lng && store.state.lat) {
      next()
    } else {
      var location = getLocation()
      if (location.addr && location.lng && location.lat) {
        store.commit(types.LOCATE, location)
        next()
      } else {
        next({
          path: '/location',
        })
      }
    }
  } else {
    next()
  }
})

export default router
