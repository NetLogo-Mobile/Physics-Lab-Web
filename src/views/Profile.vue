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
          <img
            src="/assets/library/Navigation-Return.png"
            style="width: 2.7em"
            class="return"
            @click="goBack"
          />
          <div style="color: white; font-size: 2em; text-align: left">
            {{ userData.User.Nickname }}
          </div>
          <Tag
            category="User"
            :tag="
              userData.User?.Verification
                ? 'C-' + userData.User?.Verification
                : 'C-user'
            "
            style="color: aquamarine; font-weight: bold"
          ></Tag>
          <Tag
            category="User"
            :tag="
              t('profile.fans', { count: userData.Statistic.FollowerCount })
            "
          ></Tag>
          <Tag
            category="User"
            :tag="
              t('profile.follows', { count: userData.Statistic.FollowingCount })
            "
          ></Tag>
        </div>
        <div v-if="userData.Statistic?.Cover" class="coverProject">
          <router-link
            :to="
              '/experimentSummary/' +
              userData.Statistic.Cover?.Category +
              '/' +
              userData.Statistic.Cover?.ID
            "
            style="
              color: white;
              text-align: left;
              text-decoration: none;
              z-index: 30;
              position: relative;
            "
          >
            <p style="margin: 0; font-size: smaller">
              {{ t("profile.coverTip") }}
            </p>
            <p style="margin: 0; font-size: medium">
              {{ userData.Statistic.Cover?.Subject }}
            </p>
          </router-link>
        </div>
      </div>
    </template>
    <template #right>
      <div style="text-align: center; height: 100%">
        <n-tabs
          v-model:value="selectedTab"
          justify-content="space-evenly"
          type="line"
        >
          <n-tab-pane name="Intro" :tab="t('profile.works')" animated>
            <div id="project-list" class="projects">
              <div v-for="[t, d] in Object.entries(expData)" :key="t">
                <Block
                  v-if="d.length > 0"
                  :title="t"
                  :data="d"
                  :block-type="d[0].Category"
                  :link="EncodeAPITargetLink(getLink(t))"
                />
              </div>
            </div>
          </n-tab-pane>
          <n-tab-pane
            name="Comment"
            :tab="
              t('profile.comments', { count: userData.Statistic.CommentCount })
            "
          >
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
                  :loading="isLoading"
                  @keyup.enter="handleEnter"
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
import { getData } from "../services/api/getData.ts";
import { NTabs, NTabPane } from "naive-ui";
import Tag from "../components/utils/TagLarger.vue";
import MessageList from "../components/messages/MessageList.vue";
import Block from "../components/blocks/Block.vue";
import postComment from "../services/postComment.ts";
import Adaptation from "../layout/Adaptation.vue";
import "../layout/AdaptationView.css";
import { getCoverUrl, getUserUrl } from "../services/utils.ts";
import { useI18n } from "vue-i18n";
import { EncodeAPITargetLink } from "../services/utils.ts";

const { t } = useI18n();
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
  // Civitas-john always procrastinate on addressing the request to solve the anti-leeching issue.
  // That's why the below occurs
  await fetch(getCoverUrl(userData.value.Statistic.Cover), {
    referrerPolicy: "no-referrer",
    mode: "no-cors",
  });
  coverUrl.value = userData.value.Statistic.Cover
    ? getCoverUrl(userData.value.Statistic.Cover)
    : getUserUrl(userRes.Data.User);
  window.$Logger.logPageView({
    pageLink: `/User/${route.params.id}/`,
    timeStamp: Date.now(),
  });
});

function handleMsgClick(item: any) {
  replyID.value = item.userID;
  comment.value = `回复@${item.msg_title}: `;
}

async function handleEnter() {
  await postComment(
    comment,
    isLoading,
    "User",
    route.params.id as string,
    replyID,
    upDate,
  );
}

function goBack() {
  window.history.back();
}

function getLink(name: string) {
  switch (name) {
    case "Latest-Experiments":
      return `experiments://UserID/${route.params.id}`;
    case "Featured-Experiments":
      return `experiments://UserID/${route.params.id}/Tags/精选`;
    case "Latest-Discussions":
      return `discussions://UserID/${route.params.id}`;
    case "Featured-Discussions":
      return `discussions://UserID/${route.params.id}/Tags/精选`;
    case "Popular-Discussions":
      return `discussions://UserID/${route.params.id}/Sort/2`;
    case "Popular-Experiments":
      return `experiments://UserID/${route.params.id}/Sort/2`;
    default:
      return `discussions://user${route.params.id}`;
  }
}
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
  width: 95%;
  height: calc(100% - 50px);
  margin: 5px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  overflow-y: scroll;
  padding-bottom: 50px;
  scrollbar-width: none;
}

.coverProject {
  position: absolute;
  bottom: 30px;
  left: 20px;
  right: 20px;
  color: white;
  height: 55px;
  background-color: rgba(128, 128, 128, 0.4);
  border-radius: 10px;
  padding: 8px;
}

@media (max-aspect-ratio: 1/1) {
  .return {
    display: none;
  }
}

div {
  box-sizing: border-box;
}
</style>
