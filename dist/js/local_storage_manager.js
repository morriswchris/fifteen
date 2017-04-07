"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

window.fakeStorage = {
  _data: {},

  setItem: function setItem(id, val) {
    return this._data[id] = String(val);
  },
  getItem: function getItem(id) {
    return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
  },
  removeItem: function removeItem(id) {
    return delete this._data[id];
  },
  clear: function clear() {
    return this._data = {};
  }
};

var LocalStorageManager = function () {
  function LocalStorageManager() {
    _classCallCheck(this, LocalStorageManager);

    this.bestlevelKey = "bestlevel";
    this.gameStateKey = "gameState";

    var supported = this.localStorageSupported();
    this.storage = supported ? window.localStorage : window.fakeStorage;
  }

  _createClass(LocalStorageManager, [{
    key: "localStorageSupported",
    value: function localStorageSupported() {
      var testKey = "test";
      var storage = window.localStorage;

      try {
        storage.setItem(testKey, "1");
        storage.removeItem(testKey);
        return true;
      } catch (error) {
        return false;
      }
    }
  }, {
    key: "getBestlevel",
    value: function getBestlevel() {
      return this.storage.getItem(this.bestlevelKey) || 0;
    }
  }, {
    key: "setBestlevel",
    value: function setBestlevel(level) {
      this.storage.setItem(this.bestlevelKey, level);
    }
  }, {
    key: "getGameState",
    value: function getGameState() {
      var stateJSON = this.storage.getItem(this.gameStateKey);
      return stateJSON ? JSON.parse(stateJSON) : null;
    }
  }, {
    key: "setGameState",
    value: function setGameState(gameState) {
      this.storage.setItem(this.gameStateKey, JSON.stringify(gameState));
    }
  }, {
    key: "clearGameState",
    value: function clearGameState() {
      this.storage.removeItem(this.gameStateKey);
    }
  }]);

  return LocalStorageManager;
}();