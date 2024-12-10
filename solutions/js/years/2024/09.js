import { readExampleInput } from "../../tools/read.js";
const exampleInput = readExampleInput("2024", "09");

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_a(input) {
  const list = input.trim().split("");
  let solution = 0;

  let diskMap = [];

  let idCount = 0;
  for (let i = 0; i < list.length; i++) {
    const count = parseInt(list[i]);

    if (i % 2 === 0) {
      for (let j = 0; j < count; j++) {
        diskMap.push(idCount);
      }
      idCount++;
    } else {
      for (let j = 0; j < count; j++) {
        diskMap.push(".");
      }
    }
  }

  let dotCount = diskMap.filter((f) => f === ".").length;
  let diskMapLength = diskMap.length;

  for (let i = diskMapLength - 1; i > -1; i--) {
    if (diskMap[i] === ".") {
      continue;
    }

    let first = diskMap.indexOf(".");
    let last = diskMap.lastIndexOf(".");

    if (last - first + 1 === dotCount) {
      break;
    }

    [diskMap[first], diskMap[i]] = [diskMap[i], diskMap[first]];
  }

  for (let i = 0; i < diskMapLength; i++) {
    if (diskMap[i] === ".") {
      break;
    }

    solution += i * diskMap[i];
  }

  return solution;
}

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_b(input) {
  const list = input.trim().split("");
  let solution = 0;

  let id = 0;

  let diskMap = list.map((length, i) => {
    if (i % 2 === 0) {
      return { id: id++, length: parseInt(length) };
    }
    return { id: ".", length: parseInt(length) };
  });

  for (let i = id - 1; i >= 0; i--) {
    let file = diskMap.findIndex(({ id }) => id == i);
    let dot = diskMap.findIndex(
      ({ id, length }) => id == "." && length >= diskMap[file].length
    );

    if (!diskMap[dot] || file < dot) {
      continue;
    }

    if (diskMap[dot].length > diskMap[file].length) {
      let start = diskMap.slice(0, dot);
      let end = diskMap.slice(dot + 1);
      diskMap = [
        ...start,
        { id: diskMap[file].id, length: diskMap[file].length },
        { id: ".", length: diskMap[dot].length - diskMap[file].length },
        ...end,
      ];
      diskMap[file + 1].id = ".";
    } else if (diskMap[dot].length == diskMap[file].length) {
      [diskMap[dot].id, diskMap[file].id] = [diskMap[file].id, diskMap[dot].id];
    }
  }

  let blockCount = 0;
  diskMap.forEach(({ id, length }) => {
    if (id !== ".") {
      for (let j = 0; j < length; j++) {
        solution += blockCount * id;
        blockCount++;
      }
    } else {
      blockCount += length;
    }
  });

  return solution;
}

part_a(exampleInput);
part_b(exampleInput);
