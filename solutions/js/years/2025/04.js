import { readExampleInput } from "../../tools/read.js";
const exampleInput = readExampleInput("2025", "04");

function getNeighbors(grid, x, y) {
  const directions = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
  ];

  let count = 0;

  for (const [dx, dy] of directions) {
    const nx = x + dx;
    const ny = y + dy;

    if (ny >= 0 && ny < grid.length && nx >= 0 && nx < grid[ny].length) {
      if (grid[ny][nx] === "@") {
        count++;
      }
    }
  }

  return count;
}

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_a(input) {
  const list = input.split(/\r?\n/).map((line) => line.split(""));
  let solution = 0;

  for (let y = 0; y < list.length; y++) {
    for (let x = 0; x < list[y].length; x++) {
      if (list[y][x] === ".") continue;

      const amountOfNeighbors = getNeighbors(list, x, y);
      if (amountOfNeighbors < 4) {
        solution++;
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

  let checking = true;

  while (checking) {
    let removals = [];
    for (let y = 0; y < list.length; y++) {
      for (let x = 0; x < list[y].length; x++) {
        if (list[y][x] === ".") continue;

        const amountOfNeighbors = getNeighbors(list, x, y);
        if (amountOfNeighbors < 4) {
          removals.push([y, x]);
          solution++;
        }
      }
    }

    if (removals.length === 0) {
      checking = false;
    }

    for (let [y, x] of removals) {
      list[y][x] = ".";
    }
  }

  return solution;
}

part_a(exampleInput);
part_b(exampleInput);
