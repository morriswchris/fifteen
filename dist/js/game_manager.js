"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GameManager = function () {
  function GameManager(size, InputManager, Actuator, StorageManager) {
    _classCallCheck(this, GameManager);

    this.size = size; // Size of the grid
    this.inputManager = new InputManager();
    this.storageManager = new StorageManager();
    this.actuator = new Actuator();

    this.startTiles = 15;

    this.inputManager.on("move", this.move.bind(this));
    this.inputManager.on("restart", this.restart.bind(this));
    this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));

    this.setup();
  }

  _createClass(GameManager, [{
    key: "restart",
    value: function restart() {
      this.storageManager.clearGameState();
      this.actuator.continueGame(); // Clear the game won/lost message
      this.setup();
    }
  }, {
    key: "keepPlaying",
    value: function keepPlaying() {
      this.keepPlaying = true;
      this.actuator.continueGame(); // Clear the game won/lost message
    }
  }, {
    key: "isGameTerminated",
    value: function isGameTerminated() {
      return this.over || this.won && !this.keepPlaying;
    }
  }, {
    key: "setup",
    value: function setup() {
      var previousState = this.storageManager.getGameState();

      // Reload the game from a previous game if present
      if (previousState) {
        this.grid = new Grid(previousState.grid.size, previousState.grid.cells); // Reload grid
        this.level = previousState.level;
        this.over = previousState.over;
        this.won = previousState.won;
        this.keepPlaying = previousState.keepPlaying;
      } else {
        this.grid = new Grid(this.size);
        this.level = this.startTiles;
        this.over = false;
        this.won = false;
        this.keepPlaying = false;

        // Add the initial tiles
        this.addStartTiles();
      }

      // Update the actuator
      this.actuate();
    }
  }, {
    key: "addStartTiles",
    value: function addStartTiles() {
      for (var i = 1; i <= this.startTiles; i++) {
        this.addRandomTile(i);
      }
    }
  }, {
    key: "addRandomTile",
    value: function addRandomTile(value) {
      if (this.grid.cellsAvailable()) {
        var tile = new Tile(this.grid.randomAvailableCell(), value);
        this.grid.insertTile(tile);
      }
    }
  }, {
    key: "actuate",
    value: function actuate() {
      if (this.storageManager.getBestlevel() < this.level) {
        this.storageManager.setBestlevel(this.level);
      }

      // Clear the state when the game is over (game over only, not win)
      if (this.over) {
        this.storageManager.clearGameState();
      } else {
        this.storageManager.setGameState(this.serialize());
      }

      this.actuator.actuate(this.grid, {
        level: this.level,
        over: this.over,
        won: this.won,
        bestlevel: this.storageManager.getBestlevel(),
        terminated: this.isGameTerminated()
      });
    }
  }, {
    key: "serialize",
    value: function serialize() {
      return {
        grid: this.grid.serialize(),
        level: this.level,
        over: this.over,
        won: this.won,
        keepPlaying: this.keepPlaying
      };
    }
  }, {
    key: "prepareTiles",
    value: function prepareTiles() {
      this.grid.eachCell(function (x, y, tile) {
        if (tile) {
          tile.mergedFrom = null;
          tile.savePosition();
        }
      });
    }
  }, {
    key: "moveTile",
    value: function moveTile(tile, cell) {
      this.grid.cells[tile.x][tile.y] = null;
      this.grid.cells[cell.x][cell.y] = tile;
      tile.updatePosition(cell);
    }
  }, {
    key: "move",
    value: function move(direction) {
      // 0: up, 1: right, 2: down, 3: left
      var self = this;

      if (this.isGameTerminated()) return;

      var cell = void 0,
          tile = void 0;

      var vector = this.getVector(direction);
      var traversals = this.buildTraversals(vector);
      var moved = false;
      var tileCount = 1;
      var correctness = true;

      // Save the current tile positions and remove merger information
      this.prepareTiles();

      // Traverse the grid in the right direction and move tiles
      traversals.y.forEach(function (y) {
        traversals.x.forEach(function (x) {
          cell = { x: x, y: y };
          tile = self.grid.cellContent(cell);

          if (tile && !moved) {
            var positions = self.findFarthestPosition(cell, vector);

            // Only one merger per row traversal?
            self.moveTile(tile, positions.farthest);

            if (!self.positionsEqual(cell, tile)) {
              moved = true; // The tile moved from its original cell!
            }
          }
          if (correctness && tile && tile.value !== tileCount) {
            correctness = false;
          }
          tileCount++;
        });
      });
      if (correctness || moved) {
        this.over = correctness; // Game over!
        this.actuate();
      }
    }
  }, {
    key: "getVector",
    value: function getVector(direction) {
      // Vectors representing tile movement
      var map = {
        0: { x: 0, y: -1 }, // Up
        1: { x: 1, y: 0 }, // Right
        2: { x: 0, y: 1 }, // Down
        3: { x: -1, y: 0 } // Left
      };

      return map[direction];
    }
  }, {
    key: "buildTraversals",
    value: function buildTraversals(vector) {
      var traversals = { x: [], y: [] };

      for (var pos = 0; pos < this.size; pos++) {
        traversals.x.push(pos);
        traversals.y.push(pos);
      }
      return traversals;
    }
  }, {
    key: "findFarthestPosition",
    value: function findFarthestPosition(cell, vector) {
      var previous = void 0;

      // Progress towards the vector direction until an obstacle is found
      do {
        previous = cell;
        cell = { x: previous.x + vector.x, y: previous.y + vector.y };
      } while (this.grid.withinBounds(cell) && this.grid.cellAvailable(cell));

      return {
        farthest: previous,
        next: cell // Used to check if a merge is required
      };
    }
  }, {
    key: "movesAvailable",
    value: function movesAvailable() {
      // TODO: rewrite so that we calculate if the game is over (in order)
      return true;
    }
  }, {
    key: "positionsEqual",
    value: function positionsEqual(first, second) {
      return first.x === second.x && first.y === second.y;
    }
  }]);

  return GameManager;
}();