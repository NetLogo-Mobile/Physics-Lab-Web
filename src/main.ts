import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import {
  NButton,
  NInput,
  NDivider,
  NModal,
  NCard,
  NMessageProvider,
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
    NTabs,
    NTabPane,
    NEllipsis,
  ],
});

const app = createApp(App);
app.use(naive);
app.use(router);
app.mount("#app");
