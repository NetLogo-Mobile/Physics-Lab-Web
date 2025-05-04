<template>
  <InfiniteScroll :has-more="!noMore" :initial-items="items" @load="handleLoad">
    <template #default="{ items }">
      <div v-for="item in items as MessageItem[]" :key="item.id">
        <MessageItem
          :avatar_url="item.avatar_url"
          :msg_title="item.msg_title"
          :msg="item.msg"
          :msg_type="item.msg_type"
          :id="item.id"
          :userID="item.userID"
          :type="Category"
          @msgClick="handleMsgClick"
          @deleteMsg="deleteMsg"
        ></MessageItem>
        <n-divider style="margin: 0" />
      </div>
    </template>
  </InfiniteScroll>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import MessageItem from "./MessageItem.vue";
import { getData } from "../../services/api/getData.ts";
import type { PropType } from "vue";
import Emitter from "../../services/eventEmitter.ts";
import InfiniteScroll from "../utils/infiniteScroll.vue";
import { getUserUrl } from "../../services/utils";

interface MessageItem {
  id: string;
  avatar_url: string;
  msg_title: string;
  msg: string;
  msg_type?: string;
  userID: string;
}

const { ID, Category, upDate } = defineProps({
  ID: String,
  Category: {
    type: String as PropType<"Discussion" | "Experiment" | "User">,
    required: true,
  },
  upDate: Number,
});

let items = ref<MessageItem[]>([]);

const loading = ref(false); // 用于无限滚动组件判断是否可以获取下一组数据
let noMore = ref(false); // 用于无限滚动组件判断是否已经没有更多数据了
let skip = 0;
let from: any = null;

const emit = defineEmits(["msgClick"]);

function deleteMsg(id: any) {
  items.value = items.value.filter((item: any) => item.id !== id);
}

function handleMsgClick(id: any) {
  const msg = items.value.find((item: any) => item.id === id);
  emit("msgClick", msg);
}

// 处理加载事件
const handleLoad = async () => {
  console.log("handleLoad");
  if (loading.value || noMore.value === true) return;
  loading.value = true;
  const getMessagesResponse = await getData("Messages/GetComments", {
    TargetID: ID,
    TargetType: Category,
    CommentID: from || "",
    Take: 20,
    Skip: skip || 0,
  });

  const messages = getMessagesResponse.Data.Comments;
  const _length = messages.length;
  // 第一条重复的，不要
  !from || messages.shift();
  from = messages[messages.length - 1]?.ID;

  const defaultItems = messages.map(
    (message: any): MessageItem => ({
      id: message.ID,
      avatar_url: getUserUrl({
        Verification: message.Verification,
        Avatar: message.Avatar,
        ID: message.UserID,
      }),
      msg_title: message.Nickname,
      msg: message.Content,
      userID: message.UserID,
    })
  );

  items.value = [...items.value, ...defaultItems];
  loading.value = false;
  skip += 20;
  // 消息长度不足19说明加载完成
  if (_length < 20) {
    noMore.value = true;
    Emitter.emit("warning", "没有更多了", 1);
  }
};

// 初始加载数据
handleLoad();
watch(
  () => upDate,
  () => {
    items.value = [];
    skip = 0;
    from = null;
    handleLoad();
  }
);
</script>

<style scoped>
.text {
  text-align: center;
  color: #888;
}
</style>
