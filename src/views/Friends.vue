<template>
  <Header>
    <h1>好友</h1>
  </Header>
  <div class="list">
    <n-tabs default-value="following" justify-content="space-evenly" type="line">
      <n-tab-pane name="following" tab="关注">
        <div class="item"><UserList :userid="userID" type="1" :cols="itemsPerRow" /></div>
      </n-tab-pane>
      <n-tab-pane name="follower" tab="粉丝">
        <div class="item"><UserList :userid="userID" type="0" :cols="itemsPerRow" /></div>
      </n-tab-pane>
      <n-tab-pane name="volunteers" tab="志愿者">
        <div class="item"><UserList :userid="userID" type="3" :cols="itemsPerRow" /></div>
      </n-tab-pane>
      <n-tab-pane name="editors" tab="编辑和管理员">
        <div class="item"><UserList :userid="userID" type="4" :cols="itemsPerRow" /></div>
      </n-tab-pane>
      <n-tab-pane name="en" tab="荣休编辑">
        <div class="item"><UserList :userid="userID" type="5" :cols="itemsPerRow" /></div>
      </n-tab-pane>
      <n-tab-pane name="baned" tab="小黑屋">
        <div class="item"><UserList :userid="userID" type="2" :cols="itemsPerRow" /></div>
      </n-tab-pane>
    </n-tabs>
  </div>
  <Footer />
</template>

<script setup lang="ts">
import UserList from "../components/friends/list.vue";
import Header from "../components/utils/Header.vue";
import Footer from "../components/utils/Footer.vue";
import { NTabs, NTabPane } from "naive-ui";
import { useResponsive } from "../layout/useResponsive";
import storageManager from "../services/storage";

const userID = storageManager.getStr("userID").value as string;
const{ itemsPerRow} = useResponsive()
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
