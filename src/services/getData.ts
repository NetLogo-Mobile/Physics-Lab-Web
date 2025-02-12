import Emitter from "./eventEmitter";
import translateErrorMessage from "./translateErrorMessage";

const noMessagesPath = ["/Users/GetUser"];

export async function getData(path: String, body: any) {
  window.$message.destroyAll();
  noMessagesPath.some((p) => path === p) || Emitter.emit("loading", "正在与服务器通信...", 10);
  return fetch("http://physics-api-cn.turtlesim.com:80" + path, {
    method: "POST",
    body: JSON.stringify(body),
    // @ts-ignore
    headers: {
      "Content-Type": "application/json",
      "x-API-Token": localStorage.getItem("token") || undefined,
      "x-API-AuthCode": localStorage.getItem("authCode") || undefined,
    },
  }).then((response) => {
    if (!response.ok) {
      return response.json().then(() => {
        Emitter.emit("error", "无法与服务器通讯，请稍候再试", 3);
      });
    }
    return response.json().then((data) => {
      window.$message.destroyAll();
      if (data.Status == 403 && localStorage.getItem("loginStatus") !== "true") {
        Emitter.emit("loginRequired");
        Emitter.emit("error", translateErrorMessage(data.Message), 3);
      } else if (data.Status !== 200) {
        noMessagesPath.some((p) => path === p) ||Emitter.emit("error", translateErrorMessage(data.Message), 3);
      }
      return data;
    });
  });
}

export async function login(arg1: String | null, arg2: String | null, is_token = false) {
  window.$message.destroyAll();
  Emitter.emit("loading", "正在与服务器通信...", 10);
  let username = is_token ? null : arg1;
  let password = is_token ? null : arg2;
  let header = { "Content-Type": "application/json" };
  if (is_token && arg1 && arg2) {
    // @ts-ignore
    header["x-API-Token"] = arg1;
    // @ts-ignore
    header["x-API-AuthCode"] = arg2;
  }
  return fetch("http://physics-api-cn.turtlesim.com:80/Users/Authenticate", {
    method: "POST",
    body: JSON.stringify({
      Login: username,
      Password: password,
      Version: 2411,
      Device: {
        Identifier: "7db01528cf13e2199e141c402d79190e",
        Language: "Chinese",
      },
    }),
    headers: header,
  }).then(async (response) => {
    if (!response.ok) {
      return response.json().then(() => {
        Emitter.emit("error", "无法与服务器通讯，请稍候再试", 3);
      });
    }
    return response.json().then((data) => {
      if (data.Status === 403) {
        Emitter.emit("error", "用户名或密码错误", 3);
        throw "不必在意的错误";
      } else if (data.Status !== 200) {
        Emitter.emit("error", translateErrorMessage(data.Message), 3);
      }
      window.$message.destroyAll();
      password && localStorage.setItem("loginStatus", "true");
      password && Emitter.emit("success", "登录成功", 1);
      return data;
    });
  });
}
