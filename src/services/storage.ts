// 我们强制要求在使用本地存储获取变量是必须判断其状态
type StorageStatus = "success" | "expired" | "empty";

interface StorageResult<T> {
  status: StorageStatus;
  value: T | null;
}

function now() {
  return Date.now();
}

const storageManager = {
  getObj(key: string, maxAgeMs?: number): StorageResult<any> {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return { status: "empty", value: null };
      const { value, time, maxAgeMs: savedMaxAgeMs } = JSON.parse(raw);
      const ageLimit = maxAgeMs ?? savedMaxAgeMs;
      if (ageLimit && time && now() - time > ageLimit) {
        return { status: "expired", value: null };
      }
      return { status: "success", value };
    } catch (e) {
      console.error(e);
      return { status: "empty", value: null };
    }
  },
  getStr(key: string, maxAgeMs?: number): StorageResult<string> {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return { status: "empty", value: null };
      let obj;
      try {
        obj = JSON.parse(raw);
      } catch {
        obj = { value: raw, time: undefined, maxAgeMs: undefined };
      }
      const ageLimit = maxAgeMs ?? obj.maxAgeMs;
      if (ageLimit && obj.time && now() - obj.time > ageLimit) {
        return { status: "expired", value: null };
      }
      return { status: "success", value: obj.value ?? raw };
    } catch (e) {
      console.error(e);
      return { status: "empty", value: null };
    }
  },
  setObj(key: string, value: any, maxAgeMs?: number) {
    const data = { value, time: now(), maxAgeMs };
    localStorage.setItem(key, JSON.stringify(data));
  },
  setStr(key: string, value: string, maxAgeMs?: number) {
    const data = { value, time: now(), maxAgeMs };
    localStorage.setItem(key, JSON.stringify(data));
  },
  remove(key: string) {
    localStorage.removeItem(key);
  },
  clear() {
    localStorage.clear();
  },
};

export default storageManager;
