<template>
  <Header>
    <h1>好友</h1>
  </Header>
  <div class="list">
    <n-tabs default-value="following" justify-content="space-evenly" type="line">
      <n-tab-pane name="following" tab="关注">
        <div class="item"><UserList :userid="userID" type="1" :cols="itemsPerRow" :height="`calc(100dvh - 180px)`" /></div>
      </n-tab-pane>
      <n-tab-pane name="follower" tab="粉丝">
        <div class="item"><UserList :userid="userID" type="0" :cols="itemsPerRow" :height="`calc(100dvh - 180px)`" /></div>
      </n-tab-pane>
      <n-tab-pane name="volunteers" tab="志愿者">
        <div class="item"><UserList :userid="userID" type="3" :cols="itemsPerRow" :height="`calc(100dvh - 180px)`" /></div>
      </n-tab-pane>
      <n-tab-pane name="editors" tab="编辑和管理员">
        <div class="item"><UserList :userid="userID" type="4" :cols="itemsPerRow" :height="`calc(100dvh - 180px)`" /></div>
      </n-tab-pane>
      <n-tab-pane name="en" tab="荣休编辑">
        <div class="item"><UserList :userid="userID" type="5" :cols="itemsPerRow" :height="`calc(100dvh - 180px)`" /></div>
      </n-tab-pane>
      <n-tab-pane name="baned" tab="小黑屋">
        <div class="item"><UserList :userid="userID" type="2" :cols="itemsPerRow" :height="`calc(100dvh - 180px)`" /></div>
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
import { onMounted, onUnmounted, ref } from "vue";

const userID = localStorage.getItem("userID") as string;
const itemsPerRow = ref(getItemsPerRow());

function getItemsPerRow() {
  const width = window.innerWidth;
  return width >= 800 ? 3 : 2;
}

const handleResize = () => {
  itemsPerRow.value = getItemsPerRow();
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.list {
  margin-top: 50px;
  height: calc(100dvh - 100px);
}

.item {
  overflow-y: scroll;
  background-color: #ccc3;
}
</style>
