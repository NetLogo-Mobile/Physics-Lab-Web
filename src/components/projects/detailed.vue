<template>
  <router-link
    :to="{
      name: 'ExperimentSummary',
      params: { category: (data.Category || 'Experiment'), id: data.ID, image: data.Image },
    }"
  >
  <!-- 早期实验区作品类型为null -->
    <div class="card">
      <img :src="imgUrl" class="icon" />
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
import { getCoverUrl } from "../../services/computedUrl";

const { data, type } = defineProps({
  data: Object,
  type: String,
});
const imgUrl = getCoverUrl(data);
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

div {
  box-sizing: border-box;
}
</style>
