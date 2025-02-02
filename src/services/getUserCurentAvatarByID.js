import { getData } from "./getData";

/**
 * 根据ID获取用户头像，默认缓存，三秒超时
 * @param {string} 用户ID
 * @param {boolean} useCache=true
 * @returns {string} url
 */

export async function getAvatarUrl(ID, useCache = true) {
  let avatarIndex = 0;
  const cache = (useCache && JSON.parse(localStorage.getItem("userIDAndAvartarIDMap"))) || {};
  // 72小时缓存
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
        setTimeout(() => reject(new Error("请求超时")), 3000); // 3秒超时
      });

      // 使用Promise.race来处理请求和超时
      const response = await Promise.race([
        getData("/Users/GetUser", { ID }),
        timeoutPromise
      ]);

      avatarIndex = response.Data.User.Avatar;
      cache[ID] = [avatarIndex, Date.now()];
      localStorage.setItem("userIDAndAvartarIDMap", JSON.stringify(cache));
    } catch (error) {
      console.error("获取头像失败", error);
      // 返回默认头像的URL
      return "/src/assets/user/default-avatar.png";
    }
  }
  return avatarIndex === 0
    ? "/src/assets/user/default-avatar.png"
    : `/static/users/avatars/${ID.slice(0, 4)}/${ID.slice(4, 6)}/${ID.slice(6, 8)}/${ID.slice(
        8,
        24
      )}/${avatarIndex}.jpg!small.round`;
}
