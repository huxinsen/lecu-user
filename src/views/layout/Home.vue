<template>
  <div class="home">
    <commodity-list :commodities="commodities"></commodity-list>
    <h3 v-if="commodities.length === 0" class="no-commodity-tip">您附近暂无乐促商家的促销商品</h3>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CommodityList from '@/components/CommodityList'
import { getCommoditiesUser } from '@/api/commodity'
export default {
  components: {
    CommodityList,
  },
  data() {
    return {
      commodities: [],
    }
  },
  computed: {
    ...mapGetters(['lat', 'lng']),
  },
  created() {
    this.getCommodities()
  },
  methods: {
    getCommodities() {
      if (this.$route.query.lat && this.$route.query.lng) {
        getCommoditiesUser({
          lat: this.$route.query.lat,
          lng: this.$route.query.lng,
          type: 'nearby',
        })
          .then(res => {
            this.commodities = res.data
          })
          .catch(err => {
            this.$notify.error({
              title: '失败',
              message: '系统出错，请重试!',
            })
          })
      } else if (this.lat && this.lng) {
        this.$router.push({
          path: '/home',
          query: {
            lat: this.lat,
            lng: this.lng,
          },
        })
        getCommoditiesUser({
          lat: this.lat,
          lng: this.lng,
          type: 'nearby',
        })
          .then(res => {
            this.commodities = res.data
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
          message: '地址信息获取失败，请重新设置！',
        })
      }
    },
  },
}
</script>

<style scoped>
.home {
  width: 100%;
}

.no-commodity-tip {
  text-align: center;
}
</style>
