import Emitter from "../eventEmitter";
import storageManager from "../storage";
import { login } from "./getData";

/**
 * 登录并且获取首页的作品数据，null为匿名登录
 * Login and also get library data on Home.vue, null means anonymous login
 * @param a token or username or null
 * @param b authcode or password or null
 */
export default async function (a: string | null, b: string | null) {
  if (a === null || b === null) {
    // 匿名登录 login anonymousl
    const res = await login(null, null, false);
    return res;
  } else if (b.length === 32 && a.length === 32) {
    // login by token and authcode
    const getLibraryData = login(null, null, true).then((res) => {
      return res.Data.Library;
    });
    const getUserData = login(a, b, true).then((res) => {
      if (res.Status === 200) {
        return res;
      } else {
        storageManager.remove("userInfo");
        Emitter.emit("error", res.Message, 3);
      }
    });
    return Promise.all([getLibraryData, getUserData]).then(
      ([library, user]) => {
        user.Data.Library = library;
        return user;
      },
    );
  } else {
    console.error(
      "login.ts 仅仅支持自动化登录，而自动化登录应当只使用token 和 authcode login.ts is only for automatic login, and automatic login should use token and authcode",
    );
  }
}
