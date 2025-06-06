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
        <!-- 用户刚刚解封会出现图片404，或许日后要把这个逻辑改为获取用户上一张头像，先暂时用默认头像 -->
        <div class="user-info">
          <div class="username">{{ user.username }}</div>
          <div class="level">Level {{ user.level }}</div>
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
    <!-- 高度：50px定值 -->
    <main>
      <div class="loading" v-if="loading"></div>
      <div class="block-container" v-if="!loading">
        <n-grid :x-gap="12" :y-gap="12" :cols="itemsPerRow">
          <n-gi>
            <Actions />
          </n-gi>
          <n-gi
            v-for="block in  blocks.filter((i:any)=>i.Summaries.length > 0)"
            :key="block.Subject"
          >
            <div class="block">
              <BlockAndActivity
                v-if="
                  block.$type.startsWith('Quantum.Models.Contents.TopicBlock')
                "
                type="Discussion"
                :projects="block.Summaries"
                :activityName="block.AuxiliaryText"
                :activityBackground="getPath('/@base/assets/support.png')"
                :projectsName="block.Subject"
                :link="targetLink(block.TargetLink)"
              />
              <Block
                v-else
                type="Discussion"
                :data="block.Summaries.slice(0, maxProjectsPerBlock)"
                :title="block.Header"
                :link="targetLink(block.TargetLink)"
              />
            </div>
          </n-gi>
        </n-grid>
      </div>
    </main>
    <n-modal v-model:show="showModal" style="border-radius: 10px">
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
          <n-tab-pane name="signin" tab="登录">
            <n-form :show-label="false">
              <n-form-item-row>
                <n-input
                  v-model:value="username"
                  class="inputArea"
                  placeholder="邮箱 / 手机"
                  clearable
                >
                  <template #suffix>
                    <img src="/assets/login/icon-login.png" width="15px" />
                  </template>
                </n-input>
              </n-form-item-row>
              <n-form-item-row>
                <n-input
                  v-model:value="password"
                  show-password-on="click"
                  class="inputArea"
                  placeholder="密码 6~20 位"
                  type="password"
                  clearable
                />
              </n-form-item-row>
              <input type="checkbox" v-model="memoryMe" />
              <label>记住我</label>
              <!-- <p style="color: red; font-size: small" v-if="memoryMe">
                注意：您的密码将会明文存储在本地浏览器中 Caution:Your password will be DIRECTLY saved in local web browser WITHOUT encryption
              </p> -->
            </n-form>
            <n-button type="primary" class="loginButton" @click="pswdLogin">
              确认
            </n-button>
          </n-tab-pane>
          <n-tab-pane name="signinByToken" tab="Token登录">
            <n-form :show-label="false">
              <n-form-item-row>
                <n-input
                  v-model:value="token"
                  class="inputArea"
                  placeholder="Token"
                  clearable
                >
                </n-input>
              </n-form-item-row>
              <n-form-item-row>
                <n-input
                  v-model:value="authCode"
                  class="inputArea"
                  placeholder="AuthCode"
                  clearable
                >
                </n-input>
              </n-form-item-row>
              <input type="checkbox" v-model="memoryMe" />
              <label>记住我</label>
            </n-form>
            <n-button type="primary" class="loginButton" @click="tokenLogin">
              确认
            </n-button>
          </n-tab-pane>
          <n-tab-pane name="signup" tab="注册">
            <h3 style="align-self: center;">暂不开放注册功能</h3>
            <n-form :showLabel="false">
              <n-form-item-row>
                <n-input
                  placeholder="邮箱"
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
                  placeholder="密码 6~20 位"
                  type="password"
                  clearable
                  disabled
                />
              </n-form-item-row>
              <n-form-item-row>
                <n-input
                  show-password-on="click"
                  class="inputArea"
                  placeholder="确认密码"
                  type="password"
                  clearable
                  disabled
                />
              </n-form-item-row>
            </n-form>
            <n-button type="primary" disabled class="loginButton">
              注册
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
import { useResponsive } from "../composables/useResponsive";
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
import { strToQueryObj as targetLink } from "../services/utils.ts";
import getPath from "../services/getPath";
import { getUserUrl } from "../services/utils.ts";
import "../layout/loading.css";
import "../layout/startPage.css";

const showModal = ref(false);
const loading = ref(true);
const blocks = ref<any>([]);
const username = ref("");
const password = ref("");
const token = ref("");
const authCode = ref("");

const user = ref({
  coins: 12345,
  gems: 12345,
  level: 12,
  username: "点击登录",
  avatarUrl: getPath("/@base/assets/user/default-avatar.png"),
  ID: "",
});

const { itemsPerRow, maxProjectsPerBlock } = useResponsive();

onMounted(async () => {
  await loginDecorator(async () => {
    let _data = undefined;
    _data = await login(
      localStorage.getItem("token"),
      localStorage.getItem("authCode"),
      true
    );
    if (_data.Status != 200) {
      window.$message.error("自动登录失败");
      _data = await login(null, null);
    }
    // 如果localStorage没保存的话，就将其保存。Save if localStorage haven't done this before.
    // 如果已保存的话，这只是个重复的操作。Repeated if already saved. No need for optimization.
    localStorage.setItem("token", _data.Token);
    localStorage.setItem("authCode", _data.AuthCode);
    return _data;
  });
});

/* A template for login's logic
 * @param callback(async function): Injected dependence of login (to support both password and token login style)
 */
async function loginDecorator(callback: Function) {
  const loginResponse = await callback();
  if (loginResponse.Status != 200) {
    localStorage.setItem("loginStatus", "false");
    return;
  }
  if (
    memoryMe.value == false &&
    localStorage.getItem("loginStatus") === "false"
  ) {
    // 只有在主动登录时才有这一步判断，略去undifined或null
    localStorage.setItem("loginStatus", "false");
  } else {
    localStorage.setItem("token", loginResponse.Token);
    localStorage.setItem("authCode", loginResponse.AuthCode);
  }
  let userData = loginResponse.Data.User;
  localStorage.setItem("nickName", userData.Nickname);
  localStorage.setItem("userID", userData.ID);
  user.value = {
    coins: userData.Gold,
    gems: userData.Diamond,
    level: userData.Level,
    username: userData.Nickname || "点击登录",
    avatarUrl: getUserUrl(userData),
    ID: userData.ID,
  };

  if (userData.Nickname != null) {
    const re = await login(null, null);
    blocks.value = re.Data.Library.Blocks;
  } else {
    blocks.value = loginResponse.Data.Library.Blocks;
  }

  loading.value = false;
}

function showModalFn() {
  localStorage.getItem("loginStatus") === "true"
    ? router.push(`/profile/${user.value.ID}`)
    : (showModal.value = true);
}

async function pswdLogin() {
  await loginDecorator(async () => login(username.value, password.value));
  showModal.value = false;
}

async function tokenLogin() {
  await loginDecorator(async () => login(token.value, authCode.value, true));
  showModal.value = false;
}

const memoryMe = ref(false);
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
