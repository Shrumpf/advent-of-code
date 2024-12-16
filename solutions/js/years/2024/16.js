import { readExampleInput } from "../../tools/read.js";
const exampleInput = readExampleInput("2024", "16");

function printMap(list, rx, ry, direction) {
  let string = "";
  for (let y = 0; y < list.length; y++) {
    for (let x = 0; x < list[y].length; x++) {
      const cell = list[y][x];

      if (x === rx && y === ry) {
        string += "^>v<"[direction];
      } else {
        string += cell;
      }
    }
    string += "\n";
  }

  console.log(string);
}

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_a(input) {
  const list = input
    .trim()
    .split(/\r?\n/)
    .map((line) => line.split(""));
  let solution = Number.MAX_SAFE_INTEGER;

  const rows = list.length;
  const cols = list[0].length;

  const directions = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];

  const changeDirection = (direction, dir) =>
    (direction + directions.length + dir) % directions.length;

  const isValid = (y, x) => y >= 0 && y < rows && x >= 0 && x < cols;

  let start = [];

  findStart: for (let y = 0; y < list.length; y++) {
    for (let x = 0; x < list[y].length; x++) {
      if (list[y][x] === "S") {
        start = [y, x];
        break findStart;
      }
    }
  }

  function walk(startX, startY, startDir) {
    let visited = new Set();
    let queue = [[startY, startX, startDir, 0]];

    while (queue.length > 0) {
      queue = queue.toSorted((a, b) => a[3] - b[3]);
      const [y, x, dir, cost] = queue.shift();
      const state = `${y},${x},${dir}`;

      // printMap(list, x, y, dir, visited);

      if (visited.has(state)) {
        continue;
      }

      visited.add(state);

      if (list[y][x] === "E") {
        solution = Math.min(solution, cost);
        continue;
      }

      if (cost >= solution) {
        continue;
      }

      let [dy, dx] = directions[dir];
      const nx = x + dx;
      const ny = y + dy;

      if (isValid(ny, nx) && list[ny][nx] !== "#") {
        queue.push([ny, nx, dir, cost + 1]);
      }

      const leftDir = changeDirection(dir, -1);
      const rightDir = changeDirection(dir, 1);

      const [leftDy, leftDx] = directions[leftDir];
      const leftY = y + leftDy;
      const leftX = x + leftDx;
      if (isValid(leftY, leftX) && list[leftY][leftX] !== "#") {
        queue.push([leftY, leftX, leftDir, cost + 1001]);
      }

      const [rightDy, rightDx] = directions[rightDir];
      const rightY = y + rightDy;
      const rightX = x + rightDx;
      if (isValid(rightY, rightX) && list[rightY][rightX] !== "#") {
        queue.push([rightY, rightX, rightDir, cost + 1001]);
      }
    }
  }
  walk(start[1], start[0], 1);
  return solution;
}

class PriorityQueue {
  constructor() {
    this.values = [];
  }

  enqueue(element, priority) {
    this.values.push([element, priority]);
    this._bubbleUp();
  }

  dequeue() {
    if (!this.values.length) return null;
    if (this.values.length === 1) return this.values.pop()[0];

    const min = this.values[0][0];
    const end = this.values.pop();
    this.values[0] = end;
    this._sinkDown();

    return min;
  }

  _bubbleUp() {
    let idx = this.values.length - 1;
    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      if (this.values[parentIdx][1] <= this.values[idx][1]) break;
      [this.values[idx], this.values[parentIdx]] = [
        this.values[parentIdx],
        this.values[idx],
      ];
      idx = parentIdx;
    }
  }

  _sinkDown() {
    let idx = 0;
    const length = this.values.length;
    while (true) {
      let smallest = idx;
      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;

      if (
        leftIdx < length &&
        this.values[leftIdx][1] < this.values[smallest][1]
      ) {
        smallest = leftIdx;
      }
      if (
        rightIdx < length &&
        this.values[rightIdx][1] < this.values[smallest][1]
      ) {
        smallest = rightIdx;
      }
      if (smallest === idx) break;

      [this.values[idx], this.values[smallest]] = [
        this.values[smallest],
        this.values[idx],
      ];
      idx = smallest;
    }
  }

  isEmpty() {
    return this.values.length === 0;
  }
}

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_b(input) {
  const list = input
    .trim()
    .split(/\r?\n/)
    .map((line) => line.split(""));

  const rows = list.length;
  const cols = list[0].length;

  const directions = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];

  const changeDirection = (direction, dir) =>
    (direction + directions.length + dir) % directions.length;

  const isValid = (y, x) => y >= 0 && y < rows && x >= 0 && x < cols;

  let start = [];
  findStart: for (let y = 0; y < list.length; y++) {
    for (let x = 0; x < list[y].length; x++) {
      if (list[y][x] === "S") {
        start = [y, x];
        break findStart;
      }
    }
  }

  function findOptimalPaths() {
    const distances = new Map();
    const reachableTiles = new Set();
    const queue = new PriorityQueue();
    let minCostToEnd = Number.MAX_SAFE_INTEGER;

    queue.enqueue(
      [start[0], start[1], 1, new Set([`${start[0]},${start[1]}`])],
      0
    );
    distances.set(`${start[0]},${start[1]},1`, 0);
    reachableTiles.add(`${start[0]},${start[1]}`);

    while (!queue.isEmpty()) {
      const [y, x, dir, currentTiles] = queue.dequeue();
      const cost = distances.get(`${y},${x},${dir}`);

      if (cost > minCostToEnd) continue;

      if (list[y][x] === "E") {
        if (cost <= minCostToEnd) {
          if (cost < minCostToEnd) {
            minCostToEnd = cost;
            reachableTiles.clear();
          }
          currentTiles.forEach((tile) => reachableTiles.add(tile));
        }
        continue;
      }

      const [dy, dx] = directions[dir];
      const ny = y + dy;
      const nx = x + dx;

      if (isValid(ny, nx) && list[ny][nx] !== "#") {
        const newCost = cost + 1;
        const state = `${ny},${nx},${dir}`;
        if (!distances.has(state) || distances.get(state) >= newCost) {
          const newTiles = new Set(currentTiles);
          newTiles.add(`${ny},${nx}`);
          distances.set(state, newCost);
          queue.enqueue([ny, nx, dir, newTiles], newCost);
        }
      }

      for (const turn of [-1, 1]) {
        const newDir = changeDirection(dir, turn);
        const [newDy, newDx] = directions[newDir];
        const newY = y + newDy;
        const newX = x + newDx;

        if (isValid(newY, newX) && list[newY][newX] !== "#") {
          const newCost = cost + 1001;
          const state = `${newY},${newX},${newDir}`;
          if (!distances.has(state) || distances.get(state) >= newCost) {
            const newTiles = new Set(currentTiles);
            newTiles.add(`${newY},${newX}`);
            distances.set(state, newCost);
            queue.enqueue([newY, newX, newDir, newTiles], newCost);
          }
        }
      }
    }

    return reachableTiles.size;
  }

  return findOptimalPaths();
}

part_a(exampleInput);
part_b(exampleInput);
