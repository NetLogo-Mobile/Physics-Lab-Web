<template>
  <Header>
    <img
      src="/assets/library/Navigation-Return.png"
      style="width: 2.7em"
      @click="goBack"
    />
    <h2 style="margin-right: auto; margin-left: 20px">
      {{ $t("worklist.title") }}
    </h2>
  </Header>

  <div class="list">
    <WorksList
      :row="maxProjectsPerBlock"
      :q="
        route.params.config
          ? decodeHrefToQueryObj(route.params.config as string)
          : {}
      "
    />
  </div>
</template>

<script setup lang="ts">
import Header from "../components/utils/Header.vue";
import WorksList from "../components/projects/itemList.vue";
import { useRoute } from "vue-router";
import { decodeHrefToQueryObj } from "../services/utils";
import { useResponsive } from "../layout/useResponsive";

const route = useRoute();

const { maxProjectsPerBlock } = useResponsive();

const goBack = () => {
  window.history.back();
};
</script>

<style scoped>
.list {
  margin-top: 60px;
  padding: 20px;
  width: 100dvw;
  height: calc(100dvh - 60px);
  box-sizing: border-box;
  background-color: #ccc3;
  scrollbar-width: none;
}
</style>
