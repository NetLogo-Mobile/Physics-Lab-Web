<template>
  <div id="home">
    <Header>
      <div class="user" @click="showModalFn">
        <img
          class="avatar"
          :src="
            user.avatarUrl || getPath('/@base/assets/user/default-avatar.png')
          "
          alt="Avatar"
        />
        <div class="user-info">
          <div class="username">{{ user.username }}</div>
          <div class="level">{{ $t("user.level") }} {{ user.level }}</div>
        </div>
        <div class="resources">
          <div class="resource">
            <img
              class="icon"
              :src="getPath('/@base/assets/icons/coins.png')"
              alt="Coins"
            />
            <span>{{ user.coins }}</span>
          </div>
          <div class="resource">
            <img
              class="icon gems"
              :src="getPath('/@base/assets/icons/gems.png')"
              alt="Gems"
            />
            <span>{{ user.gems }}</span>
          </div>
        </div>
      </div>
    </Header>
    <main>
      <div v-show="isLoading" class="loading"></div>
      <div v-show="!isLoading" class="block-container">
        <n-grid :x-gap="12" :y-gap="12" :cols="blockItemsPerRow">
          <!-- <n-gi>
            <Actions />
          </n-gi> -->
          <n-gi
            v-for="block in blocks.filter((i: any) => i.Summaries.length > 0)"
            :key="block.Subject"
          >
            <div class="block">
              <BlockAndActivity
                v-if="
                  block.$type.startsWith('Quantum.Models.Contents.TopicBlock')
                "
                type="Experiment"
                :projects="block.Summaries"
                :activityName="block.AuxiliaryText"
                :activityBackground="getPath('/@base/assets/support.png')"
                :projectsName="block.Subject"
                :link="EncodeAPITargetLink(block.TargetLink)"
              />
              <Block
                v-else
                type="Experiment"
                :data="block.Summaries.slice(0, maxProjectsPerBlock)"
                :title="block.Header"
                :link="EncodeAPITargetLink(block.TargetLink)"
              />
            </div>
          </n-gi>
        </n-grid>
      </div>
    </main>
    <n-modal v-model:show="showLoginModal" style="border-radius: 10px">
      <n-card style="width: 400px">
        <n-tabs
          class="card-tabs"
          default-value="signin"
          size="large"
          type="segment"
          animated
          pane-wrapper-style="margin: 0 -4px"
          pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
        >
          <n-tab-pane name="signin" :tab="$t('login.login')">
            <n-form :show-label="false">
              <n-form-item-row>
                <n-input
                  v-model:value="emailOrPhone"
                  class="inputArea"
                  :placeholder="$t('login.emailOrPhone')"
                  clearable
                >
                  <template #suffix>
                    <img
                      :src="getPath('/@base/assets/login/icon-login.png')"
                      width="15px"
                    />
                  </template>
                </n-input>
              </n-form-item-row>
              <n-form-item-row>
                <n-input
                  v-model:value="loginPassword"
                  show-password-on="click"
                  class="inputArea"
                  :placeholder="$t('login.password')"
                  type="password"
                  clearable
                />
              </n-form-item-row>
            </n-form>
            <p style="margin-bottom: 20px" v-html="$t('login.terms')"></p>
            <n-button
              type="primary"
              class="loginButton"
              @click="handlePasswordLogin"
            >
              {{ $t("login.confirm") }}
            </n-button>
          </n-tab-pane>
          <n-tab-pane name="signinByToken" :tab="$t('login.loginByToken')">
            <n-form :show-label="false">
              <n-form-item-row>
                <n-input
                  v-model:value="loginToken"
                  class="inputArea"
                  :placeholder="$t('login.token')"
                  clearable
                >
                </n-input>
              </n-form-item-row>
              <n-form-item-row>
                <n-input
                  v-model:value="authCode"
                  class="inputArea"
                  :placeholder="$t('login.authCode')"
                  clearable
                >
                </n-input>
              </n-form-item-row>
            </n-form>
            <p style="margin-bottom: 20px" v-html="$t('login.terms')"></p>
            <n-button
              type="primary"
              class="loginButton"
              @click="handleTokenLogin"
            >
              {{ $t("login.confirm") }}
            </n-button>
          </n-tab-pane>
          <n-tab-pane name="signup" :tab="$t('login.signup')">
            <h3 style="align-self: center">{{ $t("login.signupClosed") }}</h3>
            <n-form :showLabel="false">
              <n-form-item-row>
                <n-input
                  :placeholder="$t('login.emailOrPhone')"
                  class="inputArea"
                  clearable
                  disabled
                >
                  <template #suffix>
                    <img src="/assets/login/icon-login.png" width="15px" />
                  </template>
                </n-input>
              </n-form-item-row>
              <n-form-item-row>
                <n-input
                  show-password-on="click"
                  class="inputArea"
                  :placeholder="$t('login.password')"
                  type="password"
                  clearable
                  disabled
                />
              </n-form-item-row>
              <n-form-item-row>
                <n-input
                  show-password-on="click"
                  class="inputArea"
                  :placeholder="$t('login.passwordAgain')"
                  type="password"
                  clearable
                  disabled
                />
              </n-form-item-row>
            </n-form>
            <n-button type="primary" disabled class="loginButton">
              {{ $t("login.signup") }}
            </n-button>
          </n-tab-pane>
        </n-tabs>
      </n-card>
    </n-modal>
  </div>
  <Footer></Footer>
</template>

<script setup lang="ts">
import { ref, onMounted, onActivated } from "vue";
import { useResponsive } from "../layout/useResponsive";
// import Actions from "../components/blocks/Actions.vue";
import Header from "../components/utils/Header.vue";
import BlockAndActivity from "../components/blocks/BlockAndActivity.vue";
import Block from "../components/blocks/Block.vue";
import login from "../services/api/login.ts";
import { login as authcate } from "../services/api/getData.ts";
import Footer from "../components/utils/Footer.vue";
import {
  NButton,
  NModal,
  NForm,
  NInput,
  NFormItemRow,
  NGi,
  NGrid,
} from "naive-ui";
import router from "../router";
import { EncodeAPITargetLink } from "../services/utils.ts";
import getPath from "../services/getPath";
import { getUserUrl } from "../services/utils.ts";
import "../layout/loading.css";
import "../layout/startPage.css";
import storageManager from "../services/storage.ts";
import { useI18n } from "vue-i18n";
import Emitter from "../services/eventEmitter";
import { getDeviceInfo } from "../services/api/getDevice";
import { LogManager } from "../services/api/logWriter";
window.$Logger = LogManager;
const showLoginModal = ref(false);
const isLoading = ref(true);
const blocks = ref<any>([]);
const emailOrPhone = ref("");
const loginPassword = ref("");
const loginToken = ref("");
const authCode = ref("");

const { t, locale } = useI18n();

const user = ref({
  coins: 12345,
  gems: 12345,
  level: 12,
  username: t("user.clickToLogin"),
  avatarUrl: getPath("/@base/assets/user/default-avatar.png"),
  ID: "",
});

const { blockItemsPerRow, maxProjectsPerBlock } = useResponsive();

onMounted(async () => {
  const userInfo = storageManager.getObj("userInfo");
  if (userInfo.status === "success" && userInfo.value?.loginStatus === true) {
    const res = await login(userInfo.value.token, userInfo.value.authCode);
    loadPageData(res);
  } else {
    const res = await login(null, null);
    loadPageData(res);
  }
});

onActivated(() => {
  window.$Logger.logPageView({
    pageLink: "/",
    timeStamp: Date.now(),
  });
});

async function handlePasswordLogin() {
  let res = await authcate(emailOrPhone.value, loginPassword.value, false);
  if (res.Status !== 200) {
    window.$message.error(res.Message);
    return;
  }
  res.Data.Library = { Blocks: blocks.value };
  loadPageData(res);
}

async function handleTokenLogin() {
  const res = await login(loginToken.value, authCode.value);
  if (res.Status !== 200) {
    window.$message.error(res.Message);
    return;
  }
  res.Data.Library = { Blocks: blocks.value };
  loadPageData(res);
}

/**
 * update blocks and user data
 */
async function loadPageData(response: any) {
  isLoading.value = false;
  showLoginModal.value = false;
  Emitter.emit("updateTagConfig", response.Data.ContentTags);
  blocks.value = [...response.Data.Library.Blocks];
  const userData = response.Data.User;
  user.value = {
    coins: userData.Gold,
    gems: userData.Diamond,
    level: userData.Level,
    username: userData.Nickname || t("user.clickToLogin"),
    avatarUrl: getUserUrl(userData),
    ID: userData.ID,
  };

  window.$Logger.logPageView({
    pageLink: "/Account/Login/",
    timeStamp: Date.now(),
  });

  if (!response.Data.User?.Nickname) {
    if (storageManager.getObj("userInfo").status === "empty") {
      // 退出登录后至少得保证有一个匿名的token
      // assure there is at least an anonymous token after logout
      storageManager.setObj("userInfo", {
        token: response.Token,
        authCode: response.AuthCode,
        loginStatus: false,
      });
    }
  } else {
    storageManager.setObj("userInfo", {
      token: response.Token,
      authCode: response.AuthCode,
      loginStatus: true,
      id: userData.ID,
      nickName: userData.Nickname,
    });
    const info = getDeviceInfo();
    LogManager.logSession({
      deviceID: info.Identifier,
      version: "2411",
      region: navigator.language,
      timezone: info.timeZone,
      language: locale.value,
      screenSize: info.screenSize,
      timestamp: Date.now(),
      userID: userData.ID,
    });
  }
}

function showModalFn() {
  if (storageManager.getObj("userInfo").value?.loginStatus === true) {
    router.push(`/profile/${user.value.ID}`);
    window.$Logger.logPageView({
      pageLink: "/Profile/",
      timeStamp: Date.now(),
    });
  } else {
    showLoginModal.value = true;
  }
}
</script>

<style scoped>
/* Header插槽 start */
.user {
  display: flex;
  align-items: center;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.user-info {
  flex-grow: 1;
  padding-left: 10px;
}

.username {
  white-space: nowrap;
  text-align: center;
}

.level {
  color: #777;
  white-space: nowrap;
}

.resources {
  display: flex;
  align-items: center;
}

.resource {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

.icon {
  width: 20px;
  height: 20px;
  margin-right: 5px;
  margin-left: 5px;
}

.gems {
  height: 28px;
  width: 28px;
}
/* Header插槽 end */

/* 登录表单 start */
.inputArea {
  margin: 1%;
  padding: 0;
  border-radius: 10px;
}

.loginButton {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border: none;
  border-radius: 10px;
}

/* 登录表单 end */

.block {
  height: 100%;
}

.div {
  box-sizing: border-box;
}
</style>
