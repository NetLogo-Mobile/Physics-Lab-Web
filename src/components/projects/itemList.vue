<template>
  <infiniteScroll :initial-items="items" :has-more="!noMore" @load="handleLoad">
    <template #default="{ items }">
      <n-grid :cols="row || 3" :x-gap="16" :y-gap="16" responsive="screen">
        <n-gi v-for="item in items as Item[]" :key="item.ID">
          <Works :item="item as Item" />
        </n-gi> </n-grid
    ></template>
  </infiniteScroll>
</template>

<script setup lang="ts">
import { NGrid, NGi } from "naive-ui";
import Works from "./item.vue";
import { ref } from "vue";
import { getData } from "../../services/api/getData.ts";
import Emitter from "../../services/eventEmitter.ts";
import infiniteScroll from "../utils/infiniteScroll.vue";

interface Item {
  ID: string;
  avatar_url: string;
  msg_title: string;
  msg: string;
  userID: string;
}

const { q } = defineProps({
  row: Number,
  q: Object,
});

const loading = ref(true);
const items = ref<Item[]>([]);
const from = ref("");
const isGettingData = ref(false);

let skip = 0;
let noMore = false;
let hasInformed = false;

async function handleLoad() {
  if (noMore) {
    if (!hasInformed) Emitter.emit("warning", "没有更多了", 1);
    hasInformed = true;
    return;
  }
  if (isGettingData.value === true) return;

  isGettingData.value = true;

  // 这里展示了全部可用参数
  // Here all available parameters are shown
  const getProjectsRes = await getData("/Contents/QueryExperiments", {
    Query: {
      Category: "Discussion",
      Languages: [],
      ExcludeLanguages: null,
      Tags: ["精选"],
      ModelTags: null,
      ExcludeTags: null,
      ModelID: null,
      ParentID: null,
      UserID: null,
      Special: null,
      From: from.value === "" ? null : from.value,
      Skip: skip,
      Take: 24,
      Days: 0,
      Sort: 0,
      ShowAnnouncement: false,
      ...q,
    },
  });
  if (getProjectsRes.Data.$values.length < 24) {
    noMore = true;
  }
  skip += 24;
  items.value.push(...getProjectsRes.Data.$values);
  from.value = items.value[items.value.length - 1]?.ID;
  isGettingData.value = false;
}

handleLoad();
loading.value = false;
</script>

<style scoped>
.loading {
  position: fixed;
  top: 70px;
  left: 0;
  width: 100%;
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("/assets/messages/Message-Default.png");
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
}
</style>
