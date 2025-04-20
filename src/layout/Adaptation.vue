<template>
  <div class="basic-layout">
    <!-- 封面区域插槽 -->
    <div class="layout-left">
      <slot name="left"></slot>
    </div>

    <!-- 内容区域插槽 -->
    <div class="layout-right">
      <div class="scroll-container">
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
defineComponent({
  name: "Adaptation",
});
</script>
<style scoped>
.basic-layout {
  position: relative;
  height: 100dvh;
  width: 100vw;
  overflow: hidden;
  overflow-x: hidden;
}

/* 默认竖屏布局 */
.layout-left {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 35vh;
  z-index: 1;
}

.layout-right {
  position: absolute;
  top: 35vh;
  left: 0;
  width: 100vw;
  height: calc(100dvh - 35vh);
}

.scroll-container {
  height: 100%;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.layout-left::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(128, 128, 128, 0.4) 30%, rgba(128, 128, 128, 0) 80%);
  pointer-events: none;
  border-radius: 8px;
  z-index: 2;
}

/* 横屏布局 */
@media (min-aspect-ratio: 1/1) {
  .layout-left {
    width: 50vw;
    height: 100dvh;
  }

  .layout-right {
    top: 0;
    left: 50vw;
    width: 50vw;
    height: 100dvh;
  }

  .scroll-container {
    padding: 0 10px;
  }
}

.scroll-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
}
.div {
  box-sizing: border-box;
}
</style>
