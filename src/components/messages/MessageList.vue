<template>
  <!-- 无限滚动组件 -->
  <n-infinite-scroll :distance="10" @load="handleLoad" style="height: 100%">
    <!-- 遍历显示每一条消息 -->
    <div v-for="item in items" :key="item.id">
      <MessageItem
        :avatar_url="item.avatar_url"
        :msg_title="item.msg_title"
        :msg="item.msg"
        :msg_type="item.msg_type"
        :id="item.id"
        :userID="item.userID"
        @msgClick="handleMsgClick"
      ></MessageItem>
      <n-divider style="margin: 0" />
    </div>
    <div v-if="loading && !noMore" class="text">加载中...</div>
    <!-- <div v-if="noMore" class="text">我是有底线滴</div>漏出来不是很好看，改为弹窗提示 -->
  </n-infinite-scroll>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import MessageItem from "./MessageItem.vue";
import { getData } from "../../services/getData.ts";
import type { PropType } from "vue";
import Emitter from "../../services/eventEmitter.ts"

const { ID, Category, upDate } = defineProps({
  ID: String,
  Category: {
    type: String as PropType<"Discussion" | "Experiment" | "User">,
    required: true,
  },
  upDate: Number,
});

let items: any = ref([]);
const loading = ref(false); // 用于无限滚动组件判断是否可以获取下一组数据
let noMore = ref(false); // 用于无限滚动组件判断是否已经没有更多数据了
let skip = 0;
let from: any = null;

const emit = defineEmits(["msgClick"]);

function handleMsgClick(id: any) {
  const msg = items.value.find((item: any) => item.id === id);
  emit("msgClick", msg);
}

let i = 0;
// 处理加载事件
const handleLoad = async () => {
  console.log(++i);
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

  const defaultItems = messages.map((message: any) => {
    return {
      id: message.ID,
      avatar_url: computed(() => {
        if (message.Avatar === 0) return "/src/assets/user/default-avatar.png"; //默认头像
        return `http://physics-static-cn.turtlesim.com:80/users/avatars/${message.UserID.slice(0, 4)}/${message.UserID.slice(
          4,
          6
        )}/${message.UserID.slice(6, 8)}/${message.UserID.slice(8, 24)}/${
          message.Avatar
        }.jpg!small.round`;
      }).value,
      msg_title: message.Nickname,
      msg: message.Content,
      userID: message.UserID,
    };
  });

  items.value = [...items.value, ...defaultItems];
  loading.value = false;
  skip += 20;
  // 消息长度不足19说明加载完成，使nativeui不再加载
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
