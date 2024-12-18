import { readExampleInput } from "../../tools/read.js";
const exampleInput = readExampleInput("2024", "18");

function printMap(list, rx, ry) {
  let string = "";
  for (let y = 0; y < 7; y++) {
    for (let x = 0; x < 7; x++) {
      const cell = ".";

      if (list.some(([wx, wy]) => wx === x && wy === y)) {
        string += "#";
      } else if (x == rx && y == ry) {
        string += "@";
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
  // Example input is shorter and only uses 12 bytes instead of 1024.
  const list = input
    .trim()
    .split(/\r?\n/)
    .map((line) => line.split(",").map((n) => parseInt(n, 10)))
    .slice(0, input.length > 100 ? 1024 : 12);

  // assuming that the highest coordinate is also the boundary.
  const size = Math.max(...list.flat()) + 1;

  const directions = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];

  const isValid = (y, x) => y >= 0 && y < size && x >= 0 && x < size;

  function walk(list) {
    let visited = new Set(["0,0"]);
    let queue = [[0, 0, 0]];

    while (queue.length > 0) {
      const [y, x, cost] = queue.shift();
      const state = `${y},${x}`;

      //   console.log(y, x);
      //   printMap(list, x, y);

      if (x == size - 1 && y == size - 1) {
        return cost;
      }

      for (const [dy, dx] of directions) {
        const nx = x + dx;
        const ny = y + dy;

        if (
          isValid(ny, nx) &&
          !list.some(([x, y]) => nx === x && ny === y) &&
          !visited.has(`${ny},${nx}`)
        ) {
          visited.add(`${ny},${nx}`);
          queue.push([ny, nx, cost + 1]);
        }
      }
    }
  }

  return walk(list);
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
    .map((line) => line.split(",").map((n) => parseInt(n, 10)));

  // assuming that the highest coordinate is also the boundary.
  const size = Math.max(...list.flat()) + 1;

  const directions = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];

  const isValid = (y, x) => y >= 0 && y < size && x >= 0 && x < size;

  function walk(list) {
    let visited = new Set(["0,0"]);
    let queue = [[0, 0, 0]];

    while (queue.length > 0) {
      const [y, x, cost] = queue.shift();
      const state = `${y},${x}`;

      //   console.log(y, x);
      //   printMap(list, x, y);

      if (x == size - 1 && y == size - 1) {
        return cost;
      }

      for (const [dy, dx] of directions) {
        const nx = x + dx;
        const ny = y + dy;

        if (
          isValid(ny, nx) &&
          !list.some(([x, y]) => nx === x && ny === y) &&
          !visited.has(`${ny},${nx}`)
        ) {
          visited.add(`${ny},${nx}`);
          queue.push([ny, nx, cost + 1]);
        }
      }
    }

    return null;
  }

  // Example input is shorter and only uses 12 bytes instead of 1024.
  let left = input.length > 100 ? 1024 : 12;
  let right = list.length;

  let solution = 0;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (walk(list.slice(0, mid)) !== null) {
      solution = mid;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return list[solution].join(",");
}

part_a(exampleInput);
part_b(exampleInput);
