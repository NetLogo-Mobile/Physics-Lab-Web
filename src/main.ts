import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import i18n from "./services/i18n/i18n.js";
import { LogManager } from "./services/api/logWriter.js";
import getPath from "./services/getPath.ts";
import ErrorLogger from "./services/errorLogger";
import { vaporInteropPlugin } from "vue";
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
app.use(vaporInteropPlugin);
window.$Logger = LogManager;
window.$getPath = getPath;
const errorLogger = new ErrorLogger(app);
window.$ErrorLogger = errorLogger;
app.mount("#app");
