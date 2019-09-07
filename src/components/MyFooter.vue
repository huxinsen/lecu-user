<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer-links">
        <div class="footer-link-group">
          <a class="footer-link" href="#">我要开店</a>
          <a class="footer-link" href="#">加盟指南</a>
          <a class="footer-link" href="#">市场合作</a>
          <a class="footer-link" href="#">开放平台</a>
        </div>
        <div class="footer-link-group">
          <a class="footer-link" href="#">关于乐促</a>
          <a class="footer-link" href="#">平台规则</a>
          <a class="footer-link" href="#">媒体报道</a>
          <a class="footer-link" href="#">加入我们</a>
        </div>
        <div class="footer-link-group">
          <a class="footer-link" href="#">常见问题</a>
          <a class="footer-link" href="#">用户反馈</a>
          <a class="footer-link" href="#">诚信举报</a>
          <a class="footer-link" href="#">联系我们</a>
        </div>
      </div>
      <div class="logo">
        <img src="../assets/footer-logo.png" alt="乐促：更多折扣，更好生活" />
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  width: 100%;
  background-color: #fff;
}

.footer__inner {
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  max-width: 1000px;
  margin: auto;
}

@media (max-width: 499px) {
  .footer__inner {
    flex-direction: column;
  }
}

.footer-links {
  flex: 1;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  max-width: 400px;
  padding: 30px;
}

@media (max-width: 499px) {
  .footer-links {
    order: 2;
    width: 100%;
    padding-top: 0;
  }
}

.footer-link-group {
  display: flex;
  flex-direction: column;
}

.footer-link {
  margin: 5px;
  font-size: 12px;
  text-decoration: none;
  color: #808080;
}

@media (max-width: 499px) {
  .logo {
    order: 1;
  }
}
</style>