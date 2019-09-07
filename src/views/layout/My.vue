<template>
  <div class="my">
    <div class="my__inner">
      <div class="menu">
        <el-menu default-active="1" background-color="#fff" active-text-color="#e60044">
          <el-menu-item index="1" @click="nowIndex = 1">
            <i class="el-icon-user-solid"></i>
            <span slot="title">我的账号</span>
          </el-menu-item>
          <el-menu-item index="2" @click="nowIndex = 2">
            <i class="el-icon-star-on"></i>
            <span slot="title">我的收藏</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="panel">
        <div v-if="nowIndex === 1" class="account">
          <p>手机号：{{ user }}</p>
          <div v-if="changeFlag" class="account-change">
            <el-form
              class="pwd-change-form"
              :model="pwdForm"
              :rules="rules"
              ref="pwdForm"
              label-width="0px"
            >
              <el-form-item prop="pwd">
                <el-input class="pwd-input" type="password" placeholder="密码" v-model="pwdForm.pwd"></el-input>
              </el-form-item>
              <el-form-item prop="newPwd">
                <el-input
                  class="pwd-input"
                  type="password"
                  placeholder="新密码"
                  v-model="pwdForm.newPwd"
                ></el-input>
              </el-form-item>
              <el-form-item prop="newPwdCheck">
                <el-input
                  class="pwd-input"
                  type="password"
                  placeholder="确认新密码"
                  v-model="pwdForm.newPwdCheck"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="handleCancel">取 消</el-button>
                <el-button class="confirm-btn" @click="handleChange">确 定</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div v-else class="account-view">
            <el-button class="confirm-btn" @click="changeFlag = true">修改密码</el-button>
          </div>
        </div>
        <div v-if="nowIndex === 2" class="favor">
          <shop-list :shops="favorShopList"></shop-list>
          <h3 v-if="favorShopList.length === 0" class="no-favor-tip">暂无收藏</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import crypto from 'crypto'
import { mapGetters, mapActions } from 'vuex'
import ShopList from '@/components/ShopList'
import { changePwd } from '@/api/user'
import { getCommoditiesCount } from '@/api/commodity'
import { getFavors } from '@/api/favor'
export default {
  components: {
    ShopList,
  },
  data() {
    let validateNewPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if (value === this.pwdForm.pwd) {
        callback(new Error('新密码与密码一样!'))
      } else {
        callback()
      }
    }
    let validateNewPwdCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入确认新密码'))
      } else if (value !== this.pwdForm.newPwd) {
        callback(new Error('两次新密码输入不一致!'))
      } else {
        callback()
      }
    }
    return {
      nowIndex: 1,
      changeFlag: false,
      pwdForm: {
        pwd: '',
        newPwd: '',
        newPwdCheck: '',
      },
      rules: {
        pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '密码长度为6-18位', trigger: 'blur' },
        ],
        newPwd: [
          { validator: validateNewPwd, trigger: 'blur' },
          { min: 6, max: 18, message: '密码长度为6-18位', trigger: 'blur' },
        ],
        newPwdCheck: [
          { validator: validateNewPwdCheck, trigger: 'blur' },
          { min: 6, max: 18, message: '密码长度为6-18位', trigger: 'blur' },
        ],
      },
      favorShopList: [],
    }
  },
  computed: {
    ...mapGetters(['username']),
    user: function() {
      if (this.username) {
        return this.username.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
      }
      return ''
    },
  },
  created() {
    this.getFavorInfo()
  },
  methods: {
    ...mapActions(['Logout']),
    handleCancel() {
      this.pwdForm.pwd = ''
      this.pwdForm.newPwd = ''
      this.changeFlag = false
    },
    getFavorInfo() {
      // 已登录
      if (this.username) {
        // 获取收藏
        getFavors(this.username)
          .then(res => {
            this.favorShopList = []
            let favorList = res.data
            let promiseList = []
            favorList.forEach(favor => {
              promiseList.push(
                // 获得促销商品个数
                new Promise((resolve, reject) => {
                  getCommoditiesCount(favor.shopId).then(res => {
                    resolve({
                      shopId: favor.shopId,
                      name: favor.name,
                      count: res.data.count,
                    })
                  })
                }),
              )
            })
            Promise.all(promiseList)
              .then(data => {
                this.favorShopList = data
              })
              .catch(err => {
                this.$notify.error({
                  title: '失败',
                  message: '系统出错，请重试!',
                })
              })
          })
          .catch(err => {
            this.$notify.error({
              title: '失败',
              message: '系统出错，请重试!',
            })
          })
      }
    },
    // 修改密码
    handleChange() {
      this.$refs.pwdForm.validate(valid => {
        if (valid) {
          // MD5 求 hash 值
          let md5 = crypto.createHash('md5')
          let pwdMD5 = md5.update(this.pwdForm.pwd).digest('hex')
          md5 = crypto.createHash('md5') // for next update
          let newPwdMD5 = md5.update(this.pwdForm.newPwd).digest('hex')
          if (this.username) {
            changePwd({
              username: this.username,
              password: pwdMD5,
              newPwd: newPwdMD5,
            })
              .then(res => {
                if (res.data.success) {
                  this.$notify.success({
                    title: '成功',
                    message: res.data.message,
                  })
                  this.changeFlag = false
                  this.Logout().then(() => {})
                  this.$router.push({ path: '/' })
                } else {
                  this.$notify.error({
                    title: '失败',
                    message: res.data.message,
                  })
                }
              })
              .catch(err => {
                this.$notify.error({
                  title: '失败',
                  message: '系统出错，请重试!',
                })
              })
          }
        } else {
          this.$notify.info({
            title: '提示',
            message: '输入不合法！',
          })
        }
      })
    },
  },
}
</script>

<style scoped>
.my {
  box-sizing: border-box;
  width: 100%;
}

@media (max-width: 999px) {
  .my {
    padding: 20px;
  }
}

@media (max-width: 479px) {
  .my {
    padding: 5px;
  }
}

.my__inner {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 1000px;
  min-height: 500px;
  margin-bottom: 20px;
  background-color: #f5f5f5;
}

@media (max-width: 539px) {
  .my__inner {
    flex-direction: column;
  }
}

.menu {
  box-sizing: border-box;
  min-width: 200px;
  margin-right: 15px;
  padding-top: 20px;
  background-color: #fff;
}

@media (max-width: 539px) {
  .menu {
    margin-right: 0;
  }
  .menu .el-menu {
    display: flex;
  }
}

.confirm-btn {
  background-color: #e60044;
  color: #fff;
  border: 1px solid #e60044;
}

.panel {
  flex: 1;
  overflow: auto;
  box-sizing: border-box;
  padding: 20px;
  background-color: #fff;
}

.pwd-input {
  width: 300px;
  height: 44px;
}

.no-favor-tip {
  text-align: center;
}
</style>