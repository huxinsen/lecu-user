<template>
  <div class="shop-list-component">
    <div class="shop-list">
      <div v-for="shop in shops" :key="shop.shopId" class="shop" @click="toShopPage(shop.shopId)">
        <div class="shop-name">{{ shop.name }}</div>
        <p>
          <span class="shop-commodity-count">{{ shop.count }}件</span>商品正在促销
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { baseImgUploadedPath } from '@/config/env'
export default {
  props: {
    shops: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      baseImgUploadedPath,
    }
  },
  methods: {
    toShopPage(id) {
      this.$router.push({
        path: '/shop',
        query: {
          id,
        },
      })
    },
  },
}
</script>

<style scoped>
.shop-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, 222px);
  justify-items: center;
  gap: 20px;
  width: 100%;
  max-width: 1000px;
  padding: 10px 0;
}

.shop {
  box-sizing: border-box;
  width: 220px;
  height: 120px;
  padding: 20px;
  border: 1px solid #e4e4e4;
  background-color: #fff;
  cursor: pointer;
  transition: box-shadow 0.3s;
}

.shop:hover {
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.35);
}

.shop-name {
  width: 190px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.shop-commodity-count {
  color: #e60044;
}
</style>
