<template>
  <div style="padding: 0px 10px">
    <div class="user-item" @click="showUserCard(user.ID)">
      <img
        class="avatar"
        :src="avararUrl"
        onerror="this.src='/src/assets/user/default-avatar.png'"
      />
      <div class="info">
        <div class="username">{{ user.Nickname }}</div>
        <div class="signature">{{ user.Signature || "这个人很神秘，什么也没有写" }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import showUserCard from "../../popup/usercard.ts";
const { user } = defineProps<{
  user: any;
}>();

const avararUrl = computed(() => {
  if (user.Avatar === 0 || user.Verification === "Banned")
    return "/src/assets/user/default-avatar.png";
  return user.ID
    ? `http://physics-static-cn.turtlesim.com:80/users/avatars/${user.ID.slice(0, 4)}/${user.ID.slice(4, 6)}/${user.ID.slice(
        6,
        8
      )}/${user.ID.slice(8, 24)}/${user.Avatar}.jpg!small.round`
    : "/src/assets/user/default-avatar.png";
});
</script>

<style scoped>
.user-item {
  height: 60px;
  display: flex;
  align-items: center;
  border-radius: 8px;
  transition: background 0.2s;
  cursor: pointer;
  background-color: white;
  margin: 10px 0 10px 15px;
}

.avatar {
  width: 63px;
  height: 63px;
  border-radius: 50%;
  margin-right: 12px;
  margin-left: -15px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.info {
  flex: 1;
  min-width: 0;
  text-align: left;
}

.username {
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.signature {
  font-size: 12px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
