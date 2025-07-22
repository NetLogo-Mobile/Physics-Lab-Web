<template>
  <div id="app" @click="handleClick">
    <n-message-provider :max="2">
      <Msg></Msg>
    </n-message-provider>
    <n-dialog-provider>
      <Notification></Notification>
    </n-dialog-provider>
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component
          :is="Component"
          v-if="$route.meta.keepAlive"
          :key="$route.fullPath"
        />
      </keep-alive>
      <component
        :is="Component"
        v-if="!$route.meta.keepAlive"
        :key="$route.fullPath"
      />
    </router-view>
  </div>
</template>

<script setup lang="ts">
import Msg from "./components/popup/msg.vue";
import getPath from "./services/getPath.ts";
import showUserCard from "./popup/usercard.ts";
import Notification from "./components/popup/notification.vue";
import Emitter from "./services/eventEmitter";

window.$getPath = getPath;

function handleClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (target.classList.contains("RUser")) {
    showUserCard(target.dataset.user || "");
  }
}

setTimeout(async () => {
  if (!document.cookie.includes("visitorID")) {
    Emitter.emit("nWarning", {
      title: "Cookie",
      content:
        'Our website uses cookies to enhance your user experience. Click "Accept all Cookies" if you agree to the use of cookies',
      positiveText: "Accept all the cookies",
      onPositiveClick: async () => {
        const FingerprintJS = await import("@fingerprintjs/fingerprintjs");
        const fp = await FingerprintJS.load();
        const re = await fp.get();
        document.cookie = `visitorID=${re.visitorId}`;
      },
    });
  }
}, 200);
</script>

<style>
body {
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100vw;
  background-color: white;
}
</style>
