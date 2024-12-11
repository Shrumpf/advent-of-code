import { readExampleInput } from "../../tools/read.js";
const exampleInput = readExampleInput("2024", "11");

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_a(input) {
  let list = input.split(" ").map((i) => parseInt(i, 10));

  for (let i = 0; i < 25; i++) {
    const temp = [];
    for (let stone of list) {
      if (stone === 0) {
        temp.push(1);
      } else if (stone.toString().length % 2 === 0) {
        const first = stone.toString().slice(0, stone.toString().length / 2);
        const second = stone
          .toString()
          .slice(stone.toString().length / 2, stone.toString().length);
        temp.push(parseInt(first, 10), parseInt(second, 10));
      } else {
        temp.push(stone * 2024);
      }
    }
    list = temp;
  }

  let solution = list.length;

  return solution;
}

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_b(input) {
  let list = input.split(" ").map((i) => parseInt(i, 10));

  let map = list.reduce(
    (acc, e) => acc.set(e, (acc.get(e) || 0) + 1),
    new Map()
  );

  for (let i = 0; i < 75; i++) {
    let temp = new Map();
    for (let [stone, count] of map) {
      if (stone === 0) {
        temp.set(1, (temp.get(1) || 0) + count);
      } else if (stone.toString().length % 2 === 0) {
        const first = parseInt(
          stone.toString().slice(0, stone.toString().length / 2)
        );
        const second = parseInt(
          stone
            .toString()
            .slice(stone.toString().length / 2, stone.toString().length)
        );
        temp.set(first, (temp.get(first) || 0) + count);
        temp.set(second, (temp.get(second) || 0) + count);
      } else {
        temp.set(stone * 2024, (temp.get(stone * 2024) || 0) + count);
      }
    }
    map = temp;
  }

  let solution = map.values().reduce((prev, curr) => prev + curr, 0);

  return solution;
}

part_a(exampleInput);
part_b(exampleInput);
