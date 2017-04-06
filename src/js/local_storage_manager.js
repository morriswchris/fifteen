window.fakeStorage = {
  _data: {},

  setItem(id, val) {
    return this._data[id] = String(val);
  },

  getItem(id) {
    return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
  },

  removeItem(id) {
    return delete this._data[id];
  },

  clear() {
    return this._data = {};
  }
};

class LocalStorageManager {
  constructor() {
    this.bestlevelKey = "bestlevel";
    this.gameStateKey = "gameState";

    const supported = this.localStorageSupported();
    this.storage = supported ? window.localStorage : window.fakeStorage;
  }

  localStorageSupported() {
    const testKey = "test";
    const storage = window.localStorage;

    try {
      storage.setItem(testKey, "1");
      storage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  getBestlevel() {
    return this.storage.getItem(this.bestlevelKey) || 0;
  }

  setBestlevel(level) {
    this.storage.setItem(this.bestlevelKey, level);
  }

  getGameState() {
    const stateJSON = this.storage.getItem(this.gameStateKey);
    return stateJSON ? JSON.parse(stateJSON) : null;
  }

  setGameState(gameState) {
    this.storage.setItem(this.gameStateKey, JSON.stringify(gameState));
  }

  clearGameState() {
    this.storage.removeItem(this.gameStateKey);
  }
}
