<template>
  <div class="header-container">
    <slot></slot>
    <!-- @see https://icomoon.io/app/ -->
    <div class="buttons">
      <div class="logout" @click="logout">
        <svg
          width="25"
          height="25"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M24 20v-4h-10v-4h10v-4l6 6zM22 18v8h-10v6l-12-6v-26h22v10h-2v-8h-16l8 4v18h8v-6z"
          ></path>
        </svg>
      </div>
      <div class="settings" @click="router.push('/settings')">
        <svg
          cwidth="25"
          height="25"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M29.181 19.070c-1.679-2.908-0.669-6.634 2.255-8.328l-3.145-5.447c-0.898 0.527-1.943 0.829-3.058 0.829-3.361 0-6.085-2.742-6.085-6.125h-6.289c0.008 1.044-0.252 2.103-0.811 3.070-1.679 2.908-5.411 3.897-8.339 2.211l-3.144 5.447c0.905 0.515 1.689 1.268 2.246 2.234 1.676 2.903 0.672 6.623-2.241 8.319l3.145 5.447c0.895-0.522 1.935-0.82 3.044-0.82 3.35 0 6.067 2.725 6.084 6.092h6.289c-0.003-1.034 0.259-2.080 0.811-3.038 1.676-2.903 5.399-3.894 8.325-2.219l3.145-5.447c-0.899-0.515-1.678-1.266-2.232-2.226zM16 22.479c-3.578 0-6.479-2.901-6.479-6.479s2.901-6.479 6.479-6.479c3.578 0 6.479 2.901 6.479 6.479s-2.901 6.479-6.479 6.479z"
          ></path>
        </svg>
      </div>
      <div v-show="!isFullScreen" class="fullScreen" @click="toggleFullScreen">
        <svg
          width="22"
          height="22"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M32 0h-13l5 5-6 6 3 3 6-6 5 5z"></path>
          <path d="M32 32v-13l-5 5-6-6-3 3 6 6-5 5z"></path>
          <path d="M0 32h13l-5-5 6-6-3-3-6 6-5-5z"></path>
          <path d="M0 0v13l5-5 6 6 3-3-6-6 5-5z"></path>
        </svg>
      </div>
      <div v-show="isFullScreen" class="fullScreen" @click="toggleFullScreen">
        <svg
          width="25"
          height="25"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M18 14h13l-5-5 6-6-3-3-6 6-5-5z"></path>
          <path d="M18 18v13l5-5 6 6 3-3-6-6 5-5z"></path>
          <path d="M14 18h-13l5 5-6 6 3 3 6-6 5 5z"></path>
          <path d="M14 14v-13l-5 5-6-6-3 3 6 6-5 5z"></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Emitter from "../../services/eventEmitter.ts";
import storageManager from "../../services/storage.ts";
import router from "../../router/index";
let isFullScreen = ref(false);

const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    isFullScreen.value = true;
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      isFullScreen.value = false;
    }
  }
};

/**
 *  强制刷新，但是日后需要修改本地存储清理逻辑
 * Force refresh, but the local storage clearing logic needs to be modified in the future
 *  @deprecated
 */
function logout() {
  storageManager.remove("userInfo");
  Emitter.emit("info", "您已退出登录！", 1);
  window.location.href = window.$getPath("/@root");
  window.location.reload();
}
</script>

<style scoped>
.header-container {
  height: 50px;
  position: fixed;
  top: 0;
  padding: 0 3vw 0 3vw;
  font-size: small;
  background-color: white;
  width: 100%;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.buttons {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding-right: 8vw;
  gap: 10px;
}

.div {
  box-sizing: border-box;
}
</style>
