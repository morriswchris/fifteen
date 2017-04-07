"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HTMLActuator = function () {
  function HTMLActuator() {
    _classCallCheck(this, HTMLActuator);

    this.tileContainer = document.querySelector(".tile-container");
    this.levelContainer = document.querySelector(".level-container");
    this.bestContainer = document.querySelector(".best-container");
    this.messageContainer = document.querySelector(".game-message");

    this.level = 0;
  }

  _createClass(HTMLActuator, [{
    key: "actuate",
    value: function actuate(grid, metadata) {
      var self = this;

      window.requestAnimationFrame(function () {
        self.clearContainer(self.tileContainer);

        grid.cells.forEach(function (column) {
          column.forEach(function (cell) {
            if (cell) {
              self.addTile(cell);
            }
          });
        });

        self.updatelevel(metadata.level);
        self.updateBestlevel(metadata.bestlevel);

        if (metadata.terminated) {
          if (metadata.over) {
            self.message(true); // You lose
          } else if (metadata.won) {
            self.message(true); // You win!
          }
        }
      });
    }
  }, {
    key: "continueGame",
    value: function continueGame() {
      this.clearMessage();
    }
  }, {
    key: "clearContainer",
    value: function clearContainer(container) {
      while (container && container.firstChild) {
        container.removeChild(container.firstChild);
      }
    }
  }, {
    key: "addTile",
    value: function addTile(tile) {
      var self = this;

      var wrapper = document.createElement("div");
      var inner = document.createElement("div");
      var position = tile.previousPosition || { x: tile.x, y: tile.y };
      var positionClass = this.positionClass(position);

      // We can't use classlist because it somehow glitches when replacing classes
      var classes = ["tile", "tile-" + tile.value, positionClass];

      if (tile.value > 2048) classes.push("tile-super");

      this.applyClasses(wrapper, classes);

      inner.classList.add("tile-inner");
      inner.textContent = tile.value;

      if (tile.previousPosition) {
        // Make sure that the tile gets rendered in the previous position first
        window.requestAnimationFrame(function () {
          classes[2] = self.positionClass({ x: tile.x, y: tile.y });
          self.applyClasses(wrapper, classes); // Update the position
        });
      } else if (tile.mergedFrom) {
        classes.push("tile-merged");
        this.applyClasses(wrapper, classes);

        // Render the tiles that merged
        tile.mergedFrom.forEach(function (merged) {
          self.addTile(merged);
        });
      } else {
        classes.push("tile-new");
        this.applyClasses(wrapper, classes);
      }

      // Add the inner part of the tile to the wrapper
      wrapper.appendChild(inner);

      // Put the tile on the board
      this.tileContainer.appendChild(wrapper);
    }
  }, {
    key: "applyClasses",
    value: function applyClasses(element, classes) {
      element.setAttribute("class", classes.join(" "));
    }
  }, {
    key: "normalizePosition",
    value: function normalizePosition(position) {
      return { x: position.x + 1, y: position.y + 1 };
    }
  }, {
    key: "positionClass",
    value: function positionClass(position) {
      position = this.normalizePosition(position);
      return "tile-position-" + position.x + "-" + position.y;
    }
  }, {
    key: "updatelevel",
    value: function updatelevel(level) {
      this.clearContainer(this.levelContainer);

      var difference = level - this.level;
      this.level = level;

      // TODO: enable when we do multiple levels to solve
      if (false) {
        //if (difference > 0) {
        this.levelContainer.textContent = this.level;
        var addition = document.createElement("div");
        addition.classList.add("level-addition");
        addition.textContent = "+" + difference;

        this.levelContainer.appendChild(addition);
      }
    }
  }, {
    key: "updateBestlevel",
    value: function updateBestlevel(bestlevel) {
      //TODO: enable when we have levels
      return;
      // this.bestContainer.textContent = bestlevel;
    }
  }, {
    key: "message",
    value: function message(won) {
      var type = won ? "game-won" : "game-over";
      var message = won ? "You win!" : "Game over!";

      this.messageContainer.classList.add(type);
      this.messageContainer.getElementsByTagName("p")[0].textContent = message;
    }
  }, {
    key: "clearMessage",
    value: function clearMessage() {
      // IE only takes one value to remove at a time.
      this.messageContainer.classList.remove("game-won");
      this.messageContainer.classList.remove("game-over");
    }
  }]);

  return HTMLActuator;
}();