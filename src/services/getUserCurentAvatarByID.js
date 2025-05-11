import { getData } from "./api/getData";
import getPath from "./getPath";
import { getUserUrl } from "./utils";

let cache = JSON.parse(localStorage.getItem("userIDAndAvartarIDMap")) || {};

/**
 * 根据ID获取用户头像，默认缓存，5秒超时，调用本操作后，请等待全部异步结束之后调用saveCache()
 * @param {string} 用户ID
 * @param {boolean} useCache=true
 * @returns {string} url
 */

export async function getAvatarUrl(ID, useCache = true) {
  let avatarIndex = 0;
  // 72小时缓存
  // 注意，在任何getUser请求都会刷新本缓存
  if (
    useCache &&
    cache[ID] &&
    Math.abs(Date.now() - cache[ID][1]) < 72 * 60 * 60 * 1000 &&
    cache[ID][0] !== undefined &&
    cache[ID][0] !== null
  ) {
    avatarIndex = cache[ID][0];
  } else {
    try {
      // 创建一个新的Promise用于超时
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("请求超时")), 5000);
      });

      // 使用Promise.race来处理请求和超时
      const response = await Promise.race([getData("/Users/GetUser", { ID }), timeoutPromise]);

      avatarIndex = response.Data.User.Avatar;
      cache[ID] = [avatarIndex, Date.now()];
      localStorage.setItem("userIDAndAvartarIDMap", JSON.stringify(cache));
    } catch (error) {
      console.error("获取头像失败", error);
      // 返回默认头像的URL
      return getPath("/@base/assets/user/default-avatar.png");
    }
  }
  const user = { ID, Avatar: avatarIndex };
  return getUserUrl(user);
}

export function saveCache() {
  localStorage.setItem("userIDAndAvartarIDMap", JSON.stringify(cache));
}
