import Emitter from "../eventEmitter.ts";
import translateErrorMessage from "./translateErrorMessage";
import storageManager from "../storage.ts";

interface IResponse {
  Status: number;
  Message: string;
  Data: any;
}
interface IIntercetporResponse {
  continue: boolean;
  data: IResponse | null;
}

const noMessagesPath = ["/Users/GetUser"];

const initialHistory = storageManager.get("requestHistoryMap") || {};
const requestHistoryMap = new Map<string, number[]>(Object.entries(initialHistory));

function rateLimit(path: string): boolean {
  const history = requestHistoryMap.get(path) || [];

  if (!requestHistoryMap.has(path)) {
    requestHistoryMap.set(path, [Date.now()]);
    return false;
  }

  if (history.length > 10) {
    requestHistoryMap.set(path, history.slice(1));
  }

  switch (path) {
    case "/Messages/PostComment":
      const list = history;
      let n = 0;
      for (let i = list.length - 1; i >= 0; i--) {
        n++;
        if (Math.sqrt(Date.now() / 1000 - list[i] / 1000) < n) {
          return true;
        }
      }
  }
  requestHistoryMap.set(path, [...history, Date.now()]);
  storageManager.set("requestHistoryMap", Object.fromEntries(requestHistoryMap));
  return false;
}

export function beforeRequest(path: string, body: any): IIntercetporResponse {
  window.$message.destroyAll();
  if (rateLimit(path)) {
    return {
      continue: false,
      data: { Status: -1001, Message: "连接失败，请稍候重试", Data: null },
    };
  }
  noMessagesPath.some((p) => path === p) || Emitter.emit("loading", "正在与服务器通信...", 40);
  return { continue: true, data: null };
}

export function afterRequest(response: IResponse): IIntercetporResponse {
  window.$message.destroyAll();
  let re = response
  if (response.Status !== 200){
    re.Message = translateErrorMessage(response.Message)
  }
  return {
    continue: false,
    data: re,
  };
}
