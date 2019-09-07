<template>
  <div class="my-header">
    <div class="my-header__inner">
      <div class="logo" @click="$router.push('/')">乐 促</div>
      <button class="nav-link my-header__link" type="button" @click="$router.push('/')">首页</button>
      <a href="http://localhost:8080" target="_blank" class="nav-link my-header__link">商家中心</a>
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
          @click="$router.push('/signup')"
          style="color: #fff;"
        >注册</button>
        <span class="seperator">|</span>
        <button
          class="nav-link"
          type="button"
          @click="$router.push('/login')"
          style="color: #fff;"
        >登录</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
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
    ...mapActions(['Logout']),
    handleCommand(command) {
      if (command === 'my') {
        this.$router.push('/my')
      } else if (command === 'signout') {
        this.Logout().then(() => {
          if (this.$route.path === '/my') {
            this.$router.push('/')
          }
        })
      }
    },
  },
}
</script>

<style scoped>
.my-header {
  width: 100%;
  background-color: #e60044;
}

.my-header__inner {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  max-width: 1000px;
  height: 60px;
  margin: auto;
  align-items: center;
  color: #fff;
}

@media (max-width: 1019px) {
  .my-header__inner {
    padding: 0 10px;
  }
}

.logo {
  width: 151px;
  height: 47px;
  margin-right: auto;
  line-height: 47px;
  text-align: center;
  font-size: 28px;
  background: url('../assets/logo-bg.png');
  background-repeat: no-repeat;
  cursor: pointer;
}

.logo:hover {
  cursor: pointer;
}

.my-header__link {
  margin-right: 2rem;
}

@media (max-width: 479px) {
  .my-header__link {
    margin-right: 1rem;
  }
}

@media (max-width: 379px) {
  .my-header__link {
    margin-right: .5rem;
  }
}

.nav-link {
  padding: 0;
  font-size: 16px;
  text-decoration: none;
  color: #fff;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

@media (max-width: 379px) {
  .nav-link {
    width: 30px;
    font-size: 14px;
  }
}

.user {
  margin: 0 40px;
  font-size: 20px;
  color: #fff;
  cursor: pointer;
}

@media (max-width: 479px) {
  .user {
    margin: 0 20px;
  }
}

@media (max-width: 379px) {
  .user {
    margin: 0;
  }
}
</style>