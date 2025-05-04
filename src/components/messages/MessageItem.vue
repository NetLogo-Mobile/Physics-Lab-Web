<template>
  <div id="notification_container" @click="handleReply">
    <div class="img">
      <img :src="avatar_url" id="avatar" @click="showUserCard(userID as string)" />
    </div>
    <div id="notification" class="notification">
      <div id="notification_title" class="notification_title">
        <div class="name">{{ msg_title }}</div>
        <div class="delete" @click="deleteMsg" v-if="currentUserId === userID">删除</div>
      </div>
      <div id="notification_message" class="notification_message">
        <div
          id="notification_text"
          class="notification_text"
          v-html="parse(msg as string,true)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getData } from "../../services/api/getData";
import parse from "../../services/advancedParser.ts";
import showUserCard from "../../popup/usercard.ts";
import storageManager from "../../services/storage";

// 解构传递的props
const { id, userID, type } = defineProps({
  avatar_url: String,
  msg: String,
  msg_title: String,
  id: String,
  userID: String,
  type: String,
});

// 用于回复
const emit = defineEmits(["msgClick","deleteMsg"]);

const handleReply = () => {
  emit("msgClick", id);
};

const currentUserId = storageManager.get("userID", false);
const deleteMsg = async() => {
  await getData("Messages/RemoveComment", {
    TargetType: type,
    CommentID: id,
  });
  emit("deleteMsg", id);
};
</script>

<style scoped>
#notification_container {
  height: fit-content;
  width:calc(100% - 5px);
  margin-left: 5px;
  margin-top:5px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  background: white;
}

#notification_container:hover {
  background-color: #f0f0f0;
}

#avatar {
  height: 60px;
  width: 60px;
  border-radius: 50%;
}

#avatar::after {
  content: "";
  mix-blend-mode: luminosity;
}

#notification {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

#notification_icon {
  width: 20px;
  height: 20px;
  top: 2px;
  background-color: transparent;
  display: flex;
}

#notification_title {
  display: flex;
  width: 100%;
  flex-direction: row;
  font-size: 1em;
  margin-right: auto;
  font-weight: 700;
  white-space: nowrap;
}

.delete {
  margin-left: auto;
  padding-right: 15px;
  color: red;
  font-weight: lighter;
}

#notification_message {
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: row;
  gap: 5px;
}

#notification_text {
  font-size: 1em;
  text-align: left;
  height: fit-content;
  /* overflow-wrap: break-word; */
  max-width: 100%;
  white-space: wrap;
  overflow: hidden;
  text-overflow: hidden;
}

#icon {
  height: 16px;
  width: 16px;
}

#notification_container:hover {
  background-color: #f0f0f0;
}
div{
  box-sizing: border-box;
}
</style>