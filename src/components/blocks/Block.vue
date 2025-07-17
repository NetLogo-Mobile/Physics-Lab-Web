<template>
  <div class="outer">
    <div class="head">
      <!-- title的i18n应当是服务器返回自动i处理的 -->
      <!-- The title should be processed automatically by the server for i18n -->
      <div id="title">{{ title }}</div>
      <router-link id="more" :to="`/list/${link}`">
        <div>{{ $t("worklist.more") }}</div>
      </router-link>
    </div>
    <div style="display: flex; flex-direction: column; gap: 10px">
      <Detailed v-for="(item, index) in data" :key="index" :data="item" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Detailed from "../projects/detailed.vue";
const { link } = defineProps<{
  data: any[];
  title: string;
  type?: string;
  link: string;
}>();
</script>

<style scoped>
.outer {
  height: 100%;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
  padding: 10px;
}

.head {
  display: flex;
}

.head {
  font-size: 15px;
  color: #007bff;
  width: 100%;
  padding: 8px;
}

#title {
  align-self: flex-start;
  font-weight: bold;
}

#more {
  text-decoration: none;
  color: #007bff;
  align-self: flex-end;
  margin-left: auto;
  margin-right: 20px;
}

.div {
  box-sizing: border-box;
}
</style>
