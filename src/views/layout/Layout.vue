<template>
  <div class="layout">
    <my-header class="header"></my-header>
    <sub-header class="header"></sub-header>
    <main class="content">
      <router-view />
    </main>
    <my-footer></my-footer>
  </div>
</template>

<script>
import MyHeader from '@/components/MyHeader'
import SubHeader from '@/components/SubHeader'
import MyFooter from '@/components/MyFooter'
export default {
  components: {
    MyHeader,
    SubHeader,
    MyFooter,
  },
}
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  background-color: #f5f5f5;
}

.content {
  flex: 1;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto 20px;
}
</style>
