<template>
  <div class="loading" v-if="loading"></div>
  <div v-else>
    <n-infinite-scroll :distance="10" @load="handleLoad" style="height: 80dvh;">
      <n-grid :cols="row || 3" :x-gap="16" :y-gap="16" responsive="screen">
        <n-gi v-for="item in worksItems" :key="item.id">
          <Works :item="item as any" />
        </n-gi>
      </n-grid>
    </n-infinite-scroll>
    <div v-if="isGettingData">加载中...</div>
  </div>
</template>

<script setup lang="ts">
import { NGrid, NGi, NInfiniteScroll } from "naive-ui";
import Works from "./item.vue";
import { ref } from "vue";
import { getData } from "../../services/getData";
import Emitter from "../../services/eventEmitter";

const { q } = defineProps({
  row: Number,
  q: Object,
});

const loading = ref(true);
const worksItems = ref<any>([]);
const from = ref("");
const isGettingData = ref(false);

let skip = 0;
let isLoadEnd = false;
let hasInformed = false;

async function handleLoad() {
  if (isLoadEnd) {
    hasInformed || Emitter.emit("warning", "没有更多了", 1);
    hasInformed = true;
    return;
  }
  if (isGettingData.value === true) return;

  isGettingData.value = true;

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
  console.log(getProjectsRes);
  skip += 24;
  worksItems.value.push(...getProjectsRes.Data.$values);

  from.value = worksItems.value[worksItems.value.length - 1]?.ID;
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
  background-image: url("/src/assets/messages/Message-Default.png");
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
}
</style>
