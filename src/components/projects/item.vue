<template>
  <div class="work-box" @click="handleClick">
    <div class="cover">
      <img :src="imgUrl" alt="" />
      <div class="time">{{ formatDate(item.ID, false, "date") }}</div>
    </div>
    <div class="info">
      <div class="title">{{ item.Subject }}</div>
      <div class="user">
        <div class="avartar">
          <img :src="avartarUrl" alt="item.User.Nickname" />
        </div>
        <div class="name">{{ item.User.Nickname }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from "../../router";
import { getCoverUrl, getUserUrl, formatDate } from "../../services/utils";

const { item } = defineProps<{
  item: any;
}>();

const imgUrl = getCoverUrl(item);
const avartarUrl = getUserUrl(item.User);

const handleClick = () => {
  router.push(`/ExperimentSummary/${item.Category}/${item.ID}`);
};
</script>

<style scoped>
.work-box {
  background: #fff;
  border-radius: 5%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  height: 220px;
}

.work-box:hover {
  transform: translateY(-4px);
}

.cover {
  width: 100%;
  height: 150px;
  position: relative;
}

.cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5% 5% 0 0;
}

.cover .time {
  position: absolute;
  top: 8px;
  right: 8px;
  color: white;
  font-size: medium;
  /* mix-blend-mode: difference; */
  /* 放弃解决白色底板看不清 give up solving white-background mode */
}

.info {
  display: flex;
  flex-direction: column;
  padding: 8px;
  gap: 3px;
}

.title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
}

.user {
  display: flex;
  flex-direction: row;
}

.avartar {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  overflow: hidden;
}

.avartar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user .name {
  font-size: 15px;
  margin-left: 8px;
  white-space: nowrap;
}
</style>
