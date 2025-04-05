<template>
  <Adaptation>
    <template #left>
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
          <img src="/assets/library/Navigation-Return.png" style="width: 2.7em" @click="goBack" />
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
            position: absolute;
            bottom: 30px;
            left: 20px;
            right: 20px;
            color: white;
            height: 55px;
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
    </template>
    <template #right>
      <div style="text-align: center; height: 100%">
        <n-tabs v-model:value="selectedTab" justify-content="space-evenly" type="line">
          <n-tab-pane name="Intro" tab="作品" animated>
            <div class="projects" id="project-list">
              <div v-for="[t, d] in Object.entries(expData)" :key="t">
                <Block v-if="d.length > 0" :title="t" :data="d" :block-type="d[0].Category" />
              </div>
            </div>
          </n-tab-pane>
          <n-tab-pane name="Comment" :tab="`留言板(${userData.Statistic.CommentCount})`">
            <div class="right-bottom-container">
              <div class="message-wrapper">
                <MessageList
                  :ID="route.params.id as string"
                  Category="User"
                  :upDate="upDate"
                  @msgClick="handleMsgClick"
                />
              </div>
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
    </template>
  </Adaptation>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getData } from "../services/getData.ts";
import { NTabs, NTabPane } from "naive-ui";
import Tag from "../components/utils/TagLarger.vue";
import MessageList from "../components/messages/MessageList.vue";
import Block from "../components/blocks/Block.vue";
import postComment from "../services/postComment.ts";
import Adaptation from "../layout/Adaptation.vue";
import "../layout/AdaptationView.css";

let comment = ref("");
let isLoading = ref(false);
let upDate = ref(1);
let replyID = ref("");

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
  const userRes = await getData(`/Users/GetUser`, {
    ID: route.params.id,
  });
  userData.value = userRes.Data;
  console.log(userData.value);
  const coverID = userData.value.Statistic.Cover.ID;
  coverUrl.value = `/static/experiments/images/${coverID.slice(0, 4)}/${coverID.slice(
    4,
    6
  )}/${coverID.slice(6, 8)}/${coverID.slice(8, 24)}/${
    userData.value.Statistic.Cover.Image
  }.jpg!full`;
});

function handleMsgClick(item: any) {
  replyID.value = item.userID;
  comment.value = `回复@${item.msg_title}: `;
}
const handleEnter = async () => {
  await postComment(comment, isLoading, "User", route.params.id as string, replyID, upDate);
};

const goBack = () => {
  window.history.back();
};
</script>

<style scoped>
.cover {
  position: absolute;
  height: 100%;
  width: 100%;
  padding: 20px;
}

.projects {
  position: absolute;
  width: 100%;
  height: calc(100% - 50px);
  display: flex;
  flex-direction: column;
  gap: 5px;
  overflow-y: scroll;
  padding-bottom: 50px;
}
</style>
