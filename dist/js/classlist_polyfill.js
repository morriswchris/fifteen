"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  if (typeof window.Element === "undefined" || "classList" in document.documentElement) {
    return;
  }

  var prototype = Array.prototype,
      push = prototype.push,
      splice = prototype.splice,
      join = prototype.join;

  var DOMTokenList = function () {
    function DOMTokenList(el) {
      _classCallCheck(this, DOMTokenList);

      this.el = el;
      // The className needs to be trimmed and split on whitespace
      // to retrieve a list of classes.
      var classes = el.className.replace(/^\s+|\s+$/g, '').split(/\s+/);
      for (var _i = 0; _i < classes.length; _i++) {
        push.call(this, classes[_i]);
      }
    }

    _createClass(DOMTokenList, [{
      key: "add",
      value: function add(token) {
        if (this.contains(token)) return;
        push.call(this, token);
        this.el.className = this.toString();
      }
    }, {
      key: "contains",
      value: function contains(token) {
        return this.el.className.indexOf(token) != -1;
      }
    }, {
      key: "item",
      value: function item(index) {
        return this[index] || null;
      }
    }, {
      key: "remove",
      value: function remove(token) {
        if (!this.contains(token)) return;
        for (var _i2 = 0; _i2 < this.length; _i2++) {
          if (this[_i2] == token) break;
        }
        splice.call(this, i, 1);
        this.el.className = this.toString();
      }
    }, {
      key: "toString",
      value: function toString() {
        return join.call(this, ' ');
      }
    }, {
      key: "toggle",
      value: function toggle(token) {
        if (!this.contains(token)) {
          this.add(token);
        } else {
          this.remove(token);
        }

        return this.contains(token);
      }
    }]);

    return DOMTokenList;
  }();

  window.DOMTokenList = DOMTokenList;

  function defineElementGetter(obj, prop, getter) {
    if (Object.defineProperty) {
      Object.defineProperty(obj, prop, {
        get: getter
      });
    } else {
      obj.__defineGetter__(prop, getter);
    }
  }

  defineElementGetter(HTMLElement.prototype, 'classList', function () {
    return new DOMTokenList(this);
  });
})();