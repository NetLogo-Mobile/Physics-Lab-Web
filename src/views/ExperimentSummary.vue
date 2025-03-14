<template>
  <div class="container">
    <div
      class="cover"
      :style="{
        backgroundImage: `url(${coverUrl})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }"
    >
      <div style="text-align: left">
        <img src="/assets/library/Navigation-Return.png" style="width: 2.7em" @click="goBack" />
        <div
          style="
            color: white;
            font-size: clamp(1.6em, 3.5vw, 2em);
            text-align: left;
            position: relative;
            z-index: 30;
          "
          v-html="parseInline(data.Subject)"
        ></div>

        <Tag
          :tag="route.params.category as string"
          style="color: aquamarine; font-weight: bold"
        ></Tag>
        <Tag v-for="(tag, index) in data.Tags" :key="index" :tag="tag"></Tag>
      </div>
      <div style="margin-top: auto">
        <div id="gap"></div>
        <!-- 占位符 -->
        <!-- <div>收藏</div>
        <div>支持</div> -->

        <div
          class="btns"
          style="display: flex; justify-content: center; justify-content: space-around"
        >
          <n-button type="info" strong round disabled style="padding: 10px 10%; width: 80%">
            进入实验
          </n-button>
        </div>
      </div>
    </div>

    <div style="text-align: center" class="context">
      <n-tabs v-model:value="selectedTab" justify-content="space-evenly" type="line">
        <n-tab-pane name="Intro" tab="简介">
          <div style="width: 94%; margin: 0 auto 20px auto" class="gray">
            <div style="display: flex; flex-direction: column; width: 100%; height: fit-content">
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
                <img :src="avatarUrl" style="margin: auto 10px; height: 90%; border-radius: 50%" />
                <div style="text-align: left">
                  <p style="color: #007bff; margin: 5% 0 2% 0; width: 100%; font-size: 16px">
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
                  flex-grow: 1;
                  margin-top: 3%;
                  background-color: white;
                  border-radius: 10px;
                  padding: 10px;
                  margin: 5px;
                "
              >
                <h3 style="color: #007bff; text-align: left; margin-top: 2px; margin-bottom: 2px">
                  实验介绍
                </h3>
                <div
                  style="left: 3%; width: 94%; height: 90%; max-width: 100%; word-break: break-all"
                >
                  <div style="text-align: left" v-html="parse(data.Description)"></div>
                  <div style="font-weight: bold; text-align: left">字数统计:</div>
                </div>
              </div>
            </div>
          </div>
        </n-tab-pane>
        <n-tab-pane name="Comment" :tab="`评论(${data.Comments})`">
          <div class="gray" id="comment">
            <MessageList
              :ID="route.params.id as string"
              :Category="route.params.category as 'Experiment'|'User'|'Discussion'"
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
                :maxlength="400"
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
import { computed, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getData } from "../services/getData.ts";
import { NTabs, NTabPane } from "naive-ui";
import Tag from "../components/utils/TagLarger.vue";
import MessageList from "../components/messages/MessageList.vue";
import parse from "../services/advancedParser.ts";
import parseInline from "../services/commonParser.ts";
import showUserCard from "../popup/usercard";
import postComment from "../services/postComment.ts";
import "highlight.js/styles/github.css";
import "../../node_modules/katex/dist/katex.min.css";
import { getUserUrl } from "../services/computedUrl.ts";

let comment = ref("");
let isLoading = ref(false); // 新增 loading 状态
let upDate = ref(1);
let replyID = ref("");

const selectedTab = ref("Intro");

const route = useRoute();

const coverUrl = computed(
  () =>
    `/static/experiments/images/${route.params.id.slice(0, 4)}/${route.params.id.slice(
      4,
      6
    )}/${route.params.id.slice(6, 8)}/${route.params.id.slice(8, 24)}/${
      data.value.Image || 0
    }.jpg!full`
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
  Tags: ["正在加载"],
  Visits: 0,
  Stars: 0,
  Supports: 0,
  Remixes: 0,
  Comments: 0,
  Price: 0,
  Popularity: 0,
  ID: "642cf37a494746375aae306a",
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

let avatarUrl = getUserUrl(data.value.User);

onMounted(async () => {
  const res = await getData(`/Contents/GetSummary`, {
    ContentID: route.params.id,
    Category: route.params.category,
  });
  data.value = res.Data;
  avatarUrl = getUserUrl(data.value.User);
});

function handleMsgClick(item: any) {
  replyID.value = item.userID;
  comment.value = `回复@${item.msg_title}: `;
}

const handleEnter = async () => {
  await postComment(
    comment,
    isLoading,
    route.params.category as string,
    route.params.id as string,
    replyID,
    upDate
  );
};

// 新增方法：返回上一页
const goBack = () => {
  window.history.back();
};
</script>

<style scoped>
.container {
  height: 100dvh;
  width: 100dvw;
  display: flex;
  box-sizing: border-box;
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

.cover {
  object-fit: cover;
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.context {
  overflow-y: scroll;
  flex: 1;
  box-sizing: border-box;
}

/* width > height 横屏
 */
@media (min-aspect-ratio: 1/1) {
  .cover {
    /* width: 50%; */
    height: 100%;
  }
  .context {
    /* width: 50%; */
    height: 100dvh;
  }
  .gray {
    height: calc(100dvh - 75px);
    background-color: rgba(1, 1, 1, 0.1);
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
}

/* width < height 竖屏
 */
@media (max-aspect-ratio: 1/1) {
  .cover {
    width: 95%;
    flex: 1;
  }
  #gap {
    height: 5vh;
  }
  .context {
    /* height: 60%; */
    flex: 2;
  }
  .gray {
    height: calc(63dvh - 80px);
    overflow: hidden;
    background-color: rgba(1, 1, 1, 0.1);
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
}

.sendComment {
  height: 40px;
  position: fixed;
  background-color: #ddd;
  bottom: 0;
  box-sizing: border-box;
  padding: 2px 20px;
}

.gray {
  overflow-y: scroll;
  border-radius: 10px;
}

div {
  box-sizing: border-box;
}
</style>
