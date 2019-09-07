<template>
  <div class="pictures-component">
    <div class="pictures" v-if="pictures.length !== 0">
      <div class="picture-main-wrapper">
        <img :src="baseImgUploadedPath + pictures[nowIndex]" class="picture-main" />
      </div>
      <div class="pictures-all">
        <img
          v-for="(pic, index) in filteredPics"
          :src="baseImgUploadedPath + pic"
          class="picture-small"
          :class="index === nowIndex?'picture-small_on':'picture-small_off'"
          @mouseover="nowIndex = index"
          :key="pic"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { baseImgUploadedPath } from '@/config/env'
export default {
  props: {
    pictures: {
      type: Array,
      default: [],
    },
  },
  computed: {
    filteredPics: function() {
      return this.pictures.filter(pic => {
        if (pic) return true
        return false
      })
    },
  },
  data() {
    return {
      baseImgUploadedPath,
      nowIndex: 0,
    }
  },
}
</script>

<style scoped>
.pictures {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.picture-main-wrapper {
  width: 360px;
  height: 360px;
  border: 1px solid #e4e4e4;
  margin-bottom: 30px;
}

@media (max-width: 419px), (min-width: 680px) and (max-width: 799px) {
  .picture-main-wrapper {
    width: 298px;
    height: 298px;
  }
}

.picture-main {
  width: 100%;
  height: 100%;
}

.pictures-all {
  width: 362px;
  display: flex;
  justify-content: space-between;
}

.picture-small {
  width: 60px;
  height: 60px;
}

@media (max-width: 419px), (min-width: 680px) and (max-width: 799px) {
  .pictures-all {
    width: 300px;
  }
  .picture-small {
    width: 50px;
    height: 50px;
  }
}

.picture-small_on {
  opacity: 1;
  border: 1px solid #e60044;
}

.picture-small_off {
  opacity: 0.5;
  border: 1px solid #e4e4e4;
}
</style>
