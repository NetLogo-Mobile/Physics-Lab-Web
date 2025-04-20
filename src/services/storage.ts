const storageManager = {
  get(key: string, isObject = true) {
    try {
      const data = localStorage.getItem(key);
      if(!data) return null;
      return isObject ? JSON.parse(data) : data;
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  set(key: string, value: any, isObject = true) {
    if (!isObject){
      localStorage.setItem(key, value);
    }
    localStorage.setItem(key, JSON.stringify(value));
  },

  remove(key: string) {
    localStorage.removeItem(key);
  },

  clear() {
    localStorage.clear();
  },
};

export default storageManager;
