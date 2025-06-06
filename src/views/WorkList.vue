<template>
  <Header>
    <img src="/assets/library/Navigation-Return.png" style="width: 2.7em" @click="goBack" />
    <h2 style="margin-right: auto; margin-left: 20px">作品列表</h2>
  </Header>

  <div class="list">
    <WorksList :row="itemsPerRow" :q="decodeString(router.params.config)" />
  </div>
</template>

<script setup lang="ts">
import Header from "../components/utils/Header.vue";
import WorksList from "../components/projects/itemList.vue";
import { onMounted, onUnmounted, ref } from "vue";
import { useRoute } from "vue-router";
const router = useRoute();

const itemsPerRow = ref(getItemsPerRow());

function decodeString(base64Input: any) {
  const latin1String = atob(base64Input.replace(/DEVIDER/g, "/"));
  const utf8Bytes = new Uint8Array([...latin1String].map((char) => char.charCodeAt(0)));
  const jsonString = new TextDecoder().decode(utf8Bytes);
  const result = JSON.parse(jsonString);
  return result;
}
//Calculates the number of Items displayed and loaded at a time.
/**
 * @requires window.innerWidth
 * @returns {int} Number of Items that fits the window
 */
function getItemsPerRow() {
  const width = window.innerWidth;
  switch (true) {
    case width >= 1200:
      return 5;
    case width >= 800:
      return 4;
    case width >= 500:
      return 3;
    default:
      return 2;
  }
}

const handleResize = () => {
  itemsPerRow.value = getItemsPerRow();
};

const goBack = () => {
  window.history.back();
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
  margin-top: 60px;
  padding: 20px;
  width: 100dvw;
  height: calc(100dvh - 60px);
  box-sizing: border-box;
  background-color: #ccc3;
  scrollbar-width: none;
}
</style>
