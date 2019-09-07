<template>
  <div class="commodity">
    <div class="commodity__inner" v-if="pictures.length !== 0">
      <!-- 图片 -->
      <pictures :pictures="pictures"></pictures>
      <!-- 商品信息 -->
      <div class="info-wrapper">
        <div class="commodity-info">
          <h3 class="commodity-name">{{ commodity.name }}</h3>
          <div class="commodity-main-info">
            <p class="commodity-price">
              <span class="commodity-price__now">￥{{ commodity.price }}</span>
              <s class="commodity-price__original" v-if="commodity.originalPrice">
                <span>￥{{ commodity.originalPrice }}</span>
              </s>
            </p>
            <p>
              活动截止日期：
              <span>{{ commodity.endTime }}</span>
            </p>
            <div>
              <div class="commodity-promotion-tag">活动详情</div>
              <p>{{ commodity.promotionInfo }}</p>
            </div>
            <div>
              <div class="commodity-details-tag">商品详情</div>
              <p>{{ commodity.details }}</p>
            </div>
          </div>
          <div class="commodity-shop-info">
            <div class="shop-address">
              <div class="shop-address-tag">商家地址</div>
              <div class="address">{{ commodity.address }}</div>
            </div>
            <div class="shop-time">
              <div class="shop-time-tag">营业时间</div>
              <div class="time">{{ formattedTime }}</div>
            </div>
          </div>
          <span class="report" @click="toReport">举报</span>
          <span class="find-similar" @click="toFindSimilar">找相似商品</span>
        </div>
        <!-- 商店面板 -->
        <div class="shop-pane">
          <div class="shop-name">{{ commodity.shopName }}</div>
          <button type="button" class="shop-link" @click="toShopPage(commodity.shopId)">进入店铺</button>
        </div>
      </div>
    </div>
    <h3 v-if="pictures.length === 0" class="no-commodity-tip">商品信息获取失败，去主页转转吧</h3>
    <!-- 相似商品 -->
    <div v-if="similarFlag" class="similar">
      <div v-if="similarList.length > 0">
        <h3 class="similar-title">为您找到如下相似商品</h3>
        <commodity-list :commodities="similarList" :justifyContentType="justifyContentType"></commodity-list>
      </div>
      <h3 v-if="similarList.length === 0" class="no-similar-tip">暂无相似商品</h3>
    </div>
    <!-- 未登录 -->
    <el-dialog title="提示" :visible.sync="dialogToLoginVisible">
      <span>登录后才能举报，现在就去登录？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogToLoginVisible = false">取 消</el-button>
        <el-button class="dialog-confirm-btn" @click="handleToLogin">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 举报理由 -->
    <el-dialog title="举报" :visible.sync="dialogReportVisible">
      <el-form :model="reportForm" :rules="rules" ref="reportForm">
        <el-form-item label="举报理由" prop="reason">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="不超过85个字"
            v-model="reportForm.reason"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogReportVisible = false">取 消</el-button>
        <el-button class="dialog-confirm-btn" @click="handleReport('reportForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Pictures from '@/components/Pictures'
import CommodityList from '@/components/CommodityList'
import { getCommodity, getCommoditiesUser } from '@/api/commodity'
import { addReport } from '@/api/report'
export default {
  components: {
    Pictures,
    CommodityList,
  },
  data() {
    return {
      dialogToLoginVisible: false,
      dialogReportVisible: false,
      reportForm: {
        reason: '',
      },
      rules: {
        reason: [
          { required: true, message: '请输入举报理由', trigger: 'blur' },
        ],
      },
      commodity: {},
      pictures: [],
      similarFlag: false,
      similarList: [],
      justifyContentType: 'start',
    }
  },
  computed: {
    ...mapGetters(['username', 'lat', 'lng']),
    formattedTime: function() {
      if (this.commodity.time) {
        return this.commodity.time.split('/').join(' - ')
      }
      return ''
    },
  },
  watch: {
    '$route.query': 'getCommodityInfo',
  },
  created() {
    this.getCommodityInfo()
  },
  methods: {
    getCommodityInfo() {
      if (this.$route.query.id) {
        getCommodity(this.$route.query.id)
          .then(res => {
            if (!res.data.message) {
              this.commodity = res.data
              this.commodity.endTime = this.moment(
                this.commodity.endTime,
              ).format('YYYY-MM-DD HH:mm:ss')
              this.pictures = []
              const picKeys = ['pic1', 'pic2', 'pic3', 'pic4', 'pic5']
              picKeys.forEach(pic => {
                this.pictures.push(this.commodity[pic])
              })
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
      } else {
        this.$notify.info({
          title: '提示',
          message: '商品信息无法获取，先去主页转转~',
        })
      }
    },
    toShopPage(id) {
      this.$router.push({
        path: '/shop',
        query: {
          id,
        },
      })
    },
    toReport() {
      if (this.username) {
        this.dialogReportVisible = true
      } else {
        this.dialogToLoginVisible = true
      }
    },
    toFindSimilar() {
      if (this.commodity.name && this.lat && this.lng) {
        // 搜索商品
        getCommoditiesUser({
          lat: this.lat,
          lng: this.lng,
          keywords: this.commodity.name,
          type: 'search',
        })
          .then(res => {
            this.similarList = res.data
            this.similarList = this.similarList.filter(commodity => {
              return commodity.id !== this.commodity.id
            })
          })
          .catch(err => {
            this.$notify.error({
              title: '失败',
              message: '系统出错，请重试!',
            })
          })
      }
      // 展示相似商品
      this.similarFlag = true
    },
    handleToLogin() {
      this.$router.push({
        name: '登录',
        params: {
          type: 'report',
          commodityId: this.commodity.id,
        },
      })
    },
    handleReport(formName) {
      this.$refs[formName].validate(valid => {
        if (this.username && this.commodity.id && this.commodity.shopId) {
          this.dialogReportVisible = false
          addReport({
            userId: this.username,
            shopId: this.commodity.shopId,
            cmdtId: this.commodity.id,
            reason: this.reportForm.reason,
          })
            .then(res => {
              if (res.data.success) {
                this.$notify.success({
                  title: '成功',
                  message: res.data.message,
                })
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
      })
    },
  },
}
</script>

<style scoped>
.commodity {
  box-sizing: border-box;
  width: 100%;
  max-width: 1000px;
  padding: 20px;
  margin-bottom: 20px;
}

@media (min-width: 1000px) {
  .commodity {
    padding: 0;
  }
}

@media (max-width: 479px) {
  .commodity {
    padding: 5px;
  }
}

.commodity__inner {
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  padding: 10px;
  background-color: #fff;
}

@media (min-width: 1000px) {
  .commodity__inner {
    padding: 15px;
  }
}

@media (max-width: 999px) {
  .commodity__inner {
    justify-content: space-evenly;
  }
}

@media (max-width: 679px) {
  .commodity__inner {
    flex-direction: column;
    align-items: center;
  }
}

.info-wrapper {
  display: flex;
}

@media (max-width: 999px) {
  .info-wrapper {
    flex-direction: column;
  }
}

@media (max-width: 679px) {
  .info-wrapper {
    margin-top: 10px;
  }
}

/* commodity-info */
.commodity-info {
  width: 366px;
  margin-right: 15px;
  font-size: 14px;
}

@media (max-width: 999px) {
  .commodity-info {
    order: 2;
    margin-right: 0;
  }
}

@media (max-width: 679px) {
  .commodity-info {
    width: 360px;
  }
}

@media (max-width: 419px), (min-width: 680px) and (max-width: 799px) {
  .commodity-info {
    width: 300px;
  }
}

.commodity-name {
  margin: 0 0 10px;
  font-size: 16px;
}

.commodity-main-info {
  box-sizing: border-box;
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #fff6eb;
}

.commodity-price {
  font-size: 13px;
}

.commodity-price__now {
  font-size: 28px;
  color: red;
}

.commodity-price__original {
  margin-left: 10px;
  color: #999;
}

.commodity-promotion-tag,
.commodity-details-tag {
  width: 60px;
  height: 20px;
  text-align: center;
  font-size: 12px;
  color: #fff;
  border-radius: 5px;
}

.commodity-promotion-tag {
  background-color: #ec1611;
}

.commodity-details-tag {
  background-color: #ff8a00;
}

.shop-address,
.shop-time {
  display: flex;
  margin-bottom: 10px;
}

.shop-address-tag,
.shop-time-tag {
  width: 78px;
  height: 25px;
  line-height: 25px;
  margin-right: 10px;
  text-align: center;
  font-size: 12px;
  color: #fff;
  background-image: url('../../assets/tag.png');
}

.address {
  width: 260px;
}

.time {
  height: 25px;
  line-height: 25px;
}

.report,
.find-similar {
  margin-left: 15px;
  font-size: 12px;
  color: #999;
  text-decoration: underline;
  cursor: pointer;
}

/* shop */
.shop-pane {
  box-sizing: border-box;
  width: 200px;
  height: 362px;
  padding: 10px;
  border: 1px solid #e4e4e4;
  text-align: center;
}

@media (max-width: 999px) {
  .shop-pane {
    order: 1;
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 60px;
    margin-bottom: 5px;
    border-radius: 5px;
  }
}

.shop-name {
  border-bottom: 1px solid #e4e4e4;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

@media (max-width: 999px) {
  .shop-name {
    margin: 0;
    padding: 0;
    border: none;
  }
}

.shop-link {
  width: 80px;
  height: 40px;
  padding: 0;
  color: #e60044;
  background-color: #fff;
  border: 1px solid #e60044;
  border-radius: 4px;
  cursor: pointer;
}

/* tip */
.no-commodity-tip,
.no-similar-tip {
  text-align: center;
}

.dialog-confirm-btn {
  color: #fff;
  background-color: #e60044;
  border: 1px solid #e60044;
}

/* similar */
.similar {
  margin-top: 30px;
  padding-bottom: 10px;
  border-top: 1px solid #e4e4e4;
}

.similar-title {
  padding-left: 20px;
}
</style>
