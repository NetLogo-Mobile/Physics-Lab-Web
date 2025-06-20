<template>
  <Header>
    <h1>{{ t("notifications.title") }}</h1>
  </Header>
  <main>
    <div class="outer">
      <n-tabs type="line" animated justify-content="space-evenly">
        <n-tab-pane name="全部" :tab="t('notifications.all')">
          <div class="item">
            <NotificationList notificationTypeIndexOfUI="0"></NotificationList>
          </div>
        </n-tab-pane>
        <n-tab-pane name="系统消息" :tab="t('notifications.system')">
          <div class="item">
            <NotificationList notificationTypeIndexOfUI="1"></NotificationList>
          </div>
        </n-tab-pane>
        <n-tab-pane name="回复和评论" :tab="t('notifications.comments')">
          <div class="item">
            <NotificationList notificationTypeIndexOfUI="3"></NotificationList>
          </div>
        </n-tab-pane>
        <n-tab-pane name="关注和粉丝" :tab="t('notifications.friends')">
          <div class="item">
            <NotificationList notificationTypeIndexOfUI="2"></NotificationList>
          </div>
        </n-tab-pane>
        <n-tab-pane name="作品" :tab="t('notifications.works')">
          <div class="item">
            <NotificationList notificationTypeIndexOfUI="4"></NotificationList>
          </div>
        </n-tab-pane>
        <n-tab-pane name="管理通知" :tab="t('notifications.admin')">
          <div class="item">
            <NotificationList notificationTypeIndexOfUI="5"></NotificationList>
          </div>
        </n-tab-pane>
      </n-tabs>
    </div>
  </main>
  <Footer></Footer>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();
import NotificationList from "../components/messages/NotificationList.vue";
import Header from "../components/utils/Header.vue";
import Footer from "../components/utils/Footer.vue";
</script>

<style scoped>
.outer {
  margin-top: 50px;
}

.item {
  box-sizing: border-box;
  height: calc(100dvh - 150px);
}

@media (min-aspect-ratio: 1/1) {
  .item {
    padding-left: 20px;
  }
}
</style>
