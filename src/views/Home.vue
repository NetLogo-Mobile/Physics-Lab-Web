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
      <div v-if="isLoading" class="loading"></div>
      <div v-if="!isLoading" class="block-container">
        <n-grid :x-gap="12" :y-gap="12" :cols="itemsPerRow">
          <n-gi>
            <Actions />
          </n-gi>
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
                    <img src="/assets/login/icon-login.png" width="15px" />
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
              <input v-model="rememberMe" type="checkbox" />
              <label>{{ $t("login.rememberMe") }}</label>
            </n-form>
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
              <input v-model="rememberMe" type="checkbox" />
              <label>{{ $t("login.rememberMe") }}</label>
            </n-form>
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
import { ref, onMounted } from "vue";
import { useResponsive } from "../layout/useResponsive";
import Actions from "../components/blocks/Actions.vue";
import Header from "../components/utils/Header.vue";
import BlockAndActivity from "../components/blocks/BlockAndActivity.vue";
import Block from "../components/blocks/Block.vue";
import { login } from "../services/api/getData.ts";
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

const showLoginModal = ref(false);
const isLoading = ref(true);
const blocks = ref<any>([]);
const emailOrPhone = ref("");
const loginPassword = ref("");
const loginToken = ref("");
const authCode = ref("");
const rememberMe = ref(false);

const { t } = useI18n();

const user = ref({
  coins: 12345,
  gems: 12345,
  level: 12,
  username: t("user.clickToLogin"),
  avatarUrl: getPath("/@base/assets/user/default-avatar.png"),
  ID: "",
});

const { itemsPerRow, maxProjectsPerBlock } = useResponsive();

onMounted(async () => {
  await handleLogin(async () => {
    let _data = undefined;
    const tokenResult = storageManager.getStr("token");
    const authCodeResult = storageManager.getStr("authCode");
    _data = await login(tokenResult.value, authCodeResult.value, true);
    if (_data.Status != 200) {
      window.$message.error("自动登录失败");
      _data = await login(null, null);
    }
    storageManager.setStr("token", _data.Token, 10 * 24 * 60 * 60 * 1000); // token保存十天
    storageManager.setStr("authCode", _data.AuthCode, 10 * 24 * 60 * 60 * 1000);
    return _data;
  });
});

/**
 * 处理登录流程的装饰器函数，包含通用登录逻辑
 * @param {Function} loginMethod - 具体的登录方法（密码登录或token登录）
 * @returns {Promise<void>}
 * @description
 * - 执行登录操作并处理响应
 * - 存储认证信息到本地
 * - 更新用户状态和页面数据
 */
async function handleLogin(loginMethod: () => Promise<any>) {
  try {
    const response = await loginMethod();

    if (response.Status !== 200) {
      window.$message.error(t("login.loginFailed"));
      storageManager.setStr("loginStatus", "false", 24 * 60 * 60 * 1000);
      return;
    }

    // 存储认证信息
    const tokenTTL = rememberMe.value
      ? 10 * 24 * 60 * 60 * 1000
      : 24 * 60 * 60 * 1000;
    storageManager.setStr("token", response.Token, tokenTTL);
    storageManager.setStr("authCode", response.AuthCode, tokenTTL);

    // 更新用户信息
    updateUserProfile(response.Data.User);

    // 加载页面数据
    await loadPageData(response);

    isLoading.value = false;
  } catch (error) {
    window.$message.error("登录过程中发生错误");
    console.error("Login error:", error);
  }
}

/**
 * 更新用户个人信息
 * @param {Object} userData - 用户数据对象
 */
function updateUserProfile(userData: any) {
  storageManager.setStr("nickName", userData.Nickname);
  storageManager.setStr("userID", userData.ID);
  user.value = {
    coins: userData.Gold,
    gems: userData.Diamond,
    level: userData.Level,
    username: userData.Nickname || t("user.clickToLogin"),
    avatarUrl: getUserUrl(userData),
    ID: userData.ID,
  };
}

/**
 * 加载页面所需数据
 * @param {Object} response - 登录响应数据
 */
async function loadPageData(response: any) {
  if (response.Data.User.Nickname) {
    const refreshedData = await login(null, null);
    blocks.value = refreshedData.Data.Library.Blocks;
  } else {
    blocks.value = response.Data.Library.Blocks;
  }
}

// 修改后的登录处理函数
async function handlePasswordLogin() {
  await handleLogin(async () => login(emailOrPhone.value, loginPassword.value));
  showLoginModal.value = false;
}

async function handleTokenLogin() {
  await handleLogin(async () => login(loginToken.value, authCode.value, true));
  showLoginModal.value = false;
}

function showModalFn() {
  if (storageManager.getStr("loginStatus").value === "true") {
    router.push(`/profile/${user.value.ID}`);
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
