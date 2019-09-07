<template>
  <div class="signup">
    <el-form
      class="signup-form"
      :model="signUpForm"
      :rules="rules"
      ref="signUpForm"
      label-width="0px"
    >
      <div class="logo-wrapper">
        <div class="logo">乐 促</div>
        <div class="slogan">更多折扣，更好生活</div>
      </div>
      <el-form-item prop="username">
        <el-input
          class="signup-input"
          v-model.number="signUpForm.username"
          placeholder="账号(手机号)"
          maxlength="11"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          class="signup-input"
          type="password"
          placeholder="密码"
          v-model="signUpForm.password"
        ></el-input>
      </el-form-item>
      <el-form-item prop="checkPwd">
        <el-input
          class="signup-input"
          type="password"
          placeholder="确认密码"
          v-model="signUpForm.checkPwd"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="signup-btn" @click="submitForm('signUpForm')" :loading="loading">同意以下协议并注册</el-button>
      </el-form-item>
      <div class="contracts">《商家用户服务协议》</div>
    </el-form>
  </div>
</template>

<script>
import crypto from 'crypto'
import { signUp } from '@/api/user'
export default {
  data() {
    let checkTel = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入账号'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入正确的手机号'))
        } else if (value.toString().length !== 11) {
          callback(new Error('手机长度为11位'))
        } else {
          callback()
        }
      }, 1000)
    }
    // 密码检查
    let validatePwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.signUpForm.checkPwd !== '') {
          this.$refs.signUpForm.validateField('checkPwd')
        }
        callback()
      }
    }
    let validateCheckPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.signUpForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      signUpForm: {
        username: '',
        password: '',
        checkPwd: '',
      },
      rules: {
        username: [{ validator: checkTel, trigger: 'blur' }],
        password: [
          { validator: validatePwd, trigger: 'blur' },
          { min: 6, max: 18, message: '密码长度为6-18位', trigger: 'blur' },
        ],
        checkPwd: [
          { validator: validateCheckPwd, trigger: 'blur' },
          { min: 6, max: 18, message: '密码长度为6-18位', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // MD5 求 hash 值
          let md5 = crypto.createHash('md5')
          let pwdMD5 = md5.update(this.signUpForm.password).digest('hex')
          let signUpParams = {
            username: this.signUpForm.username,
            password: pwdMD5,
          }
          this.loading = true
          signUp(signUpParams)
            .then(res => {
              this.loading = false
              if (res.data.success) {
                this.$notify.success({
                  title: '成功',
                  message: res.data.message,
                })
                if (this.$route.params.type === 'location') {
                  this.$router.push({
                    name: '登录',
                    params: { type: 'location' },
                  })
                } else {
                  this.$router.push({ name: '登录' })
                }
              } else {
                this.$notify.error({
                  title: '失败',
                  message: res.data.message,
                })
              }
            })
            .catch(err => {
              let msg = err.error.message.includes('ER_DUP_ENTRY')
                ? '用户已注册'
                : '注册失败！'
              this.$notify.error({
                title: '失败',
                message: msg,
              })
              this.loading = false
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
.signup {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #f5f5f5;
}

.signup-form {
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
  font-size: 28px;
  text-align: center;
  line-height: 47px;
  color: #fff;
  background: url('../assets/logo-bg.png');
  background-repeat: no-repeat;
}

.slogan {
  margin-top: 10px;
  text-align: center;
  color: #e60044;
}
/* button */
.signup-btn.el-button {
  width: 100%;
  height: 40px;
  background-color: #e60044;
  color: #fff;
  font-size: 16px;
  border: none;
  border-radius: 5px;
}

.signup-btn.el-button:hover {
  color: #fff;
  background-color: #e60044;
}

.contracts {
  font-size: 14px;
  text-align: center;
  color: #e60044;
}
</style>