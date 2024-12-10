import { readExampleInput } from "../../tools/read.js";
const exampleInput = readExampleInput("2024", "10");

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_a(input) {
  const list = input
    .split(/\r?\n/)
    .map((line) => line.split("").map((n) => parseInt(n, 10)));
  let solution;

  const starts = new Map();

  const rows = list.length;
  const cols = list[0].length;
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  const isValid = (y, x) => y >= 0 && y < rows && x >= 0 && x < cols;

  for (let y = 0; y < list.length; y++) {
    for (let x = 0; x < list[y].length; x++) {
      if (list[y][x] === 0) {
        starts.set(`${y},${x}`, 0);
      }
    }
  }

  function traveling(y, x, visited, start) {
    if (list[y][x] === 9) {
      starts.set(start, starts.get(start) + 1);
    }

    visited.add(`${y},${x}`);

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (
        isValid(nx, ny) &&
        list[ny][nx] === list[y][x] + 1 &&
        !visited.has(`${ny},${nx}`)
      ) {
        traveling(ny, nx, visited, start);
      }
    }
  }

  for (let start of starts.keys()) {
    let [y, x] = start.split(",").map(Number);
    traveling(y, x, new Set(), start);
  }

  solution = starts.values().reduce((prev, curr) => prev + curr, 0);

  return solution;
}

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_b(input) {
  const list = input
    .split(/\r?\n/)
    .map((line) => line.split("").map((n) => parseInt(n, 10)));
  let solution = 0;

  const starts = new Map();

  const rows = list.length;
  const cols = list[0].length;
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  const isValid = (y, x) => y >= 0 && y < rows && x >= 0 && x < cols;

  for (let y = 0; y < list.length; y++) {
    for (let x = 0; x < list[y].length; x++) {
      if (list[y][x] === 0) {
        starts.set(`${y},${x}`, 0);
      }
    }
  }

  function traveling(y, x) {
    if (list[y][x] === 9) {
      solution++;
    }

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (isValid(nx, ny) && list[ny][nx] === list[y][x] + 1) {
        traveling(ny, nx);
      }
    }
  }

  for (let start of starts.keys()) {
    let [y, x] = start.split(",").map(Number);
    traveling(y, x);
  }

  return solution;
}

part_a(exampleInput);
part_b(exampleInput);
