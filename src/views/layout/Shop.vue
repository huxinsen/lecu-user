<template>
  <div class="shop">
    <!-- 商店信息 -->
    <div class="shop-info">
      <div class="info-main">
        <div class="info-main__top">
          <div class="shop-img-name">
            <img v-if="shop.shopImg" :src="baseImgUploadedPath + shop.shopImg" class="shop-img" />
            <h4 class="shop-name">{{ shop.name }}</h4>
          </div>
          <div class="shop-favor">
            <p class="shop-favor__title" v-if="favorFlag">已收藏</p>
            <p class="shop-favor__title" v-if="!favorFlag">收藏本店</p>
            <div class="shop-favor__btn" @click="handleFavor">
              <i v-if="favorFlag" class="el-icon-star-on shop-favor__icon shop-favor__icon_on"></i>
              <i v-else class="el-icon-star-off shop-favor__icon"></i>
            </div>
          </div>
        </div>
        <div class="info-main__bottom">
          <p>
            <i class="info-main__icon el-icon-time"></i>营业时间
            <span class="shop-time">{{ formattedTime }}</span>
          </p>
          <p>
            <i class="info-main__icon el-icon-location-outline"></i>商家地址
            <span class="shop-address">{{ shop.address }}</span>
          </p>
          <p>
            <i class="info-main__icon el-icon-phone"></i>联系电话
            <span class="shop-tel">{{ shop.tel }}</span>
          </p>
        </div>
      </div>
      <div class="info-notice" v-if="shop.notice">
        <h4 class="info-notice__title">商家公告</h4>
        <p class="shop-notice">{{ shop.notice }}</p>
      </div>
    </div>
    <!-- 所有商品 -->
    <shop-commodities :allCommodities="allCommodities"></shop-commodities>
    <!-- 未登录 -->
    <el-dialog title="提示" :visible.sync="dialogToLoginVisible">
      <span>登录后才能收藏商店，现在就去登录？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogToLoginVisible = false">取 消</el-button>
        <el-button class="dialog-confirm-btn" @click="handleToLogin">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 确认取消收藏 -->
    <el-dialog title="提示" :visible.sync="dialogConfirmVisible">
      <span>确定取消收藏？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogConfirmVisible = false">取 消</el-button>
        <el-button class="dialog-confirm-btn" @click="handleDeleteFavor">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { baseImgUploadedPath } from '@/config/env'
import { getShop, getClasses } from '@/api/shop'
import { getCommoditiesByClass } from '@/api/commodity'
import { addFavor, getFavors, deleteFavor } from '@/api/favor'
import ShopCommodities from '@/components/ShopCommodities'
export default {
  components: {
    ShopCommodities,
  },
  data() {
    return {
      baseImgUploadedPath,
      shop: {},
      classList: [],
      allCommodities: [],
      favorFlag: false,
      favorList: [],
      dialogToLoginVisible: false,
      dialogConfirmVisible: false,
    }
  },
  computed: {
    ...mapGetters(['username']),
    formattedTime: function() {
      if (this.shop.time) {
        return this.shop.time.split('/').join(' - ')
      }
      return ''
    },
  },
  created() {
    this.getShopInfo()
    this.getAllCommodities()
    this.getFavorInfo()
  },
  methods: {
    getShopInfo() {
      if (this.$route.query.id) {
        getShop(this.$route.query.id).then(res => {
          // 没有错误信息
          if (!res.data.message && !res.data.error) {
            this.shop = res.data
          } else {
            this.$notify.error({
              title: '失败',
              message:
                res.data.message || res.data.error.message || '找不到商店！',
            })
          }
        })
      } else {
        this.$notify.info({
          title: '提示',
          message: '商品信息无法获取，先去主页转转~',
        })
      }
    },
    getAllCommodities() {
      if (this.$route.query.id) {
        getClasses(this.$route.query.id).then(res => {
          // 没有错误信息
          if (!res.data.error) {
            this.classList = res.data
          }
          if (this.classList.length > 0) {
            this.allCommodities = []
            let promiseList = []
            this.classList.forEach(cls => {
              promiseList.push(
                new Promise((resolve, reject) => {
                  getCommoditiesByClass(this.$route.query.id, cls.class).then(
                    res => {
                      resolve({
                        classValue: cls.class,
                        CommodityList: res.data,
                      })
                    },
                  )
                }),
              )
            })
            Promise.all(promiseList).then(data => {
              this.allCommodities = data
            })
          }
        })
      }
    },
    getFavorInfo() {
      // 已登录
      if (this.username) {
        // 获取收藏
        getFavors(this.username).then(res => {
          // 没有错误信息
          if (!res.data.error) {
            this.favorList = res.data
          }
          // 判断是否收藏
          this.favorList.forEach(favor => {
            if (favor.shopId === this.shop.shopId) {
              this.favorFlag = true
            }
          })
        })
      }
    },
    handleToLogin() {
      this.$router.push({
        name: '登录',
        params: {
          type: 'favor',
          shopId: this.shop.shopId,
        },
      })
    },
    // 取消收藏
    handleDeleteFavor() {
      if (this.username && this.shop.shopId) {
        this.dialogConfirmVisible = false
        deleteFavor({
          userId: this.username,
          shopId: this.shop.shopId,
        }).then(res => {
          // 取消成功
          if (res.data.success) {
            this.favorFlag = false
          } else {
            // 操作失败
            this.$notify.error({
              title: '失败',
              message:
                res.data.message || res.data.error.message || '操作失败！',
            })
          }
        })
      }
    },
    // 点击收藏
    handleFavor() {
      // 已登录
      if (this.username) {
        // 已收藏
        if (this.favorFlag) {
          // 删除确认
          this.dialogConfirmVisible = true
        } else {
          // 未收藏
          if (this.shop.shopId) {
            addFavor({
              userId: this.username,
              shopId: this.shop.shopId,
            }).then(res => {
              // 收藏成功
              if (res.data.success) {
                this.favorFlag = true
              } else {
                // 收藏失败
                this.$notify.error({
                  title: '失败',
                  message:
                    res.data.message || res.data.error.message || '操作失败！',
                })
              }
            })
          }
        }
      } else {
        // 提示登录
        this.dialogToLoginVisible = true
      }
    },
  },
}
</script>

<style scoped>
.shop {
  box-sizing: border-box;
  width: 100%;
  max-width: 1000px;
}

@media (max-width: 999px) {
  .shop {
    padding: 20px;
  }
}

@media (max-width: 479px) {
  .shop {
    padding: 5px;
  }
}

.shop-info {
  box-sizing: border-box;
  width: 100%;
  display: flex;
  justify-content: space-between;
}

@media (max-width: 679px) {
  .shop-info {
    flex-direction: column;
  }
}

.info-main {
  flex: 1;
  margin-right: 40px;
  background-color: #fff;
  border: 1px solid #e4e4e4;
}

@media (max-width: 679px) {
  .info-main {
    margin-right: 0;
    margin-bottom: 15px;
  }
}

.info-main__top {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e4e4e4;
}

.shop-img-name {
  display: flex;
  padding: 20px;
}

@media (max-width: 449px) {
  .shop-img-name {
    flex-direction: column;
    padding: 10px;
  }
}

.shop-img {
  width: 110px;
  height: 80px;
  border: 1px solid #e4e4e4;
}

@media (max-width: 449px) {
  .shop-img {
    order: 2;
  }
}

.shop-name {
  margin-left: 20px;
}

@media (max-width: 449px) {
  .shop-name {
    order: 1;
    margin: 0 0 5px;
  }
}

.shop-favor {
  box-sizing: border-box;
  width: 120px;
  height: 120px;
  padding: 20px;
  border-left: 1px dashed #e4e4e4;
  text-align: center;
}

@media (max-width: 449px) {
  .shop-favor {
    width: 130px;
    height: 130px;
  }
}

.shop-favor__title {
  font-size: 14px;
  margin-bottom: 5px;
}

.shop-favor__btn {
  cursor: pointer;
}

.shop-favor__icon {
  font-size: 28px;
}

.shop-favor__icon_on {
  color: #ff5a5a;
}

.info-main__bottom {
  padding: 5px 20px;
  font-size: 12px;
  color: #333;
}

.info-main__icon {
  margin-right: 5px;
}

.shop-time,
.shop-address,
.shop-tel {
  margin-left: 10px;
}

.info-notice {
  width: 350px;
  min-width: 180px;
  background-color: #fff;
  border: 1px solid #e4e4e4;
}

@media (max-width: 999px) {
  .info-notice {
    width: 200px;
  }
}

.info-notice__title {
  height: 50px;
  background-color: #e60044;
  padding: 0 20px;
  margin: 0;
  line-height: 50px;
  color: #fff;
  font-weight: normal;
}

.shop-notice {
  font-size: 14px;
  padding: 0 20px;
}

.dialog-confirm-btn {
  background-color: #e60044;
  color: #fff;
  border: 1px solid #e60044;
}
</style>