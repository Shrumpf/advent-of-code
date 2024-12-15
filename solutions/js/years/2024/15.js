import { readExampleInput } from "../../tools/read.js";
const exampleInput = readExampleInput("2024", "15");

/**
 *
 * @param {string} input
 * @returns {string | number}
 */

export function part_a(input) {
  let [maze, instructions] = input.split(/\r?\n\r?\n/);
  maze = maze.split("\n").map((line) => line.split(""));
  instructions = instructions.replaceAll(/\n/g, "");

  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  let rx = 0;
  let ry = 0;

  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      if (maze[y][x] === "@") {
        rx = x;
        ry = y;
      }
    }
  }

  for (let dir of instructions) {
    let [dy, dx] = directions[">v<^".indexOf(dir)];

    let nx = rx + dx;
    let ny = ry + dy;

    let boxesX = 0;
    let boxesY = 0;

    if (dx === 0) {
      for (let i = ry; i < maze.length || i > 0; i += dy) {
        if (maze[i][rx] === "#" || maze[i][rx] === ".") {
          break;
        }
        if (maze[i][rx] === "O") {
          boxesY += dy;
        }
      }
    } else if (dy === 0) {
      for (let i = rx; i < maze[0].length && i > 0; i += dx) {
        if (maze[ry][i] === "#" || maze[ry][i] === ".") {
          break;
        }
        if (maze[ry][i] === "O") {
          boxesX += dx;
        }
      }
    }

    let bx = nx + boxesX;
    let by = ny + boxesY;

    if (maze[by][bx] === ".") {
      maze[ry][rx] = ".";
      maze[by][bx] = "O";
      maze[ny][nx] = "@";
      ry = ny;
      rx = nx;
    }
  }

  let solution = 0;
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      if (maze[y][x] === "O") {
        solution += y * 100 + x;
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
  function getBoxBounds(maze, y, x) {
    let bly, blx, bry, brx;
    if (maze[y][x] === "[") {
      bly = y;
      blx = x;
    } else {
      bly = y;
      blx = x - 1;
    }
    bry = bly;
    brx = blx + 1;

    return [bly, blx, bry, brx];
  }

  function moveBoxes(maze, bly, blx, bry, brx, dy, dx, tryIt) {
    let q = [
      [bly, blx, "["],
      [bry, brx, "]"],
    ];
    let q2 = [];
    let seen = new Set([`${bly}, ${blx}`, `${bry}, ${brx}`]);
    let placed = new Set();

    while (q.length > 0) {
      let [my, mx, val] = q.pop();

      if (!tryIt) {
        if (!placed.has(`${mx}, ${my}`)) {
          maze[my][mx] = ".";
        }
      }

      let ny = my + dy;
      let nx = mx + dx;

      if (maze[ny][nx] === ".") {
        // do nothing
      } else if (maze[ny][nx] === "#") {
        return false;
      } else {
        let [bly2, blx2, bry2, brx2] = getBoxBounds(maze, ny, nx);

        if (!seen.has(`${bly2}, ${blx2}`)) {
          seen.add(`${bly2}, ${blx2}`);
          q2.push([bly2, blx2, "["], [bry2, brx2, "]"]);
        }
      }

      if (!tryIt) {
        placed.add(`${nx}, ${ny}`);
        maze[ny][nx] = val;
      }

      if (!q.length) {
        [q, q2] = [q2, q];
      }
    }
    return true;
  }

  let [maze, instructions] = input.split(/\r?\n\r?\n/);
  maze = maze
    .replaceAll(/#/g, "##")
    .replaceAll(/O/g, "[]")
    .replaceAll(/\./g, "..")
    .replaceAll(/@/g, "@.");
  maze = maze.split("\n").map((line) => line.split(""));
  instructions = instructions.replaceAll(/\n/g, "");
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  let rx = 0;
  let ry = 0;

  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      if (maze[y][x] === "@") {
        rx = x;
        ry = y;
      }
    }
  }

  for (let dir of instructions) {
    let [dy, dx] = directions[">v<^".indexOf(dir)];

    let nx = rx + dx;
    let ny = ry + dy;

    if (maze[ny][nx] === ".") {
      maze[ny][nx] = "@";
      maze[ry][rx] = ".";
      ry = ny;
      rx = nx;
      continue;
    }
    if (maze[ny][nx] === "#") {
      continue;
    }

    let [bly, blx, bry, brx] = getBoxBounds(maze, ny, nx);

    if (moveBoxes(maze, bly, blx, bry, brx, dy, dx, true)) {
      moveBoxes(maze, bly, blx, bry, brx, dy, dx);
      maze[ry][rx] = ".";
      maze[ny][nx] = "@";
      ry = ny;
      rx = nx;
    }
  }

  let solution = 0;
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      if (maze[y][x] === "[" && maze[y][x + 1] === "]") {
        solution += y * 100 + x;
      }
    }
  }

  return solution;
}

part_a(exampleInput);
part_b(exampleInput);
