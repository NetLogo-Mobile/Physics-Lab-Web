<template>
  <div class="work-box">
    <div class="cover">
      <img :src="imgUrl" alt="" />
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
import { computed } from "vue";

const { item } = defineProps<{
  item: any;
}>();

const imgUrl = computed(
  () =>
    `http://physics-static-cn.turtlesim.com:80/experiments/images/${item.ID.slice(0, 4)}/${item.ID.slice(4, 6)}/${item.ID.slice(
      6,
      8
    )}/${item.ID.slice(8, 24)}/${item.Image || 0}.jpg!block`
);
const avartarUrl = computed(() => {
  if (item.User.Avatar === 0) return "/src/assets/user/default-avatar.png"; //默认头像
  return `http://physics-static-cn.turtlesim.com:80/users/avatars/${item.User.ID.slice(0, 4)}/${item.User.ID.slice(
    4,
    6
  )}/${item.User.ID.slice(6, 8)}/${item.User.ID.slice(8, 24)}/${item.User.Avatar}.jpg!tiny.round`;
});
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
}

.cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5% 5% 0 0;
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
