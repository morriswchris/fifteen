"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Grid = function () {
  function Grid(size, previousState) {
    _classCallCheck(this, Grid);

    this.size = size;
    this.cells = previousState ? this.fromState(previousState) : this.empty();
  }

  _createClass(Grid, [{
    key: "empty",
    value: function empty() {
      var cells = [];

      for (var x = 0; x < this.size; x++) {
        var row = cells[x] = [];

        for (var y = 0; y < this.size; y++) {
          row.push(null);
        }
      }

      return cells;
    }
  }, {
    key: "fromState",
    value: function fromState(state) {
      var cells = [];

      for (var x = 0; x < this.size; x++) {
        var row = cells[x] = [];

        for (var y = 0; y < this.size; y++) {
          var tile = state[x][y];
          row.push(tile ? new Tile(tile.position, tile.value) : null);
        }
      }

      return cells;
    }
  }, {
    key: "randomAvailableCell",
    value: function randomAvailableCell() {
      var cells = this.availableCells();

      if (cells.length) {
        return cells[Math.floor(Math.random() * cells.length)];
      }
    }
  }, {
    key: "availableCells",
    value: function availableCells() {
      var cells = [];

      this.eachCell(function (x, y, tile) {
        if (!tile) {
          cells.push({ x: x, y: y });
        }
      });

      return cells;
    }
  }, {
    key: "eachCell",
    value: function eachCell(callback) {
      for (var x = 0; x < this.size; x++) {
        for (var y = 0; y < this.size; y++) {
          callback(x, y, this.cells[x][y]);
        }
      }
    }
  }, {
    key: "cellsAvailable",
    value: function cellsAvailable() {
      return !!this.availableCells().length;
    }
  }, {
    key: "cellAvailable",
    value: function cellAvailable(cell) {
      return !this.cellOccupied(cell);
    }
  }, {
    key: "cellOccupied",
    value: function cellOccupied(cell) {
      return !!this.cellContent(cell);
    }
  }, {
    key: "cellContent",
    value: function cellContent(cell) {
      if (this.withinBounds(cell)) {
        return this.cells[cell.x][cell.y];
      } else {
        return null;
      }
    }
  }, {
    key: "insertTile",
    value: function insertTile(tile) {
      this.cells[tile.x][tile.y] = tile;
    }
  }, {
    key: "removeTile",
    value: function removeTile(tile) {
      this.cells[tile.x][tile.y] = null;
    }
  }, {
    key: "withinBounds",
    value: function withinBounds(position) {
      return position.x >= 0 && position.x < this.size && position.y >= 0 && position.y < this.size;
    }
  }, {
    key: "serialize",
    value: function serialize() {
      var cellState = [];

      for (var x = 0; x < this.size; x++) {
        var row = cellState[x] = [];

        for (var y = 0; y < this.size; y++) {
          row.push(this.cells[x][y] ? this.cells[x][y].serialize() : null);
        }
      }

      return {
        size: this.size,
        cells: cellState
      };
    }
  }]);

  return Grid;
}();