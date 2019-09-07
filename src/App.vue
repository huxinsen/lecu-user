<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { baseImgUploadedPath } from '@/config/env'
import { mapGetters } from 'vuex'
export default {
  name: 'app',
  computed: {
    ...mapGetters(['addr', 'lat', 'lng']),
  },
  data() {
    return {
      baseImgUploadedPath,
    }
  },
  sockets: {
    connect() {
      this.$socket.emit('user_connect', {
        lat: this.lat,
        lng: this.lng,
      })
    },
    new_commodity(commodity) {
      let that = this
      this.$notify({
        duration: 0,
        title: '新的促销商品!',
        dangerouslyUseHTMLString: true,
        message:
          '<div class="meaasge"><img class="notify__img" src="' +
          baseImgUploadedPath +
          commodity.pic1 +
          '">' +
          '<div class="notify__info"><h3 class="notify__commodity-name">' +
          commodity.name +
          '</h3>' +
          '<p class="notify__commodity-price"><span class="notify__commodity-price-now">￥' +
          commodity.price +
          '</span><s class="notify__commodity-price-original">￥<span>' +
          commodity.originalPrice +
          '</span></s></p></div></div>',
        onClick() {
          that.$router.push({
            name: '商品详情',
            query: {
              id: commodity.id,
            },
          })
        },
      })
    },
  },
  watch: {
    addr: function() {
      this.$socket.emit('user_update_location', {
        lat: this.lat,
        lng: this.lng,
      })
    },
  },
}
</script>

<style>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
}

/* new commodity notification */
.el-notification:hover {
  cursor: pointer;
}

.notify__img {
  display: inline-block;
  width: 85px;
  height: 85px;
}

.notify__info {
  display: inline-block;
  margin-left: 10px;
  vertical-align: top;
}

.notify__commodity-name {
  margin-top: 0;
}

.notify__commodity-price {
  color: red;
}

.notify__commodity-price-now {
  font-size: 28px;
}

.notify__commodity-price-original {
  margin-left: 10px;
  color: #999;
}

/* element ui override */
/* Location */
.search-input input {
  width: 500px;
  height: 60px;
  font-size: 16px;
  padding-left: 20px;
}

@media (max-width: 569px) {
  .search-input input {
    width: 80vw;
  }
}

/* Search */
.search .el-tabs__item.is-active {
  color: #e60044;
}

.search .el-tabs__item:hover {
  color: #e60044;
}

.search .el-tabs__active-bar {
  background-color: #e60044;
}

.search .el-tabs__nav-scroll {
  width: 90%;
  margin: auto;
}
</style>
