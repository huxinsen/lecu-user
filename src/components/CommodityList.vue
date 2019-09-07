<template>
  <div class="commodity-list-component">
    <div
      class="commodity-list"
      :class="justifyContentType==='center'?commodityListCenter:commodityListStart"
    >
      <div
        v-for="item in commodities"
        :key="item.id"
        class="commodity"
        @click="toCommodityPage(item.id)"
      >
        <div>
          <img class="commodity__picture" v-if="item.pic1" :src="baseImgUploadedPath + item.pic1" />
          <img class="commodity__picture" v-else src="../assets/pic-placeholder.png" />
        </div>
        <div class="commodity__name">{{ item.name }}</div>
        <div class="commodity__info">
          <div class="commodity__price-info">
            <div class="commodity__price">￥{{ item.price }}</div>
            <div class="commodity__original-price" v-if="item.originalPrice">
              <s>￥{{ item.originalPrice }}</s>
            </div>
          </div>
          <div class="commodity__days-left">还剩 {{ item.daysLeft }} 天</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { baseImgUploadedPath } from '@/config/env'
export default {
  props: {
    commodities: {
      type: Array,
      default: [],
    },
    justifyContentType: {
      type: String,
      default: 'center',
    },
  },
  data() {
    return {
      baseImgUploadedPath,
      commodityListCenter: 'commodity-list_center',
      commodityListStart: 'commodity-list_start',
    }
  },
  methods: {
    toCommodityPage(id) {
      this.$router.push({
        path: '/commodity',
        query: {
          id,
        },
      })
    },
  },
}
</script>

<style scoped>
.commodity-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, 222px);
  justify-items: center;
  gap: 20px;
  width: 100%;
  max-width: 1000px;
  min-width: 270px;
  padding: 10px 0;
}

@media (max-width: 519px) {
  .commodity-list {
    grid-template-columns: repeat(auto-fit, 182px);
    gap: 10px;
  }
}

@media (max-width: 383px) {
  .commodity-list {
    grid-template-columns: repeat(auto-fit, 150px);
  }
}

.commodity-list_center {
  justify-content: center;
}

.commodity-list_start {
  justify-content: start;
}

.commodity {
  width: 220px;
  height: 290px;
  border: 1px solid #e4e4e4;
  background-color: #fff;
  cursor: pointer;
  transition: box-shadow 0.3s;
}

@media (max-width: 519px) {
  .commodity {
    width: 180px;
    height: 250px;
  }
}

@media (max-width: 383px) {
  .commodity {
    width: 148px;
    height: 230px;
  }
}

.commodity:hover {
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.35);
}

.commodity__picture {
  width: 220px;
  height: 220px;
}

@media (max-width: 519px) {
  .commodity__picture {
    width: 180px;
    height: 180px;
  }
}

@media (max-width: 383px) {
  .commodity__picture {
    width: 148px;
    height: 148px;
  }
}

.commodity__name {
  box-sizing: border-box;
  width: 100%;
  margin-top: 5px;
  padding: 0 10px;
  font-size: 12px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.commodity__info {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  box-sizing: border-box;
  width: 100%;
  margin-top: 10px;
  padding: 0 10px;
}

@media (max-width: 519px) {
  .commodity__info {
    padding: 0 5px;
  }
}

@media (max-width: 383px) {
  .commodity__info {
    flex-direction: column;
  }
}

.commodity__price-info {
  display: flex;
  align-items: baseline;
}

.commodity__price {
  margin-right: 5px;
  font-size: 14px;
  color: red;
  font-size: 20px;
}

.commodity__original-price {
  font-size: 13px;
  color: #999;
}

.commodity__days-left {
  font-size: 12px;
  color: #999;
}
</style>
