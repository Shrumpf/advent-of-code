import { readExampleInput } from "../../tools/read.js";
const exampleInput = readExampleInput("2024", "12");

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

  const visited = new Set();

  const rows = list.length;
  const cols = list[0].length;
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  const isNotValid = (y, x) => y < 0 || y >= rows || x < 0 || x >= cols;

  for (let y = 0; y < list.length; y++) {
    for (let x = 0; x < list[0].length; x++) {
      if (!visited.has(`${y},${x}`)) {
        const ch = list[y][x];
        let area = 0;
        let perimeter = 0;

        function traveling(y, x) {
          if (isNotValid(y, x) || list[y][x] !== ch) {
            perimeter++;
            return;
          }

          if (visited.has(`${y},${x}`)) {
            return;
          }

          area++;
          visited.add(`${y},${x}`);

          for (const [dy, dx] of directions) {
            const nx = x + dx;
            const ny = y + dy;

            traveling(ny, nx);
          }
        }

        traveling(y, x);
        solution += area * perimeter;
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
  function countWalls(walls) {
    let totalWalls = 0;

    for (const positions of Object.values(walls)) {
      let sorted = positions.toSorted((a, b) => a - b);

      let previous = sorted[0];
      totalWalls++;

      for (let i = 0; i < sorted.length; i++) {
        if (sorted[i] > previous + 1) {
          totalWalls++;
        }
        previous = sorted[i];
      }
    }

    return totalWalls;
  }
  const list = input
    .trim()
    .split(/\r?\n/)
    .map((line) => line.split(""));
  let solution = 0;

  const visited = new Set();

  const rows = list.length;
  const cols = list[0].length;
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  const isNotValid = (y, x) => y < 0 || y >= rows || x < 0 || x >= cols;

  for (let y = 0; y < list.length; y++) {
    for (let x = 0; x < list[0].length; x++) {
      if (!visited.has(`${y},${x}`)) {
        const ch = list[y][x];
        let area = 0;
        let walls = {};

        function traveling(y, x, py, px) {
          if (isNotValid(y, x) || list[y][x] !== ch) {
            const key = x === px ? `y-${y}-${py}` : `x-${x}-${px}`;
            if (!walls[key]) {
              walls[key] = [];
            }
            walls[key].push(x === px ? x : y);
            return;
          }

          if (visited.has(`${y},${x}`)) {
            return;
          }

          area++;
          visited.add(`${y},${x}`);

          for (const [dy, dx] of directions) {
            const nx = x + dx;
            const ny = y + dy;

            traveling(ny, nx, y, x);
          }
        }

        traveling(y, x);
        solution += area * countWalls(walls);
      }
    }
  }

  return solution;
}

part_a(exampleInput);
part_b(exampleInput);
