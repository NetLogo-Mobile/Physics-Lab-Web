<template>

  <router-link
    :to="{
      name: 'ExperimentSummary',
      params: { category: data.Category, id: data.ID, image: data.Image },
    }"
  >
    <div class="card" :type="type">
      <img :src="imgUrl" class="icon"  />
      <div class="text">
        <p class="title" v-html="parse(data.Subject)"></p>
        <p class="subtitle">{{ data.User.Nickname + "&nbsp;&nbsp;-" + formattedDate }}</p>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from "vue";
import parse from "../../services/commonParser.ts";
import { getCoverUrl } from "../../services/utils.ts";

const { data, type } = defineProps({
  data: Object,
  type: String,
});

const imgUrl = getCoverUrl(data);
const timestamp = computed(() => {
  const hexId = data.ID.slice(0, 8);
  const decimalId = parseInt(hexId, 16);
  return decimalId * 1000;
});
const formattedDate = computed(() => {
  const date = new Date(timestamp.value);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${month}/${day}`;
});
</script>

<style scoped>
.card {
  display: flex;
  align-items: center;
  padding: 0 10px;
  height: 50px;
}

.icon {
  width: 30px;
  height: 30px;
  border-radius: 5px;
  margin-right: 10px;
}

.text {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.title {
  font-size: 12px;
  color: white;
  margin: 0;
  white-space: nowrap; 
  overflow: hidden; 
  text-overflow: ellipsis;
}

.subtitle {
  font-size: 12px;
  color: white;
  margin: 5px 0 0 0;
}

a {
  text-decoration: none;
}

.div {
  box-sizing:border-box;
}

</style>../../services/utils.ts