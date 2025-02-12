<template>
  <div class="user-list">
    <n-infinite-scroll :distance="0" @load="handleLoad" style="height: calc(100dvh - 160px);">
      <n-grid :cols="cols || 2">
        <n-gi v-for="user in relations" :key="user.User.ID">
          <UserItem :user="user.User" />
        </n-gi>
      </n-grid>
    </n-infinite-scroll>
  </div>
</template>

<script setup lang="ts">
import UserItem from "./item.vue";
import { NInfiniteScroll, NGrid, NGi } from "naive-ui";
import { ref } from "vue";
import { getData } from "../../services/getData.ts";
import Emitter from "../../services/eventEmitter";

const { userid, type } = defineProps({
  userid: String,
  type: String,
  cols: Number,
});

let relations = ref<any>([]);

let skip = 0;
let isLoadEnd = false;
let hasInformed = false;

async function handleLoad() {
  if (isLoadEnd) {
    hasInformed || Emitter.emit("warning", "没有更多了", 1);
    hasInformed = true;
    return;
  }
  const getRelationsRes = await getData("/Users/GetRelations", {
    UserID: userid,
    DisplayType: type,
    Skip: skip,
    Take: 24,
    Query: "",
  });
  if (getRelationsRes.Data.$values.length < 24) {
    isLoadEnd = true;
  }
  console.log(getRelationsRes.Data);
  skip += 24;
  relations.value.push(...getRelationsRes.Data.$values);
}

handleLoad();
</script>

<style scoped>
.user-list {
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
