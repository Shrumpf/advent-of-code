import { readExampleInput } from "../../tools/read.js";
const exampleInput = readExampleInput("2024", "08");

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_a(input) {
  const list = input.split(/\r?\n/).map((row) => row.split(""));
  let solution = new Set();

  const antennas = [];
  for (let y = 0; y < list.length; y++) {
    for (let x = 0; x < list[y].length; x++) {
      const freq = list[y][x];
      if (freq !== "." && freq !== " ") {
        antennas.push({ y, x, freq });
      }
    }
  }

  for (let y = 0; y < antennas.length; y++) {
    for (let x = 0; x < antennas.length; x++) {
      if (y === x) continue;

      const ant1 = antennas[y];
      const ant2 = antennas[x];

      if (ant1.freq !== ant2.freq) continue;

      const ax = ant1.x + (ant2.x - ant1.x) * 2;
      const ay = ant1.y + (ant2.y - ant1.y) * 2;

      if (
        ax >= 0 &&
        ax < list[0].length &&
        ay >= 0 &&
        ay < list.length &&
        ax % 1 === 0 &&
        ay % 1 === 0
      ) {
        solution.add(`${ay},${ax}`);
      }
    }
  }

  return solution.size;
}

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_b(input) {
  function isOnLine(ay, ax, by, bx, cy, cx) {
    return (cy - ay) * (bx - ax) === (by - ay) * (cx - ax);
  }

  const list = input.split(/\r?\n/).map((row) => row.split(""));
  let solution = new Set();

  const antennas = [];
  for (let y = 0; y < list.length; y++) {
    for (let x = 0; x < list[y].length; x++) {
      const freq = list[y][x];
      if (freq !== "." && freq !== " ") {
        antennas.push({ y, x, freq });
      }
    }
  }

  const frequencyMap = Object.groupBy(antennas, ({ freq }) => freq);

  for (const freq in frequencyMap) {
    const group = frequencyMap[freq];

    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const ant1 = group[i];
        const ant2 = group[j];

        for (let y = 0; y < list[0].length; y++) {
          for (let x = 0; x < list.length; x++) {
            if (isOnLine(ant1.y, ant1.x, ant2.y, ant2.x, y, x)) {
              solution.add(`${y},${x}`);
            }
          }
        }
      }
    }
  }

  return solution.size;
}

part_a(exampleInput);
part_b(exampleInput);
