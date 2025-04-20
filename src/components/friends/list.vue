<template>
  <n-infinite-scroll :distance="10" @load="handleLoad" >
    <n-grid :cols="cols || 2">
      <n-gi v-for="user in relations" :key="user.User.ID">
        <UserItem :user="user.User" />
      </n-gi>
    </n-grid>
  </n-infinite-scroll>
</template>
<script setup lang="ts">
import UserItem from "./item.vue";
import { NInfiniteScroll, NGrid, NGi } from "naive-ui";
import { ref } from "vue";
import { getData } from "../../services/api/getData.ts";
import Emitter from "../../services/eventEmitter";

const { userid, type } = defineProps({
  userid: String,
  type: String,
  cols: Number,
});

let relations = ref<any>([]);
let loading = ref(false);
let skip = 0;
let isLoadEnd = false;
let hasInformed = false;

async function handleLoad() {
  loading.value = true;
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
  loading.value = false;
  skip += 24;
  relations.value.push(...getRelationsRes.Data.$values);
}

handleLoad();
</script>

<style scoped></style>
