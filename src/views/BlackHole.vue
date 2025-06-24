<template>
  <div id="blackhole">
    <Header>
      <h1>{{ $t("blackhole.title") }}</h1>
    </Header>
    <!-- 高度：50px定值 -->
    <main>
      <div v-if="loading" class="loading"></div>
      <div v-if="!loading" class="block-container">
        <n-grid :x-gap="12" :y-gap="12" :cols="itemsPerRow">
          <n-gi
            v-for="block in blocks.filter((i: any) => i.Summaries.length > 0)"
            :key="block.Subject"
          >
            <div class="block" style="height: 100%">
              <BlockAndActivity
                v-if="
                  block.$type.startsWith('Quantum.Models.Contents.TopicBlock')
                "
                type="Discussion"
                :projects="block.Summaries"
                :activityName="
                  block.AuxiliaryText || $t('blackhole.participate')
                "
                :activityBackground="getPath('/@base/assets/mechanics.png')"
                :projectsName="block.Subject"
                :activityProc="
                  getActivityProc(block.AuxiliaryLink || 'internal://co-dev')
                "
                :link="EncodeAPITargetLink(block.TargetLink)"
              />
              <Block
                v-else
                type="Discussion"
                :data="block.Summaries.slice(0, maxProjectsPerBlock)"
                :title="block.Header"
                :link="EncodeAPITargetLink(block.TargetLink)"
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
import { useResponsive } from "../layout/useResponsive";
import { ref, onMounted } from "vue";
import Header from "../components/utils/Header.vue";
import BlockAndActivity from "../components/blocks/BlockAndActivity.vue";
import Block from "../components/blocks/Block.vue";
import Footer from "../components/utils/Footer.vue";
import { getData } from "../services/api/getData.ts";
import { NGrid, NGi } from "naive-ui";
import { EncodeAPITargetLink } from "../services/utils.ts";
import getPath from "../services/getPath";
import "../layout/loading.css";
import "../layout/startPage.css";

const loading = ref(true);
const blocks = ref<any>([]);

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

const getActivityProc = (
  link: string | undefined,
): (() => void) | undefined => {
  return link ? activityLinkMap[link] : undefined;
};

const { itemsPerRow, maxProjectsPerBlock } = useResponsive();

onMounted(async () => {
  const getLibraryResponse = await getData("/Contents/GetLibrary", {
    Identifier: "Discussions",
    Language: "Chinese",
  });
  loading.value = false;
  blocks.value = getLibraryResponse.Data.Blocks;
});
</script>

<style scoped></style>
