import { readExampleInput } from "../../tools/read.js";
const exampleInput = readExampleInput("2024", "04");

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
      if (list[y][x] !== "X") {
        continue;
      }

      let horizontal;
      let horizontalLeft;
      let diagonalRight;
      let diagonalLeft;
      let diagonalRightBw;
      let diagonalLeftBw;
      let vertical;
      let verticalBackwards;

      try {
        horizontal =
          list[y][x] + list[y][x + 1] + list[y][x + 2] + list[y][x + 3];
      } catch {}

      try {
        horizontalLeft =
          list[y][x] + list[y][x - 1] + list[y][x - 2] + list[y][x - 3];
      } catch {}

      try {
        diagonalRight =
          list[y][x] +
          list[y + 1][x + 1] +
          list[y + 2][x + 2] +
          list[y + 3][x + 3];
      } catch {}

      try {
        diagonalLeft =
          list[y][x] +
          list[y + 1][x - 1] +
          list[y + 2][x - 2] +
          list[y + 3][x - 3];
      } catch {}

      try {
        diagonalRightBw =
          list[y][x] +
          list[y - 1][x + 1] +
          list[y - 2][x + 2] +
          list[y - 3][x + 3];
      } catch {}

      try {
        diagonalLeftBw =
          list[y][x] +
          list[y - 1][x - 1] +
          list[y - 2][x - 2] +
          list[y - 3][x - 3];
      } catch {}

      try {
        vertical =
          list[y][x] + list[y + 1][x] + list[y + 2][x] + list[y + 3][x];
      } catch {}

      try {
        verticalBackwards =
          list[y][x] + list[y - 1][x] + list[y - 2][x] + list[y - 3][x];
      } catch {}

      let mega = [
        horizontal,
        diagonalLeft,
        diagonalRight,
        horizontalLeft,
        vertical,
        verticalBackwards,
        diagonalLeftBw,
        diagonalRightBw,
      ].flat();

      solution += [...mega.toString().matchAll(/xmas/gi)].length;
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

  for (let y = 0; y < list.length; y++) {
    for (let x = 0; x < list[y].length; x++) {
      if (list[y][x] !== "A") {
        continue;
      }

      try {
        const corners =
          list[y - 1][x - 1] +
          list[y - 1][x + 1] +
          list[y + 1][x - 1] +
          list[y + 1][x + 1];
        if (["MMSS", "SSMM", "SMSM", "MSMS"].includes(corners)) {
          solution++;
        }
      } catch {}
    }
  }

  return solution;
}

part_a(exampleInput);
part_b(exampleInput);
