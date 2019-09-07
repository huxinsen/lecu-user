<template>
  <div class="login">
    <el-form class="login-form" :model="loginForm" :rules="rules" ref="loginForm" label-width="0px">
      <div class="logo-wrapper">
        <div class="logo" @click="$router.push({ name: '首页' })">乐 促</div>
        <p class="slogan">更多折扣，更好生活</p>
      </div>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" placeholder="账号(手机号)"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          placeholder="密码"
          v-model="loginForm.password"
          @keyup.enter.native="submitForm('loginForm')"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="login-btn" @click="submitForm('loginForm')" :loading="logining">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import crypto from 'crypto'
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      logining: false,
      loginForm: {
        username: '',
        password: '',
      },
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 11, max: 11, message: '长度为11位', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码不能小于6位', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    ...mapActions(['Login']),
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // MD5 求 hash 值
          var md5 = crypto.createHash('md5')
          var passMD5 = md5.update(this.loginForm.password).digest('hex')
          this.logining = true
          this.Login({ username: this.loginForm.username, password: passMD5 })
            .then(res => {
              this.logining = false
              if (res.success) {
                if (this.$route.params.type === 'report') {
                  this.$router.push({
                    path: '/commodity',
                    query: {
                      id: this.$route.params.commodityId,
                    },
                  })
                } else if (this.$route.params.type === 'favor') {
                  this.$router.push({
                    path: '/shop',
                    query: {
                      id: this.$route.params.shopId,
                    },
                  })
                } else if (this.$route.params.type === 'location') {
                  this.$router.push('/location')
                } else if (this.$route.params.type === 'my') {
                  this.$router.push('/my')
                } else {
                  this.$router.push('/')
                }
              } else {
                this.$notify.error({
                  title: '失败',
                  message: res.message,
                })
              }
            })
            .catch(err => {
              this.logining = false
              this.$notify.error({
                title: '失败',
                message: '系统出错，请重试!',
              })
            })
        } else {
          return false
        }
      })
    },
  },
}
</script>

<style scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #f5f5f5;
}

.login-form {
  width: 300px;
}
/* logo */
.logo-wrapper {
  margin-bottom: 30px;
}

.logo {
  width: 151px;
  height: 47px;
  margin: auto;
  line-height: 47px;
  font-size: 28px;
  text-align: center;
  color: #fff;
  background: url('../assets/logo-bg.png');
  background-repeat: no-repeat;
  cursor: pointer;
}

.slogan {
  text-align: center;
  color: #e60044;
}

.login-btn {
  width: 100%;
  height: 40px;
  font-size: 16px;
  color: #fff;
  background-color: #e60044;
  border: none;
  border-radius: 5px;
}

.login-btn:hover {
  color: #fff;
  background-color: #e60044;
}
</style>
