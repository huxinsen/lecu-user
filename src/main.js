import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store/store'
import Moment from 'moment'
import VueSocketIO from 'vue-socket.io'
import '@/plugins/element.js'
Vue.prototype.moment = Moment

Vue.config.productionTip = false

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: 'http://localhost',
  }),
)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
