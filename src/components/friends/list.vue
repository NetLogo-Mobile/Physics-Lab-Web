<template>
  <infiniteScroll
    :initial-items="items"
    :has-more="!noMore"
    :margin-top="-200"
    @load="handleLoad"
  >
    <template #default="{ items }">
      <n-grid :cols="cols || 2">
        <n-gi v-for="user in items as User[]" :key="user.User.ID">
          <UserItem :user="user.User" />
        </n-gi>
      </n-grid>
    </template>
  </infiniteScroll>
</template>

<script setup lang="ts">
import UserItem from "./item.vue";
import { NGrid, NGi } from "naive-ui";
import { ref } from "vue";
import { getData } from "../../services/api/getData.ts";
import Emitter from "../../services/eventEmitter";
import infiniteScroll from "../utils/infiniteScroll.vue";

interface User {
  User: any;
}

// cols需要在父组件传参，这可能会在好友界面和Profile界面（未实现）展现
//  Props `cols` needs to be passed from the parent component, which may be displayed in the Friends page and Profile page (not implemented yet).
const { userid, type } = defineProps({
  userid: String,
  type: String,
  cols: Number,
});

let loading = ref(false);
let skip = 0;
let noMore = false;
let hasInformed = false;
const items = ref<User[]>([]);

async function handleLoad() {
  loading.value = true;
  if (noMore) {
    if (!hasInformed) Emitter.emit("warning", "没有更多了", 1);
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
    noMore = true;
  }
  loading.value = false;
  skip += 24;
  items.value = [...items.value, ...getRelationsRes.Data.$values];
}

handleLoad();
</script>

<style scoped></style>
