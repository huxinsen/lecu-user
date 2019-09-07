<template>
  <div class="search">
    <div class="search__inner">
      <el-tabs v-model="activeName">
        <el-tab-pane label="商品" name="first">
          <commodity-list :commodities="CommodityList" :justifyContentType="justifyContentType"></commodity-list>
          <h3 v-if="CommodityList.length === 0" class="no-results-tip">您附近暂无相关促销商品</h3>
        </el-tab-pane>
        <el-tab-pane label="商店" name="second">
          <shop-list :shops="shopList"></shop-list>
          <h3 v-if="shopList.length === 0" class="no-results-tip">您附近暂无相关商店</h3>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CommodityList from '@/components/CommodityList'
import ShopList from '@/components/ShopList'
import { getCommoditiesUser, getCommoditiesCount } from '@/api/commodity'
import { getShopsUser } from '@/api/shop'
export default {
  components: {
    CommodityList,
    ShopList,
  },
  data() {
    return {
      activeName: 'first',
      CommodityList: [],
      shopList: [],
      justifyContentType: 'start',
    }
  },
  computed: {
    ...mapGetters(['lat', 'lng']),
  },
  created() {
    this.searchInfo()
  },
  watch: {
    '$route.query': 'searchInfo',
  },
  methods: {
    searchInfo() {
      if (this.$route.query.keywords && this.lat && this.lng) {
        // 搜索商品
        getCommoditiesUser({
          lat: this.lat,
          lng: this.lng,
          keywords: this.$route.query.keywords,
          type: 'search',
        })
          .then(res => {
            this.CommodityList = res.data
          })
          .catch(() => {
            this.$notify.error({
              title: '失败',
              message: '系统出错，请重试!',
            })
          })
        // 搜索商店
        getShopsUser({
          lat: this.lat,
          lng: this.lng,
          keywords: this.$route.query.keywords,
          type: 'search',
        })
          .then(res => {
            this.shopList = []
            var shopTmpList = res.data
            var promiseList = []
            shopTmpList.forEach(shop => {
              promiseList.push(
                // 获得促销商品个数
                new Promise((resolve, reject) => {
                  getCommoditiesCount(shop.shopId).then(res => {
                    resolve({
                      shopId: shop.shopId,
                      name: shop.name,
                      count: res.data.count,
                    })
                  })
                }),
              )
            })
            Promise.all(promiseList)
              .then(data => {
                this.shopList = data
              })
              .catch(() => {
                this.$notify.error({
                  title: '失败',
                  message: '系统出错，请重试!',
                })
              })
          })
          .catch(() => {
            this.$notify.error({
              title: '失败',
              message: '系统出错，请重试!',
            })
          })
      }
    },
  },
}
</script>

<style scoped>
.search {
  box-sizing: border-box;
  width: 100%;
}

@media (max-width: 999px) {
  .search {
    padding: 20px;
  }
}

@media (max-width: 479px) {
  .search {
    padding: 5px;
  }
}

.search__inner {
  box-sizing: border-box;
  width: 100%;
  max-width: 1000px;
  padding: 20px;
  background-color: #fff;
}


.no-results-tip {
  text-align: center;
}
</style>
