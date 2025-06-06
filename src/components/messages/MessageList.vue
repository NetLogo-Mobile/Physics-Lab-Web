<template>
  <InfiniteScroll :has-more="!noMore" :initial-items="items" @load="handleLoad">
    <template #default="{ items }">
      <div v-for="item in items as MessageItem[]" :key="item.id">
        <MessageItem
          :message="item"
          @msgClick="handleMsgClick"
          @deleteMsg="deleteMsg"
        />
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

interface MessageItem {
  id: string;
  userID: string;
  msg_title: string;
  msg: string;
  type: string;
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
const loading = ref(false);
let noMore = ref(false);
let skip = 0;
let from: any = null;

const emit = defineEmits(["msgClick"]);

function deleteMsg(message: MessageItem) {
  items.value = items.value.filter((item: any) => item.id !== message.id);
}

function handleMsgClick(message: MessageItem) {
  emit("msgClick", message);
}

const handleLoad = async () => {
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
  !from || messages.shift();
  from = messages[messages.length - 1]?.ID;

  const defaultItems = messages.map(
    (message: any): MessageItem => ({
      id: message.ID,
      userID: message.UserID,
      msg_title: message.Nickname,
      msg: message.Content,
      type: Category,
    })
  );

  items.value = [...items.value, ...defaultItems];
  loading.value = false;
  skip += 20;
  if (_length < 20) {
    noMore.value = true;
    Emitter.emit("warning", "没有更多了", 1);
  }
};

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
