import Vuex from 'vuex'
import Vue from 'vue'
import * as types from '@/store/types'
import { login } from '@/api/user'
import {
  setToken,
  removeToken,
  setUsername,
  removeUsername,
  setLoginType,
  removeLoginType,
  setLocation,
} from '@/utils/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null,
    username: null,
    loginType: null,
    addr: '',
    lat: '',
    lng: '',
  },
  getters: {
    username: state => state.username,
    loginType: state => state.loginType,
    addr: state => state.addr,
    lat: state => state.lat,
    lng: state => state.lng,
  },
  mutations: {
    [types.LOGIN]: (state, data) => {
      setToken(data.token)
      setUsername(data.username)
      setLoginType(data.loginType)
      state.token = data.token
      state.username = data.username
      state.loginType = data.loginType
    },
    [types.LOGOUT]: state => {
      removeToken()
      removeUsername()
      removeLoginType()
      state.token = null
      state.username = null
      state.loginType = null
    },
    [types.LOCATE]: (state, data) => {
      setLocation(data)
      state.addr = data.addr
      state.lat = data.lat
      state.lng = data.lng
    },
  },
  actions: {
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login({
          username,
          password: userInfo.password,
        })
          .then(response => {
            const res = response.data
            if (res.token) {
              commit(types.LOGIN, {
                token: res.token,
                username: res.username,
                loginType: res.type,
              })
            }
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    Logout({ commit }) {
      return new Promise(resolve => {
        commit(types.LOGOUT)
        resolve()
      })
    },
    Locate({ commit }, location) {
      return new Promise(resolve => {
        commit(types.LOCATE, location)
        resolve()
      })
    },
  },
})
