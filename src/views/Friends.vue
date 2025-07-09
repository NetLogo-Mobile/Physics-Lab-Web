<template>
  <Header>
    <h1>{{ t("friends.title") }}</h1>
  </Header>
  <div class="list">
    <n-tabs
      default-value="following"
      justify-content="space-evenly"
      type="line"
    >
      <n-tab-pane name="following" :tab="t('friends.following')">
        <div class="item">
          <UserList :userid="userID" type="1" :cols="itemsPerRow" />
        </div>
      </n-tab-pane>
      <n-tab-pane name="follower" :tab="t('friends.follower')">
        <div class="item">
          <UserList :userid="userID" type="0" :cols="itemsPerRow" />
        </div>
      </n-tab-pane>
      <n-tab-pane name="volunteers" :tab="t('friends.volunteers')">
        <div class="item">
          <UserList :userid="userID" type="3" :cols="itemsPerRow" />
        </div>
      </n-tab-pane>
      <n-tab-pane name="editors" :tab="t('friends.editors')">
        <div class="item">
          <UserList :userid="userID" type="4" :cols="itemsPerRow" />
        </div>
      </n-tab-pane>
      <n-tab-pane name="en" :tab="t('friends.retired')">
        <div class="item">
          <UserList :userid="userID" type="5" :cols="itemsPerRow" />
        </div>
      </n-tab-pane>
      <n-tab-pane name="baned" :tab="t('friends.baned')">
        <div class="item">
          <UserList :userid="userID" type="2" :cols="itemsPerRow" />
        </div>
      </n-tab-pane>
    </n-tabs>
  </div>
  <Footer />
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import UserList from "../components/friends/list.vue";
import Header from "../components/utils/Header.vue";
import Footer from "../components/utils/Footer.vue";
import { NTabs, NTabPane } from "naive-ui";
import { useResponsive } from "../layout/useResponsive";
import storageManager from "../services/storage";
const userID = storageManager.getStr("userID").value as string;
const { itemsPerRow } = useResponsive();
const { t } = useI18n();
</script>

<style scoped>
.list {
  width: 100%;
  margin-top: 50px;
}

.item {
  position: absolute;
  width: 100%;
  height: calc(100% - 170px);
  overflow-x: hidden;
  background-color: #ccc3;
}
</style>
