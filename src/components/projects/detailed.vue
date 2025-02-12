<template>

  <router-link
    :to="{
      name: 'ExperimentSummary',
      params: { category: data.Category, id: data.ID, image: data.Image },
    }"
  >
    <div class="card">
      <img :src="imgUrl" class="icon" onerror="this.src='/src/assets/icons/white.png'" />
      <div class="text">
        <p class="title" v-html="parse(data.Subject)"></p>
        <p class="subtitle">{{ data.User.Nickname }}</p>
        <div class="subtitle"><Tag v-for="i in data.Tags" :type="type" :tag="i" /></div>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import Tag from "../utils/Tag.vue";
import { computed } from "vue";
import parse from "../../services/commonParser.ts";

const { data, type } = defineProps({
  data: Object,
  type: String,
});
const imgUrl = computed(
  () =>
    `http://physics-static-cn.turtlesim.com:80/experiments/images/${data.ID.slice(0, 4)}/${data.ID.slice(4, 6)}/${data.ID.slice(
      6,
      8
    )}/${data.ID.slice(8, 24)}/${data.Image || 0}.jpg!block`
);
</script>

<style scoped>
.card {
  display: flex;
  align-items: center;
  padding: 5px;
  height: 50px;
}

.icon {
  width: 50px;
  height: 50px;
  border-radius: 5px;
  margin-right: 10px;
}

.text {
  display: flex;
  flex-direction: column;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.title {
  font-size: 12px;
  color: #333;
  margin: 0;
}

.subtitle {
  font-size: 10px;
  color: #666;
  margin: 0;
}

a {
  text-decoration: none;
}
</style>
../../services/commonParser