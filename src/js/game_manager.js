class GameManager {
  constructor(size, InputManager, Actuator, StorageManager) {
    this.size = size; // Size of the grid
    this.inputManager = new InputManager;
    this.storageManager = new StorageManager;
    this.actuator = new Actuator;

    this.startTiles = 15;

    this.inputManager.on("move", this.move.bind(this));
    this.inputManager.on("restart", this.restart.bind(this));
    this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));

    this.setup();
  }

  restart() {
    this.storageManager.clearGameState();
    this.actuator.continueGame(); // Clear the game won/lost message
    this.setup();
  }

  keepPlaying() {
    this.keepPlaying = true;
    this.actuator.continueGame(); // Clear the game won/lost message
  }

  isGameTerminated() {
    return this.over || (this.won && !this.keepPlaying);
  }

  setup() {
    const previousState = this.storageManager.getGameState();

    // Reload the game from a previous game if present
    if (previousState) {
      this.grid = new Grid(previousState.grid.size,
                                  previousState.grid.cells); // Reload grid
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

  addStartTiles() {
    for (let i = 1; i <= this.startTiles; i++) {
      this.addRandomTile(i);
    }
  }

  addRandomTile(value) {
    if (this.grid.cellsAvailable()) {
      const tile = new Tile(this.grid.randomAvailableCell(), value);
      this.grid.insertTile(tile);
    }
  }

  actuate() {
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
      level:      this.level,
      over:       this.over,
      won:        this.won,
      bestlevel:  this.storageManager.getBestlevel(),
      terminated: this.isGameTerminated()
    });

  }

  serialize() {
    return {
      grid:        this.grid.serialize(),
      level:       this.level,
      over:        this.over,
      won:         this.won,
      keepPlaying: this.keepPlaying
    };
  }

  prepareTiles() {
    this.grid.eachCell((x, y, tile) => {
      if (tile) {
        tile.mergedFrom = null;
        tile.savePosition();
      }
    });
  }

  moveTile(tile, cell) {
    this.grid.cells[tile.x][tile.y] = null;
    this.grid.cells[cell.x][cell.y] = tile;
    tile.updatePosition(cell);
  }

  move(direction) {
    // 0: up, 1: right, 2: down, 3: left
    const self = this;

    if (this.isGameTerminated()) return;

    let cell, tile;

    const vector      = this.getVector(direction);
    const traversals  = this.buildTraversals(vector);
    let moved       = false;
    let tileCount   = 1;
    let correctness = true;

    // Save the current tile positions and remove merger information
    this.prepareTiles();

    // Traverse the grid in the right direction and move tiles
    traversals.y.forEach(y => {
      traversals.x.forEach(x => {
        cell = { x, y };
        tile = self.grid.cellContent(cell);

        if (tile && !moved) {
          const positions = self.findFarthestPosition(cell, vector);

          // Only one merger per row traversal?
          self.moveTile(tile, positions.farthest);

          if (!self.positionsEqual(cell, tile)) {
            moved = true; // The tile moved from its original cell!
          }        
        }
        if (correctness && tile && tile.value !== (tileCount)) {
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

  getVector(direction) {
    // Vectors representing tile movement
    const map = {
      0: { x: 0,  y: -1 }, // Up
      1: { x: 1,  y: 0 },  // Right
      2: { x: 0,  y: 1 },  // Down
      3: { x: -1, y: 0 }   // Left
    };

    return map[direction];
  }

  buildTraversals(vector) {
    const traversals = { x: [], y: [] };

    for (let pos = 0; pos < this.size; pos++) {
      traversals.x.push(pos);
      traversals.y.push(pos);
    }
    return traversals;
  }

  findFarthestPosition(cell, vector) {
    let previous;

    // Progress towards the vector direction until an obstacle is found
    do {
      previous = cell;
      cell = { x: previous.x + vector.x, y: previous.y + vector.y };
    } while (this.grid.withinBounds(cell) &&
             this.grid.cellAvailable(cell));

    return {
      farthest: previous,
      next: cell // Used to check if a merge is required
    };
  }

  movesAvailable() {
    // TODO: rewrite so that we calculate if the game is over (in order)
    return true;
  }

  positionsEqual(first, second) {
    return first.x === second.x && first.y === second.y;
  }
}
