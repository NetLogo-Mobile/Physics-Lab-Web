<template>
  <!-- Adaptation用于Profile和ExperimentSummaries页面的适配，他们都是两个区块，宽屏左右分布，长屏上下分布。 -->
  <!-- Adaptation is used for the Profile and ExperimentSummaries pages, which have two blocks, distributed left and right in wide screens, and top and bottom in long screens. -->
  <div class="basic-layout">
    <!-- 封面区域  cover area -->
    <div class="layout-left">
      <slot name="left"></slot>
    </div>

    <!-- 作品介绍或者个人作品列表  Experiment introduction or personal work list -->
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
  --left-height: 28vh;
}

/* 默认竖屏布局  Default vertical layout */
.layout-left {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: var(--left-height);
  z-index: 1;
}

.layout-right {
  position: absolute;
  top: var(--left-height);
  left: 0;
  width: 100vw;
  height: calc(100dvh - var(--left-height));
}

.scroll-container {
  height: 100%;
  overflow-y: hidden;
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
  background: linear-gradient(
    to bottom,
    rgba(128, 128, 128, 0.4) 30%,
    rgba(128, 128, 128, 0) 80%
  );
  pointer-events: none;
  border-radius: 8px;
  z-index: 2;
}

/* 横屏布局  Horizontal layout */
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
  overflow-y: hidden;
}

.div {
  box-sizing: border-box;
}
</style>
