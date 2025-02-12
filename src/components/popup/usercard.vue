<template>
  <div class="container" @click="close" :style="{ zIndex: 100 }">
    <div class="user" @click.stop="">
      <div class="user-info">
        <img :src="avatar" alt="User Avatar" class="avatar" @click="jumpToUser(props.userid)" />
        <!-- 阻止冒泡，使得只有点击遮罩才关闭 -->
        <p class="username">{{ name }}</p>
        <p class="snt">{{ snt || "这个人很神秘，什么也么有写" }}</p>
      </div>
      <div class="stats">
        <div class="stat-item">
          <span>关注 {{ followingCount }}</span>
        </div>
        <div class="stat-item">
          <span>粉丝 {{ followerCount }}</span>
        </div>
      </div>
      <div class="data">
        <div class="num">
          <div>{{ postCount }}</div>
          <div>{{ starCount }}</div>
          <div>{{ fragmentCount }}</div>
        </div>
        <div class="num">
          <img
            src="/src/assets/user/Image-Experiments.png"
            style="filter: brightness(0.9); height: 25px"
          />
          <img
            src="/src/assets/user/Image-Stars.png"
            style="filter: brightness(0.9); height: 25px"
          />
          <img
            src="/src/assets/user/Image-Prestige.png"
            style="filter: brightness(0.9); height: 25px"
          />
        </div>
      </div>
      <button class="follow-button">关注用户</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getData } from "../../services/getData.ts";

const props = defineProps({
  userid: String,
  close: Function,
});

const name = ref("loading...");
const snt = ref("loading...");
const avatar = ref("/src/assets/user/default-avatar.png");
const followingCount = ref(0);
const followerCount = ref(0);
const postCount = ref(0);
const starCount = ref(0);
const fragmentCount = ref(0);

const jumpToUser = (id) => {
  window.open(`/profile/${id}`, "_self");
};

onMounted(async () => {
  const re = await getData("/Users/GetUser", { ID: props.userid });
  const data = re.Data.User;
  name.value = data.Nickname;
  snt.value = data.Signature;
  avatar.value =
    data.Avatar === 0
      ? "/src/assets/user/default-avatar.png"
      : `http://physics-static-cn.turtlesim.com:80/users/avatars/${data.ID.slice(0, 4)}/${data.ID.slice(4, 6)}/${data.ID.slice(
          6,
          8
        )}/${data.ID.slice(8, 24)}/${data.Avatar}.jpg`;
  followingCount.value = re.Data.Statistic.FollowingCount;
  followerCount.value = re.Data.Statistic.FollowerCount;
  postCount.value = re.Data.Statistic.ExperimentCount;
  starCount.value = re.Data.Statistic.StarCount;
  fragmentCount.value = data.Fragment;
  const cache = JSON.parse(localStorage.getItem("userIDAndAvartarIDMap")) || {}; // 用户为第几张头像的缓存
  cache[data.ID] = [data.Avatar, Date.now()];
  localStorage.setItem("userIDAndAvartarIDMap", JSON.stringify(cache));
});
</script>

<style scoped>
.container {
  position: absolute;
  left: 0;
  top: 0;
  height: 100dvh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.2);
}

.user {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.user-info {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  margin: 5px;
}

.username {
  font-size: 1.5em;
  margin: 5px;
}

.snt {
  font-size: 1em;
  color: #666;
  margin: 5px;
}

.stats {
  display: flex;
  justify-content: space-between;
}

.stat-item {
  flex: 1;
  text-align: center;
}

.data {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}

.num {
  display: flex;
  font-size: 1.2em;
  flex-direction: row;
  justify-content: space-around;
}

.follow-button {
  width: 100%;
  padding: 10px;
  margin-top: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
