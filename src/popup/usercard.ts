import { createApp } from "vue";
import UserCard from "../components/popup/usercard.vue";

/**
 *调用本函数，传入userid，打开用户信息卡，无需处理任何关闭事件
 *
 * @param {string} userid
 */
export default async function showUserCard(userid: string) {
  const div = document.createElement("div");
  document.body.appendChild(div);
  const app = createApp(UserCard, {
    userid,
    close: () => {
      app.unmount();
      div.remove();
    },
  });
  app.mount(div);
}
