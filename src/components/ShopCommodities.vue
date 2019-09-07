<template>
  <div class="shop-commodities-component">
    <div v-for="cls in allCommodities" :key="cls.classValue">
      <h3 class="class-name">{{ cls.classValue }}</h3>
      <commodity-list :commodities="cls.CommodityList" :justifyContentType="justifyContentType"></commodity-list>
    </div>
  </div>
</template>

<script>
import CommodityList from '@/components/CommodityList'
export default {
  props: {
    allCommodities: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      justifyContentType: 'start',
    }
  },
  components: {
    CommodityList,
  },
}
</script>
