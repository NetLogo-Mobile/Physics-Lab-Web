<template>
  <div>
    <div class="container" :style="{
      backgroundImage: `url(${ProjectsBackground})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      }"
    >
      <h2 class="title">{{ projectsName }}</h2>
      <div class="box">
        <Works v-for="item in projects" :key="item.ID" :data="item" :type="type"></Works>
      </div>
    </div>
    <div
      class="activity"
      :style="{ backgroundImage: `url(${activityBackground})` }"
      @click="activityProc"
    >
      <h1 id="activity-text">{{ activityName }}</h1>
    </div>
  </div>
</template>

<script setup>
import Works from "./projects/brief.vue";
import { computed } from "vue";
const { projects, type } = defineProps({
  projects: Array,
  type: String,
  activityName: String,
  activityBackground: String,
  projectsName: String,
  activityProc: Function,
});

const ProjectsBackground = computed(() => {
  const id = projects[0].ID;

  return `http://physics-static-cn.turtlesim.com:80/experiments/images/${id.slice(0, 4)}/${id.slice(4, 6)}/${id.slice(
    6,
    8
  )}/${id.slice(8, 24)}/0.jpg!block`;
});
</script>

<style scoped>
.container {
  position: relative;
  border-radius: 8px;
  position: relative;
  color: #fff;
  height: 260px;
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
  background: linear-gradient(to bottom, rgba(128, 128, 128, 0.3) 0%, rgba(128, 128, 128, 0) 50%);
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

#activity-text {
  color: white;
  text-align: left;
  padding-left: 20px;
  font-weight: normal;
}
</style>
