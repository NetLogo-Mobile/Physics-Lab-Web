<template>
  <div id="blackhole">
    <Header>
      <h1>黑洞</h1>
    </Header>
    <!-- 高度：50px定值 -->
    <main>
      <div class="loading" v-if="loading"></div>
      <div class="block-container" v-if="!loading">
        <n-grid :x-gap="12" :y-gap="12" :cols="itemsPerRow">
          <n-gi
            v-for="block in blocks.filter((i:any)=>i.Summaries.length > 0)"
            :key="block.Subject"
          >
            <div class="block">
              <BlockAndActivity
                v-if="block.$type.startsWith('Quantum.Models.Contents.TopicBlock')"
                type="Discussion"
                :projects="block.Summaries"
                :activityName="block.AuxiliaryText || '参与开发'"
                :activityBackground="getPath('/@base/assets/mechanics.png')"
                :projectsName="block.Subject"
                :activityProc="getActivityProc(block.AuxiliaryLink || 'internal://co-dev')"
                :link="targetLink(block.TargetLink)"
              />
              <Block
                v-else
                type="Discussion"
                :data="block.Summaries.slice(0, 5)"
                :title="block.Header"
                :link="targetLink(block.TargetLink)"
              />
            </div>
          </n-gi>
        </n-grid>
      </div>
    </main>
    <Footer></Footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import Header from "../components/utils/Header.vue";
import BlockAndActivity from "../components/blocks/BlockAndActivity.vue";
import Block from "../components/blocks/Block.vue";
import Footer from "../components/utils/Footer.vue";
import { getData } from "../services/api/getData.ts";
import { NGrid, NGi } from "naive-ui";
import { strToQueryObj as targetLink } from "../services/utils.ts";
import getPath from "../services/getPath";
import "../layout/loading.css";
import "../layout/startPage.css";

const loading = ref(true);
const blocks = ref<any>([]);
const itemsPerRow = ref(getItemsPerRow());

const goToWebCommunity = () => {
  window.open("https://pl.turtlesim.com");
};

const goToDevelopment = () => {
  window.open("https://github.com/wsxiaolin/physics-lab-web");
};

const activityLinkMap: Record<string, () => void> = {
  "internal://forum": goToWebCommunity,
  "internal://co-dev": goToDevelopment,
};

const getActivityProc = (link: string | undefined): (() => void) | undefined => {
  return link ? activityLinkMap[link] : undefined;
};

function getItemsPerRow() {
  const width = window.innerWidth;
  return width >= 800 ? 3 : width >= 500 ? 2 : 1;
}

const handleResize = () => {
  itemsPerRow.value = getItemsPerRow();
};

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

onMounted(async () => {
  window.addEventListener("resize", handleResize);
  const getLibraryResponse = await getData("/Contents/GetLibrary", {
    Identifier: "Discussions",
    Language: "Chinese",
  });
  loading.value = false;
  blocks.value = getLibraryResponse.Data.Blocks;
});
</script>

<style scoped></style>
