<template>
  <div style="height: 100%">
    <div
      class="container"
      :style="{
        backgroundImage: `url(${ProjectsBackground})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }"
      @click="jump"
    >
      <h2 class="title">{{ projectsName }}</h2>
      <div class="box" @click.stop="">
        <Works
          v-for="item in projects"
          :key="item.ID"
          :data="item"
          :type="type"
        ></Works>
      </div>
    </div>
    <div
      class="activity"
      :style="{ backgroundImage: `url(${activityBackground})` }"
      @click="activityProc"
    >
      <h1 class="activity-text">{{ activityName }}</h1>
    </div>
  </div>
</template>

<script setup>
import Works from "../projects/brief.vue";
import router from "../../router";
import { getCoverUrl } from "../../services/utils.ts";
const { projects, type, link } = defineProps({
  projects: Array,
  type: String,
  activityName: String,
  activityBackground: String,
  projectsName: String,
  activityProc: Function,
  link: String,
});

const ProjectsBackground = getCoverUrl(projects[0]);

const jump = () => {
  router.push(`/list/${link}`);
};
</script>

<style scoped>
.container {
  position: relative;
  border-radius: 8px;
  position: relative;
  color: #fff;
  height: calc(100% - 95px);
  display: flex;
  flex-direction: column;
}

.container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* 为了防止底部背景与字体颜色冲突的灰色遮罩 */
  background: linear-gradient(
    to bottom,
    rgba(128, 128, 128, 0.3) 0%,
    rgba(128, 128, 128, 0) 50%
  );
  pointer-events: none;
  border-radius: 8px;
  z-index: 1;
}

.title {
  text-align: center;
  margin-bottom: 10px; /* 添加底边距使标题与 box 之间有些间距 */
  text-align: left;
  padding-left: 20px;
  z-index: 2;
}

.box {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: auto 0 0; /* 顶部 margin 设置为 auto 推动 box 到底部 */
  gap: 5px;
  background-color: rgba(0, 0, 0, 0.3);
}

.activity {
  height: 75px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: left;
  margin-top: 20px;
  border-radius: 10px;
}

.activity-text {
  color: white;
  text-align: left;
  padding-left: 20px;
  font-weight: normal;
}

.div {
  box-sizing: border-box;
}
</style>
