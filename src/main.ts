import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import i18n from "./services/i18n/i18n.js";
import {
  NButton,
  NInput,
  NDivider,
  NModal,
  NCard,
  NMessageProvider,
  NDialogProvider,
  NTabs,
  NTabPane,
  NEllipsis,
  create,
} from "naive-ui";

const naive = create({
  components: [
    NButton,
    NInput,
    NDivider,
    NModal,
    NCard,
    NMessageProvider,
    NDialogProvider,
    NTabs,
    NTabPane,
    NEllipsis,
  ],
});

const app = createApp(App);
app.use(naive);
app.use(router);
app.use(i18n);
app.mount("#app");
