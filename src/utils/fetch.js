import axios from 'axios'
import store from '@/store/store'
import * as types from '@/store/types'
import router from '@/router'
import { basePath } from '@/config/env'
// axios 配置
axios.defaults.timeout = 6000
axios.defaults.baseURL = basePath

// http request 拦截器
axios.interceptors.request.use(
  config => {
    if (store.state.token) {
      config.headers['x-access-token'] = store.state.token
    }
    return config
  },
  err => {
    return Promise.reject(err)
  },
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response
  },
  err => {
    if (err.response) {
      switch (err.response.status) {
        // 401 清除token信息并跳转到登录页面
        case 401: {
          store.commit(types.LOGOUT)
          router.replace({
            path: 'login',
            query: { redirect: router.currentRoute.fullPath },
          })
        }
      }
    }
    return Promise.reject(err.response.data)
  },
)

export default axios
