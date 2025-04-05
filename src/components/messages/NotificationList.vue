<template>
  <!-- 无限滚动组件 -->
  <n-infinite-scroll :distance="10" @load="handleLoad" style="height: 100%">
    <!-- 遍历显示每一条消息 -->
    <div v-for="item in items" :key="item.id">
      <Notification
        :avatar_url="item.avatar_url"
        :msg_title="item.msg_title"
        :msg="item.msg"
        :msg_type="item.msg_type"
        :category="item.category"
        :id="item.id"
        :tid="item.tid"
        :name="item.name"
        :uid="item.uid"
      ></Notification>
      <n-divider style="margin: 0" />
    </div>
    <div v-if="loading && !hasLoadEnd" class="text">加载中...</div>
  </n-infinite-scroll>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Notification from "./NotificationItem.vue";
import { getData } from "../../services/getData.ts";
import { getAvatarUrl, saveCache } from "../../services/getUserCurentAvatarByID";
import type { Ref } from "vue";
import Emitter from "../../services/eventEmitter";
import { NInfiniteScroll } from "naive-ui";

interface Message {
  ID: number;
  CategoryID: number;
  TemplateID: number;
  Users: string[];
  Fields: any;
  UserNames: string[];
  Numbers: any;
}

interface Template {
  ID: number;
  Content: any;
  Subject: string;
  Type: number;
  CategoryID: number;
}
interface Item {
  id: number;
  avatar_url: string;
  msg_title: string;
  msg: string;
  msg_type: number;
  category: string;
  tid: string;
  name: string;
  uid: string;
}

const items: Ref<Item[]> = ref([]);
const loading = ref(false); // 用于无限滚动组件判断是否可以获取下一组数据
let skip = 0;
const hasLoadEnd = ref(false);
let templates: any = [
  {
    ID: "5c90f172a2409b51dc5cb945",
    Identifier: "Letter-Test",
    CategoryID: 1,
    Management: false,
    Subject: {
      Chinese: "一封测试邮件 {Users}",
      English: "A letter for test {Users}",
      ChineseTraditional: "一封測試郵件 {Users}",
      German: "Ein Brief für den Test {Benutzer}",
      French: "Une lettre pour le test {Utilisateurs}",
      Japanese: "テスト用の手紙{Users}",
      Italian: "Una lettera per il test {Utenti}",
      Polish: null,
      Spanish: null,
      Ukrainian: null,
    },
    Content: {
      Chinese: "这是一封测试邮件，用于测试所有功能。{Users}",
      English: "This is a letter for test to test every features. {Users}",
      ChineseTraditional: "這是一封測試郵件，用於測試所有功能。 {Users}",
      German: "Dies ist ein Testbrief zum Testen aller Funktionen. {Benutzer}",
      French: "Ceci est une lettre de test pour tester toutes les fonctionnalités. {Utilisateurs}",
      Japanese: "これはすべての機能をテストするためのテスト用の手紙です。 {ユーザー}",
      Italian: "Questa è una lettera per test per testare tutte le funzionalità. {} utenti",
      Polish: null,
      Spanish: null,
      Ukrainian: null,
    },
    Description: null,
    Bonuses: {
      Fragment: 1,
    },
    Action: null,
    CombineLimit: 0,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 0,
  },
  {
    ID: "5c9114e9ce50092ed4453fd5",
    Identifier: "Attention-Followed",
    CategoryID: 2,
    Management: false,
    Subject: {
      Chinese: "新的关注者！",
      English: "New follower!",
      ChineseTraditional: "新的關注者！",
      German: "Neuer Anhänger",
      French: "Nouveau disciple!",
      Japanese: "新しいフォロワー！",
      Italian: "Nuovo follower!",
      Polish: "Nowy obserwujący!",
      Spanish: "¡Nuevo seguidor!",
      Ukrainian: "Новий підписник!",
    },
    Content: {
      Chinese: "{Users} 关注了你。",
      English: "{Users} followed you.",
      ChineseTraditional: "{Users} 關注了你。",
      German: "{Users} ist dir gefolgt.",
      French: "{Users} vous a suivi.",
      Japanese: "{Users} さんがあなたをフォローしました。",
      Italian: "{Users} ti hanno seguito.",
      Polish: "{Users} obserwują Cię.",
      Spanish: "{Users} te siguió.",
      Ukrainian: "{Users} підписалися на вас.",
    },
    Description: null,
    Bonuses: null,
    Action: null,
    CombineLimit: 10,
    AvailableFrom: 1546322400000,
    AvailableUntil: 1893477600000,
    Push: 0,
  },
];

const { notificationTypeIndexOfUI } = defineProps(["notificationTypeIndexOfUI"]);

/**
 * 紫兰斋的编号与UI不一致
 */
function convertCategoryIDToUIIndex(n: Number) {
  return n === 2 ? 3 : n === 3 ? 2 : n;
}

function convertUIIndexToCategoryID(n: Number) {
  return n === 3 ? 2 : n === 2 ? 3 : n;
}

/**
 * 由模板和数据渲染通知
 */
function fillInTemplate(data: String, message: Message) {
  // 等待实现的actions:showComment
  const re = data
    .replace(
      /{Users}/g,
      message.Users.map((user, index) => `<user=${user}>${message.UserNames[index]}</user>`).join(
        " "
      )
    )
    .replace(
      /{Experiment}/g,
      message.Fields?.Discussion
        ? `<discussion=${message.Fields?.DiscussionID}>${message.Fields?.Discussion}</discussion>`
        : `<experiment${message.Fields?.ExperimentID}>${message.Fields?.Experiment}</experiment>`
    )
    .replace(/{\$Content}/g, message.Fields.Content)
    .replace(/{\$TargetName}/g, localStorage.getItem("nickName") || "朋友")
    .replace(/{\$Until}/g, message.Fields.Unitl)
    .replace(/{\$Editor}/g, message.Fields.Editor)
    .replace(/{\$Gold}/g, message.Numbers?.Gold)
    .replace(/undefined/g, "");
  return re;
}

async function renderTemplateWithData(messages: Message[]) {
  const avatarPromises = messages.map((message) => getAvatarUrl(message.Users[0], true));
  const avatarUrls = await Promise.all(avatarPromises);
  saveCache();

  return messages.map((message, index) => {
    const template = templates.find((t: Template) => t.ID === message.TemplateID);
    return {
      id: message.ID,
      avatar_url:
        convertCategoryIDToUIIndex(message.CategoryID) == 1
          ? "/assets/messages/Message-Unread.png"
          : avatarUrls[index],
      // 因为有缓存的原因，即使多一个请求也不是什么大问题（编辑的头像在社区活动出现频率蛮高的）所以暂时不改
      // 暂时不管读不读了，也没人在意
      msg_title: fillInTemplate(template.Subject.Chinese, message),
      msg: fillInTemplate(template.Content.Chinese, message),
      msg_type: convertCategoryIDToUIIndex(message.CategoryID),
      category: message.Fields?.User
        ? "User"
        : message.Fields?.Discussion
        ? "Discussion"
        : "Experiment",
      tid: message.Fields?.UserID || message.Fields?.DiscussionID || message.Fields?.ExperimentID,
      name: message.Fields?.Discussion || message.Fields?.Experiment || message.Fields?.User,
      uid: message.Users[0],
    };
  });
}

// 处理加载事件
const handleLoad = async (noTemplates = true) => {
  if (loading.value) return;
  if (hasLoadEnd.value) return;
  loading.value = true;
  try {
    const getMessagesResponse = await getData("/Messages/GetMessages", {
      CategoryID: convertUIIndexToCategoryID(notificationTypeIndexOfUI),
      Take: 20,
      Skip: skip,
      NoTemplates: noTemplates,
    });

    if (!noTemplates) {
      templates = getMessagesResponse.Data.Templates as Template[];
    }

    const messages = getMessagesResponse.Data.Messages;

    if (getMessagesResponse.Data.Messages.length === 0) {
      hasLoadEnd.value = true;
      Emitter.emit("warning", "没有更多了", 2);
    }

    // 先设置默认头像
    const defaultItems = messages.map((message: Message) => {
      const template = templates.find((t: Template) => t.ID === message.TemplateID);
      return {
        id: message.ID,
        avatar_url: "/assets/user/default-avatar.png", // 设置默认头像
        msg_title: fillInTemplate(template.Subject.Chinese, message),
        msg: fillInTemplate(template.Content.Chinese, message),
        msg_type: convertCategoryIDToUIIndex(message.CategoryID),
        category: message.Fields?.User
          ? "User"
          : message.Fields?.Discussion
          ? "Discussion"
          : "Experiment",
        tid: message.Fields?.UserID || message.Fields?.DiscussionID || message.Fields?.ExperimentID,
        name: message.Fields?.Discussion || message.Fields?.Experiment || message.Fields?.User,
        uid: message.Users[0],
      };
    });

    items.value = [...items.value, ...defaultItems];

    loading.value = false; // 我认为完全可以允许在本次头像渲染未完成的情况下渲染下一次

    // 并发请求新的头像地址
    const newItems = await renderTemplateWithData(messages);
    items.value = items.value.map((item) => {
      const newItem = newItems.find((ni) => ni.id === item.id);
      return newItem ? { ...item, avatar_url: newItem.avatar_url } : item;
    });

    skip += 20;
  } catch (error) {
    console.error("加载消息失败", error);
  }
};

// 初始加载数据
handleLoad(false);
</script>

<style scoped>
.text {
  text-align: center;
  color: #888;
}
</style>
