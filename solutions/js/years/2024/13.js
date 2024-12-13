import { readExampleInput } from "../../tools/read.js";
const exampleInput = readExampleInput("2024", "13");

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_a(input) {
  const list = input.split(/\r?\n\r?\n/).map((config) => config.split(/\n/));
  let solution = 0;

  const regeX = /X.(\d+)/;
  const regeY = /Y.(\d+)/;

  for (let config of list) {
    let a = {
      x: parseInt(regeX.exec(config[0])[1]),
      y: parseInt(regeY.exec(config[0])[1]),
    };

    let b = {
      x: parseInt(regeX.exec(config[1])[1]),
      y: parseInt(regeY.exec(config[1])[1]),
    };

    let p = {
      x: parseInt(regeX.exec(config[2])[1]),
      y: parseInt(regeY.exec(config[2])[1]),
    };

    let m = (p.x * b.y - p.y * b.x) / (a.x * b.y - a.y * b.x);
    let n = (p.y * a.x - p.x * a.y) / (a.x * b.y - a.y * b.x);
    if (Number.isInteger(m) && Number.isInteger(n)) {
      solution += 3 * m + n;
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
  const list = input.split(/\r?\n\r?\n/).map((config) => config.split(/\n/));
  let solution = 0;

  const regeX = /X.(\d+)/;
  const regeY = /Y.(\d+)/;

  for (let config of list) {
    let a = {
      x: parseInt(regeX.exec(config[0])[1]),
      y: parseInt(regeY.exec(config[0])[1]),
    };

    let b = {
      x: parseInt(regeX.exec(config[1])[1]),
      y: parseInt(regeY.exec(config[1])[1]),
    };

    let p = {
      x: parseInt(regeX.exec(config[2])[1]) + 10000000000000,
      y: parseInt(regeY.exec(config[2])[1]) + 10000000000000,
    };

    let m = (p.x * b.y - p.y * b.x) / (a.x * b.y - a.y * b.x);
    let n = (p.y * a.x - p.x * a.y) / (a.x * b.y - a.y * b.x);
    if (Number.isInteger(m) && Number.isInteger(n)) {
      solution += 3 * m + n;
    }
  }

  return solution;
}

part_a(exampleInput);
part_b(exampleInput);
