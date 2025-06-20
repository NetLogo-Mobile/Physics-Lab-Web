import Emitter from "../eventEmitter.ts";
import { beforeRequest, afterRequest } from "./Interceptor.ts";
import storageManager from "../storage.ts";
import i18n from "../i18n/i18n.ts";

export async function getData(path: string, body: unknown) {
  window.$message.destroyAll();
  const beforeRes = beforeRequest(path);
  if (beforeRes.continue === false) {
    return beforeRes.data;
  }
  return fetch(window.$getPath("/@api" + path), {
    method: "POST",
    body: JSON.stringify(body),
    // @ts-expect-error 暂无类型信息 There is no type information
    headers: {
      "Content-Type": "application/json",
      "x-API-Token": storageManager.getStr("token").value || undefined,
      "x-API-AuthCode": storageManager.getStr("authCode").value || undefined,
    },
  }).then((response) => {
    window.$message.destroyAll();
    if (!response.ok) {
      return response.json().then(() => {
        Emitter.emit("error", "无法与服务器通讯，请稍候再试", 3);
      });
    }
    return response.json().then((data) => {
      const afterRes = afterRequest(data);
      if (afterRes.continue === false) {
        return afterRes.data;
      }
      return data;
    });
  });
}

export async function login(
  arg1: string | null,
  arg2: string | null,
  is_token = false,
) {
  window.$message.destroyAll();
  Emitter.emit("loading", "正在与服务器通信...", 50);
  let username = is_token ? null : arg1;
  let password = is_token ? null : arg2;
  let header = { "Content-Type": "application/json" };
  if (is_token && arg1 && arg2) {
    // @ts-expect-error 暂无类型信息 There is no type information
    header["x-API-Token"] = arg1;
    // @ts-expect-error 暂无类型信息 There is no type information
    header["x-API-AuthCode"] = arg2;
  }
  return fetch(window.$getPath("/@api/Users/Authenticate"), {
    method: "POST",
    body: JSON.stringify({
      Login: username,
      Password: password,
      Version: 2411,
      Device: {
        Identifier: "7db01528cf13e2199e141c402d79190e",
        Language: i18n.global.locale.value,
      },
    }),
    headers: header,
  }).then(async (response) => {
    window.$message.destroyAll();
    if (!response.ok) {
      return response.json().then(() => {
        Emitter.emit("error", "无法与服务器通讯，请稍候再试", 3);
      });
    }
    return response.json().then((data) => {
      window.$message.destroyAll();
      if (password) {
        storageManager.setStr("loginStatus", "true", 10 * 24 * 60 * 60 * 1000);
        Emitter.emit("success", "登录成功", 1);
      }
      return data;
    });
  });
}
