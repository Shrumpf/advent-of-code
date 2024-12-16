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
  let solution = Number.MAX_SAFE_INTEGER;
  let bestPathTiles = new Set();

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
    let visited = new Map();
    let queue = [[startY, startX, startDir, 0, [`${startY},${startX}`]]];

    while (queue.length > 0) {
      queue.sort((a, b) => a[3] - b[3]);

      const [y, x, dir, cost, path] = queue.shift();
      const state = `${y},${x},${dir}`;

      // Only skip if we've seen this exact state with a better cost
      if (visited.has(state)) {
        const prevCost = visited.get(state);
        if (prevCost < cost) {
          continue;
        }
      }

      visited.set(state, cost);

      if (list[y][x] === "E") {
        if (cost <= solution) {
          if (cost < solution) {
            solution = cost;
            bestPathTiles = new Set();
          }
          path.forEach((pos) => bestPathTiles.add(pos));
        }
        continue;
      }

      if (cost > solution) {
        continue;
      }

      let [dy, dx] = directions[dir];
      const nx = x + dx;
      const ny = y + dy;

      if (isValid(ny, nx) && list[ny][nx] !== "#") {
        queue.push([ny, nx, dir, cost + 1, [...path, `${ny},${nx}`]]);
      }

      const leftDir = changeDirection(dir, -1);
      const rightDir = changeDirection(dir, 1);

      const [leftDy, leftDx] = directions[leftDir];
      const leftY = y + leftDy;
      const leftX = x + leftDx;
      if (isValid(leftY, leftX) && list[leftY][leftX] !== "#") {
        queue.push([
          leftY,
          leftX,
          leftDir,
          cost + 1001,
          [...path, `${leftY},${leftX}`],
        ]);
      }

      const [rightDy, rightDx] = directions[rightDir];
      const rightY = y + rightDy;
      const rightX = x + rightDx;
      if (isValid(rightY, rightX) && list[rightY][rightX] !== "#") {
        queue.push([
          rightY,
          rightX,
          rightDir,
          cost + 1001,
          [...path, `${rightY},${rightX}`],
        ]);
      }
    }
  }

  walk(start[1], start[0], 1);
  return bestPathTiles.size;
}

part_a(exampleInput);
part_b(exampleInput);
