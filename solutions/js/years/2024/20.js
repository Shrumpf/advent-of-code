import { readExampleInput } from "../../tools/read.js";
const exampleInput = readExampleInput("2024", "20");

function printMap(list, x1, y1, x2, y2, skips) {
  let string = `Skips: ${skips}\n`;
  for (let y = 0; y < list.length; y++) {
    for (let x = 0; x < list[y].length; x++) {
      if (x === x1 && y === y1) {
        string += "1";
      } else if (x === x2 && y === y2) {
        string += "2";
      } else {
        string += list[y][x];
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
  let solution = 0;

  let start = [];
  let end = [];

  const rows = list.length;
  const cols = list[0].length;
  const is_test = rows === 15;
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  const isValid = (y, x) => y >= 0 && y < rows && x >= 0 && x < cols;

  for (let y = 0; y < list.length; y++) {
    for (let x = 0; x < list[y].length; x++) {
      if (list[y][x] === "S") {
        start = [y, x];
      } else if (list[y][x] === "E") {
        end = [y, x];
      }
    }
  }

  const path = [];
  const visited = new Set();
  const queue = [[start[0], start[1]]];
  while (queue.length > 0) {
    const [y, x] = queue.shift();
    path.push([y, x]);

    if (x === end[1] && y === end[0]) {
      break;
    }

    visited.add(`${x},${y}`);

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (
        isValid(nx, ny) &&
        !visited.has(`${nx},${ny}`) &&
        list[ny][nx] !== "#"
      ) {
        queue.push([ny, nx]);
      }
    }
  }

  for (let i = 0; i < path.length - 1; i++) {
    const [y1, x1] = path[i];

    for (let j = i + 1; j < path.length; j++) {
      const skips = j - i;
      const [y2, x2] = path[j];

      if (x1 === x2 || y1 === y2) {
        const dist = Math.abs(x1 - x2) + Math.abs(y1 - y2);

        if (dist <= 2) {
          const saved = skips - dist;

          //   if (saved >= 2 && saved <= 64) {
          if (is_test && saved >= 2 && saved <= 64) {
            solution++;
          } else if (saved >= 100) {
            solution++;
          }
        }
      }
    }
  }

  return solution;
}

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_b(input) {
  const list = input.split(/\r?\n/).map((line) => line.split(""));
  let solution = 0;

  let start = [];
  let end = [];

  const rows = list.length;
  const cols = list[0].length;
  const is_test = rows === 15;
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  const isValid = (y, x) => y >= 0 && y < rows && x >= 0 && x < cols;

  for (let y = 0; y < list.length; y++) {
    for (let x = 0; x < list[y].length; x++) {
      if (list[y][x] === "S") {
        start = [y, x];
      } else if (list[y][x] === "E") {
        end = [y, x];
      }
    }
  }

  const path = [];
  const visited = new Set();
  const queue = [[start[0], start[1]]];
  while (queue.length > 0) {
    const [y, x] = queue.shift();
    path.push([y, x]);

    if (x === end[1] && y === end[0]) {
      break;
    }

    visited.add(`${x},${y}`);

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (
        isValid(nx, ny) &&
        !visited.has(`${nx},${ny}`) &&
        list[ny][nx] !== "#"
      ) {
        queue.push([ny, nx]);
      }
    }
  }

  for (let i = 0; i < path.length - 1; i++) {
    const [y1, x1] = path[i];

    for (let j = i + 1; j < path.length; j++) {
      const skips = j - i;
      const [y2, x2] = path[j];
      const dist = Math.abs(x1 - x2) + Math.abs(y1 - y2);

      if (dist <= 20) {
        const saved = skips - dist;

        if (is_test && saved >= 50 && saved <= 76) {
          solution++;
        } else if (saved >= 100) {
          solution++;
        }
      }
    }
  }

  return solution;
}

part_a(exampleInput);
part_b(exampleInput);
