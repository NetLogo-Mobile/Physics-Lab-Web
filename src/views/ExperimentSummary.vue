<template>
  <Adaptation>
    <template #left>
      <div
        class="cover"
        :style="{
          backgroundImage: `url(${coverUrl})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }"
      >
        <div style="text-align: left">
          <img
            :src="returnImagePath"
            style="width: 2.7em"
            class="return"
            @click="goBack"
          />
          <div class="title" v-html="parseInline(data.Subject)"></div>
          <div style="position: absolute; z-index: 100">
            <Tag
              v-if="route.params.category"
              :tag="('C-' + route.params.category) as string"
              style="color: aquamarine; font-weight: bold"
              :category="data.Category"
            />
            <Tag
              v-for="(tag, index) in data.Tags.filter((t) => !!t)"
              :key="index"
              :tag="tag"
              :category="data.Category"
            />
          </div>
        </div>
        <div style="margin-top: auto">
          <div
            class="btns"
            style="
              display: flex;
              justify-content: center;
              justify-content: space-around;
            "
          >
            <n-button type="info" strong round disabled class="enter">
              {{ t("expeSummary.enterExp") }}
            </n-button>
          </div>
        </div>
      </div>
    </template>

    <template #right>
      <div style="text-align: center" class="context">
        <n-tabs
          v-model:value="selectedTab"
          justify-content="space-evenly"
          type="line"
        >
          <n-tab-pane name="Intro" :tab="t('expeSummary.introTab')">
            <div class="gray">
              <div style="width: 100%; height: fit-content">
                <div
                  style="
                    display: flex;
                    height: 60px;
                    background-color: white;
                    border-radius: 10px;
                    margin: 5px;
                  "
                  @click="showUserCard(data.User.ID)"
                >
                  <img
                    :src="avatarUrl"
                    style="margin: auto 10px; height: 90%; border-radius: 50%"
                  />
                  <div style="text-align: left">
                    <p
                      style="
                        color: #007bff;
                        margin: 2% 0 2% 0;
                        width: 100%;
                        font-size: 16px;
                      "
                    >
                      {{ data.User.Nickname }}
                    </p>
                    <p
                      style="color: gray; margin: 0%; width: 100%"
                      v-html="parseInline(data.User.Signature)"
                    ></p>
                  </div>
                </div>
                <div
                  style="
                    margin-top: 3%;
                    background-color: white;
                    border-radius: 10px;
                    padding: 10px;
                    margin: 5px;
                  "
                >
                  <h3
                    style="
                      color: #007bff;
                      text-align: left;
                      margin-top: 2px;
                      margin-bottom: 2px;
                    "
                  >
                    {{ t("expeSummary.intro") }}
                  </h3>
                  <div
                    style="height: 90%; max-width: 100%; word-break: break-all"
                  >
                    <div
                      class="intro"
                      style="text-align: left; font-size: medium"
                      v-html="parse(data.Description)"
                    ></div>
                    <div style="font-weight: bold; text-align: left">
                      {{ t("expeSummary.wordCount") }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </n-tab-pane>
          <n-tab-pane
            name="Comment"
            :tab="`${t('expeSummary.comments')}(${data.Comments})`"
          >
            <div class="right-bottom-container">
              <div class="message-wrapper">
                <MessageList
                  :ID="route.params.id as string"
                  :Category="
                    route.params.category as
                      | 'Experiment'
                      | 'User'
                      | 'Discussion'
                  "
                  :upDate="upDate"
                  @msgClick="handleMsgClick"
                />
              </div>
              <div class="sendComment">
                <n-input
                  v-model:value="comment"
                  style="text-align: left"
                  type="text"
                  :placeholder="t('comments.placeholder')"
                  show-count
                  :maxlength="400"
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
import { ref, onMounted, onActivated } from "vue";
import { useRoute } from "vue-router";
import { getData } from "../services/api/getData.ts";
import { NTabs, NTabPane } from "naive-ui";
import Tag from "../components/utils/TagLarger.vue";
import MessageList from "../components/messages/MessageList.vue";
import parse from "../services/advancedParser.ts";
import parseInline from "../services/commonParser.ts";
import showUserCard from "../popup/usercard";
import postComment from "../services/postComment.ts";
import "highlight.js/styles/github.css";
import "../../node_modules/katex/dist/katex.min.css";
import { getCoverUrl, getUserUrl } from "../services/utils.ts";
import Adaptation from "../layout/Adaptation.vue";
import "../layout/AdaptationView.css";
import { useI18n } from "vue-i18n";

const comment = ref("");
const isLoading = ref(false);
const upDate = ref(1); // 用于使用watch触发刷新 To trigger a refresh using watch
const replyID = ref("");
const selectedTab = ref("Intro");
const route = useRoute();
const { t } = useI18n();
const returnImagePath = ref(
  window.$getPath("/@base/assets/library/Navigation-Return.png"),
);

const data = ref({
  Type: 0,
  ParentID: null,
  ParentName: null,
  ParentCategory: null,
  ContentID: "642cf37a494746375aae306a",
  Editor: null,
  Coauthors: [],
  Description: ["Loading..."],
  LocalizedDescription: null,
  Tags: ["C-Loading"],
  Visits: 0,
  Stars: 0,
  Supports: 0,
  Remixes: 0,
  Comments: 0,
  Price: 0,
  Popularity: 0,
  ID: "",
  Category: "Discussion",
  Subject: "Loading...",
  LocalizedSubject: null,
  Image: 0,
  ImageRegion: 0,
  User: {
    ID: "0",
    Nickname: "Loading...",
    Signature: "Loading...",
    Avatar: 0,
    AvatarRegion: 0,
    Decoration: 0,
    Verification: "Banned",
  },
});

let coverUrl = ref(
  window.$getPath("/@base/assets/messages/Experiment-Default.png"),
);
let avatarUrl = getUserUrl(data.value.User);

onMounted(async () => {
  const res = await getData(`/Contents/GetSummary`, {
    ContentID: route.params.id,
    Category: route.params.category,
  });
  data.value = res.Data;
  avatarUrl = getUserUrl(data.value.User);
  // Civitas-john always procrastinate on addressing the request to solve the anti-leeching issue.
  // That's why the below occurs
  await fetch(getCoverUrl(res.Data), {
    referrerPolicy: "no-referrer",
    mode: "no-cors",
  });
  coverUrl.value = getCoverUrl(res.Data);
});

function handleMsgClick(item: any) {
  replyID.value = item.userID;
  comment.value = `回复@${item.msg_title}: `;
}

async function handleEnter() {
  await postComment(
    comment,
    isLoading,
    route.params.category as string,
    route.params.id as string,
    replyID,
    upDate,
  );
}

function goBack() {
  window.history.back();
}

onActivated(() => {
  window.$Logger.logPageView({
    pageLink: `/${route.params.category}/${route.params.id}/`,
    timeStamp: Date.now(),
  });
});
</script>

<style scoped>
.title {
  color: white;
  font-size: 1.8em;
  text-align: left;
  position: relative;
  z-index: 30;
}

.cover {
  object-fit: cover;
  padding: 20px;
  position: absolute;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}

.enter {
  display: none;
}

.gray {
  position: absolute;
  width: 98%;
  margin: 5px;
  height: calc(100% - 70px);
  overflow-y: scroll;
  border-radius: 10px;
  background-color: #eee;
  margin-bottom: 10px;
}

@media (min-aspect-ratio: 1/1) {
  .gray {
    width: calc(100% - 30px);
  }

  .title {
    font-size: x-large;
  }

  .enter {
    display: flex;
    position: absolute;
    padding: 10px 10%;
    width: 80%;
    bottom: 50px;
  }
}

@media (max-aspect-ratio: 1/1) {
  .return {
    display: blobk;
    /* 等到做了收藏和支持，这里会被隐藏 */
    /* Wait until you do the collection and support, this will be hidden */
  }
}

.sendComment {
  width: 97%;
  margin: 0 auto;
}

div {
  box-sizing: border-box;
}
</style>
