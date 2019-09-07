<template>
  <div class="sub-header">
    <div class="sub-header__inner">
      <div class="location">
        <i class="location__icon el-icon-location"></i>
        <span class="location__address">{{ addr }}</span>
        <span class="location__seperator">|</span>
        <el-button
          type="text"
          @click="$router.push({ path: '/location' })"
          class="location__change-btn"
        >切换地址</el-button>
      </div>
      <div class="search">
        <input
          type="text"
          placeholder="搜索商品，商店..."
          v-model="searchContent"
          class="search__input"
          @keyup.enter="toSearchPage"
        />
        <button type="button" class="search__btn" @click="toSearchPage">
          <i class="el-icon-search"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      searchContent: '',
    }
  },
  computed: {
    ...mapGetters(['addr']),
  },
  methods: {
    toSearchPage() {
      if (this.searchContent) {
        this.$router.push({
          path: '/search',
          query: {
            keywords: this.searchContent,
          },
        })
        this.searchContent = ''
      } else {
        this.$router.push({ path: '/home' })
      }
    },
  },
}
</script>

<style scoped>
.sub-header {
  box-sizing: border-box;
  width: 100%;
  padding: 20px;
}

@media (max-width: 479px) {
  .sub-header {
    padding: 5px;
  }
}

.sub-header__inner {
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
}

@media (max-width: 479px) {
  .sub-header__inner {
    flex-direction: column;
    align-items: center;
    padding: 5px;
  }
}
/* location */
.location {
  display: flex;
  align-items: center;
}

@media (max-width: 479px) {
  .location {
    margin-bottom: 5px;
  }
}

.location__icon {
  color: #e60044;
}

.location__address {
  max-width: 160px;
  margin-left: 5px;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 699px) {
  .location__address {
    max-width: 90px;
  }
}

@media (max-width: 479px) {
  .location__address {
    max-width: 160px;
  }
}

.location__seperator {
  width: 20px;
  text-align: center;
}

.location__change-btn {
  padding: 0;
  font-size: 12px;
  color: #e60044;
}

.location__change-btn:hover {
  color: #e60044;
}
/* search */
.search__input {
  position: relative;
  right: -1px;
  box-sizing: border-box;
  width: 260px;
  height: 40px;
  padding-left: 15px;
  vertical-align: middle;
  border: 1px solid #e60044;
}

@media (max-width: 699px) {
  .search__input {
    width: 150px;
  }
}

@media (max-width: 479px) {
  .search__input {
    width: 250px;
  }
}

.search__btn {
  width: 50px;
  height: 40px;
  padding: 10px 15px;
  vertical-align: middle;
  font-size: 18px;
  background-color: #fff;
  border: 1px solid #e60044;
  border-radius: 0;
  cursor: pointer;
}
</style>
