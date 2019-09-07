<template>
  <div class="location">
    <div class="location-main">
      <div class="location-header">
        <div class="header-left">
          <div class="logo" @click="$router.push('/')">乐 促</div>
          <div class="slogan">更多折扣，更好生活</div>
        </div>
        <el-dropdown v-if="logedIn" @command="handleCommand">
          <span class="user">
            <i class="el-icon-s-custom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="my">个人中心</el-dropdown-item>
            <el-dropdown-item command="signout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div v-else class="nav-link-group">
          <button
            class="nav-link"
            type="button"
            @click="$router.push({ path: '/signup', params: { type: 'location'}, })"
            style="color: #fff;"
          >注册</button>
          <span class="seperator">|</span>
          <button
            class="nav-link"
            type="button"
            @click="$router.push({ path: '/login', params: { type: 'location'}, })"
            style="color: #fff;"
          >登录</button>
        </div>
      </div>
      <div class="location-search">
        <el-form :inline="true" :model="searchForm" class="location-search__inner">
          <el-form-item>
            <el-autocomplete
              class="search-input"
              v-model="searchForm.address"
              :fetch-suggestions="querySearchAsync"
              placeholder="输入地址搜索身边促销商品"
              :trigger-on-focus="false"
              @select="handleSelect"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item>
            <el-button
              class="search-btn"
              type="primary"
              @click="searchAddress"
              :loading="loading"
            >搜 索</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="join">
      <div class="join-intro">
        <h4 class="join-intro__title">商店入驻</h4>
        <p class="join-intro__content">平台优势，吸引更多消费者</p>
      </div>
      <a href="http://localhost:8080" target="_blank" class="join-link">立即入驻 ></a>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { getTips, getLocation } from '@/api/lbs'
export default {
  data() {
    return {
      loading: false,
      searchForm: {
        address: '',
      },
    }
  },
  computed: {
    ...mapGetters(['username']),
    logedIn: function() {
      if (this.username) {
        return true
      }
      return false
    },
  },
  methods: {
    ...mapActions(['Locate', 'Logout']),
    async querySearchAsync(queryString, callback) {
      if (queryString && queryString !== '') {
        try {
          const addressList = await getTips(queryString)
          if (addressList instanceof Array) {
            addressList.map(item => {
              item.value = item.district + item.address
              return item
            })
            if (addressList.length > 0) {
              callback(addressList)
            }
          }
        } catch (err) {
          this.$notify.error({
            title: '失败',
            message: '系统出错，请重试!',
          })
        }
      }
    },
    handleCommand(command) {
      if (command === 'my') {
        this.$router.push({
          name: '个人中心',
        })
      } else if (command === 'signout') {
        this.Logout().then(() => {})
      }
    },
    handleSelect(item) {
      let locations = item.location.split(',')
      if (locations.length === 2) {
        this.Locate({
          addr: item.value,
          lng: locations[0],
          lat: locations[1],
        })
        this.$router.push({
          path: '/home',
          query: {
            lng: locations[0],
            lat: locations[1],
          },
        })
      }
    },
    async searchAddress() {
      if (this.searchForm.address) {
        this.loading = true
        getLocation(this.searchForm.address).then(res => {
          this.loading = false
          if (res.data.success) {
            let location = res.data.location
            let data = location.split(',')
            this.Locate({
              addr: this.searchForm.address,
              lng: data[0],
              lat: data[1],
            })
            this.$router.push({
              path: '/home',
              query: {
                lng: data[0],
                lat: data[1],
              },
            })
          } else {
            this.$notify.error({
              title: '失败',
              message: '系统出错，请重试!',
            })
          }
        })
      } else {
        this.$notify.info({
          title: '提示',
          message: '请输入地址！',
        })
      }
    },
  },
}
</script>

<style scoped>
.location-main {
  display: flex;
  flex-direction: column;
  height: 500px;
  background-color: rgba(203, 0, 68, 0.7);
}
/* header */
.location-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  max-width: 1000px;
  margin: 40px auto 0;
  color: #fff;
}

@media (max-width: 1019px) {
  .location-header {
    padding: 0 10px;
  }
}

.logo {
  width: 151px;
  height: 47px;
  line-height: 47px;
  text-align: center;
  font-size: 28px;
  background: url('../assets/logo-bg.png');
  background-repeat: no-repeat;
}

.logo:hover {
  cursor: pointer;
}

.slogan {
  margin-top: 10px;
}

.nav-link {
  font-size: 16px;
  text-decoration: none;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.user {
  margin: 0 40px;
  font-size: 20px;
  color: #fff;
  cursor: pointer;
}
/* search */
.location-search {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 699px) {
  .location-search__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

.search-btn {
  width: 120px;
  height: 60px;
  font-size: 16px;
}

@media (max-width: 399px) {
  .search-btn {
    width: 80px;
    height: 50px;
  }
}

/* join us */
.join {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 360px;
  height: 110px;
  margin: 30px auto;
  border: 1px solid #eee;
  border-radius: 55px;
  box-shadow: 0 3px 5px #ccc;
}

@media (max-width: 399px) {
  .join {
    width: 280px;
  }
}

.join-intro__title {
  margin-top: 0;
  margin-bottom: 10px;
}

.join-intro__content {
  margin-bottom: 0;
  font-size: 14px;
  color: #999;
}

.join-link {
  text-decoration: none;
  color: #409eff;
}
</style>

