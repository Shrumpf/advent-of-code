import { readInput } from "../../tools/read.js";
const exampleInput = readInput("2024", "14");

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_a(input) {
  const regex = /p=(\d+),(\d+) v=(-?\d+),(-?\d+)/g;
  const list = input.split(/\r?\n/).map((r) => {
    let {
      1: x,
      2: y,
      3: vx,
      4: vy,
    } = [...r.matchAll(regex)][0].map((n) => parseInt(n));
    return {
      x,
      y,
      vx,
      vy,
    };
  });

  let solution;

  const height = 102;
  const width = 100;

  for (let i = 0; i < 100; i++) {
    for (let robot of list) {
      if (robot.x + robot.vx > width) {
        robot.x += robot.vx - (width + 1);
      } else if (robot.x + robot.vx < 0) {
        robot.x += robot.vx + (width + 1);
      } else {
        robot.x += robot.vx;
      }

      if (robot.y + robot.vy > height) {
        robot.y += robot.vy - (height + 1);
      } else if (robot.y + robot.vy < 0) {
        robot.y += robot.vy + height + 1;
      } else {
        robot.y += robot.vy;
      }
    }
  }

  let q1 = 0;
  let q2 = 0;
  let q3 = 0;
  let q4 = 0;
  for (let robot of list) {
    if (robot.x < width / 2 && robot.y < height / 2) {
      q1++;
    } else if (robot.x > width / 2 && robot.y < height / 2) {
      q2++;
    } else if (robot.x < width / 2 && robot.y > height / 2) {
      q3++;
    } else if (robot.x > width / 2 && robot.y > height / 2) {
      q4++;
    }
  }

  solution = q1 * q2 * q3 * q4;

  return solution;
}

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_b(input) {
  const regex = /p=(\d+),(\d+) v=(-?\d+),(-?\d+)/g;
  const list = input.split(/\r?\n/).map((r) => {
    let {
      1: x,
      2: y,
      3: vx,
      4: vy,
    } = [...r.matchAll(regex)][0].map((n) => parseInt(n));
    return {
      x,
      y,
      vx,
      vy,
    };
  });

  let solution = 0;

  const height = 102;
  const width = 100;

  let foundTree = false;
  while (!foundTree) {
    const seen = new Set();
    const hasDuplicates = list.some(
      (robot) => seen.size === seen.add(`${robot.x},${robot.y}`).size
    );

    if (!hasDuplicates) {
      //   process.stdout.write("\x1B[2J\x1B[3J\x1B[H\x1Bc");
      //   for (let y = 0; y < height; y++) {
      //     let row = "";
      //     for (let x = 0; x < width; x++) {
      //       let robot = robots.some((r) => r.x === x && r.y === y);

      //       row += robot ? "+" : ".";
      //     }
      //     console.log(row);
      //   }
      foundTree = true;
      break;
    }

    solution++;

    for (let robot of list) {
      if (robot.x + robot.vx > width) {
        robot.x += robot.vx - (width + 1);
      } else if (robot.x + robot.vx < 0) {
        robot.x += robot.vx + (width + 1);
      } else {
        robot.x += robot.vx;
      }

      if (robot.y + robot.vy > height) {
        robot.y += robot.vy - (height + 1);
      } else if (robot.y + robot.vy < 0) {
        robot.y += robot.vy + height + 1;
      } else {
        robot.y += robot.vy;
      }
    }
  }

  return solution;
}

// part_a(exampleInput);
// part_b(exampleInput);
