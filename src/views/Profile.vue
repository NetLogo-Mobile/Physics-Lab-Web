<template>
  <div class="container">
    <div
      class="cover"
      :style="{
        backgroundImage: `url(${coverUrl})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }"
    >
      <div style="text-align: left; z-index: 10; position: relative">
        <img src="/src/assets/library/Navigation-Return.png" style="width: 2.7em" @click="goBack" />
        <div style="color: white; font-size: 2em; text-align: left">
          {{ userData.User.Nickname }}
        </div>
        <Tag
          :tag="userData.User?.Verification || 'user'"
          style="color: aquamarine; font-weight: bold"
        ></Tag>
        <Tag :tag="'粉丝 ' + userData.Statistic.FollowerCount"></Tag>
        <Tag :tag="'关注 ' + userData.Statistic.FollowingCount"></Tag>
      </div>
      <div
        style="
          margin-top: auto;
          color: white;
          height: 40px;
          background-color: rgba(128, 128, 128, 0.4);
          border-radius: 10px;
          padding: 8px;
        "
      >
        <router-link
          :to="
            '/experimentSummary/' +
            userData.Statistic.Cover.Category +
            '/' +
            userData.Statistic.Cover.ID
          "
          style="
            color: white;
            text-align: left;
            text-decoration: none;
            z-index: 30;
            position: relative;
          "
        >
          <p style="margin: 0; font-size: smaller">点击进入封面作品</p>
          <p style="margin: 0; font-size: medium">{{ userData.Statistic.Cover.Subject }}</p>
        </router-link>
      </div>
    </div>

    <div style="text-align: center" class="context">
      <n-tabs v-model:value="selectedTab" justify-content="space-evenly" type="line">
        <n-tab-pane name="Intro" tab="作品">
          <div style="display: flex; flex-direction: column; gap: 5px" class="message-list">
            <div v-for="[t, d] in Object.entries(expData)" :key="t">
              <Block v-if="d.length > 0" :title="t" :data="d" :block-type="d[0].Category" />
            </div>
          </div>
        </n-tab-pane>
        <n-tab-pane name="Comment" :tab="`留言板(${userData.Statistic.CommentCount})`">
          <div class="message-list">
            <MessageList
              :ID="route.params.id as string"
              Category="User"
              :upDate="upDate"
              @msgClick="handleMsgClick"
            ></MessageList>
            <div class="sendComment">
              <n-input
                v-model:value="comment"
                style="text-align: left"
                type="text"
                placeholder="发布一条友善的言论"
                show-count
                :maxlength="200"
                @keyup.enter="handleEnter"
                :loading="isLoading"
              />
            </div>
          </div>
        </n-tab-pane>
      </n-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getData } from "../services/getData.ts";
import { NTabs, NTabPane } from "naive-ui";
import Tag from "../components/utils/TagLarger.vue";
import MessageList from "../components/messages/MessageList.vue";
import Block from "../components/Block.vue";
import Emitter from "../services/eventEmitter";

let comment = ref("");
let isLoading = ref(false);
let upDate = ref(1);
let replyID = "";

const selectedTab = ref("Intro");
const route = useRoute();

let coverUrl = ref("");

let userData = ref({
  User: {
    ID: "",
    Nickname: "Loading...",
    Signature: "",
    Verification: "loading...",
    Avatar: 322,
    AvatarRegion: 0,
    Decoration: 0,
    Gold: 17900,
    Diamond: 2683,
    Fragment: 116,
    Level: 25,
    Experience: 62225,
    Prestige: 18,
    Subscription: 1,
    SubscriptionUntil: "",
    IsBinded: true,
    Regions: [1],
  },
  Statistic: {
    Cover: {
      ID: "",
      Category: "",
      Subject: "",
      Image: 1,
    },
    CommentCount: 0,
    ExperimentCount: 0,
    FollowerCount: 0,
    FollowingCount: 0,
  },
});

interface ExpDataType {
  [key: string]: any[];
}
let expData = ref<ExpDataType>({});

onMounted(async () => {
  const expRes = await getData(`/Contents/GetProfile`, {
    ID: route.params.id,
  });
  expData.value = expRes.Data.Experiments;
  console.log(expRes);
  const userRes = await getData(`/Users/GetUser`, {
    ID: route.params.id,
  });
  console.log(userRes);
  userData.value = userRes.Data;
  const coverID = userData.value.Statistic.Cover.ID;
  coverUrl.value = `http://physics-static-cn.turtlesim.com:80/experiments/images/${coverID.slice(0, 4)}/${coverID.slice(
    4,
    6
  )}/${coverID.slice(6, 8)}/${coverID.slice(8, 24)}/${
    userData.value.Statistic.Cover.Image
  }.jpg!full`;
});

function handleMsgClick(item: any) {
  replyID = item.userID;
  comment.value = `回复@${item.msg_title}: `;
}
// 处理回车键按下事件
const handleEnter = async () => {
  isLoading.value = true; // 设置 loading 状态为 true
  const sendCommentResponse = await getData("/Messages/PostComment", {
    TargetID: route.params.id,
    TargetType: "User",
    Content: comment.value || "",
    ReplyID: replyID || "",
    Language: "from web",
    Special: null,
  });
  if (sendCommentResponse.Status == 200) {
    comment.value = "";
    upDate.value = Math.random();
  } else {
    if (
      sendCommentResponse.Status == 403 &&
      sendCommentResponse.Message.startsWith("Stopword.Blocked")
    ) {
      const index = Number(
        "Stopword.Blocked.Details|0".slice("Stopword.Blocked.Details|0".indexOf("|") + 1)
      );
      const blockedMessage = comment.value.slice(index, 10);
      Emitter.emit("error", `您输入的内容“...${blockedMessage}...”中包含不适合词句`, 1);
    }
  }
  isLoading.value = false;
};

const goBack = () => {
  window.history.back();
};
</script>

<style scoped>
/* width > height
   */
@media (min-aspect-ratio: 1/1) {
  .cover {
    height: 98%;
  }
  .context {
    height: 100%;
    overflow: scroll;
    scrollbar-width: none;
  }
  .container {
    flex-direction: row;
  }
  .sendComment {
    width: 50%;
  }
  #gap {
    height: 20vh;
  }
  .cover::before {
    width: calc(50dvw + 20px);
    height: 100%;
  }
  .message-list {
    height: calc(100dvh - 100px);
  }
}

/* width < height 竖屏
   */
@media (max-aspect-ratio: 1/1) {
  .cover {
    flex-basis: 30vh;
  }
  #gap {
    height: 5vh;
  }
  .context {
    flex-grow: 2;
    flex-basis: 70vh;
  }
  .container {
    flex-direction: column;
  }
  .sendComment {
    width: 100dvw;
  }
  .cover::before {
    width: 100dvw;
    height: 60%;
  }
  .message-list {
    height: calc(66dvh - 90px);
  }
}

.message-list {
  width: 100%;
  overflow-x: hidden;
}

.cover::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  background: linear-gradient(to bottom, rgba(128, 128, 128, 0.4) 20%, rgba(128, 128, 128, 0) 50%);
  pointer-events: none;
  border-radius: 8px;
  z-index: 1;
}

.container {
  height: 100dvh;
  width: 100dvw;
  display: flex;
  box-sizing: border-box;
}

.cover {
  object-fit: cover;
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.context {
  /* overflow: scroll; */
  flex: 1;
  box-sizing: border-box;
}

.sendComment {
  height: 40px;
  position: fixed;
  background-color: #ddd;
  bottom: 0;
  box-sizing: border-box;
  padding: 2px 20px;
}

div {
  box-sizing: border-box;
}
</style>
