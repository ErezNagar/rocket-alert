import Util from "./util";

/*
 An caching interface for locaStorage
*/

const set = (key, value) => localStorage.setItem(key, value);
const get = (key) => localStorage.getItem(key);

const Cache = {
  canUseCache: () => Util.isLocalStorageAvailable(),
  set,
  get,
  setJSON: (key, value) => set(key, JSON.stringify(value)),
  getJSON: (key) => JSON.parse(get(key)),
};

export default Cache;
