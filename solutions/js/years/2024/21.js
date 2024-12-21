import { readExampleInput } from "../../tools/read.js";
const exampleInput = readExampleInput("2024", "21");

const NumericKeypad = [
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
  [null, "0", "A"],
];

const DirectionalKeypad = [
  [null, "^", "A"],
  ["<", "v", ">"],
];

const Directions = [
  { dx: -1, dy: 0, move: "<" },
  { dx: 0, dy: -1, move: "^" },
  { dx: 1, dy: 0, move: ">" },
  { dx: 0, dy: 1, move: "v" },
];

function findPosition(keypad, char) {
  for (let y = 0; y < keypad.length; y++) {
    for (let x = 0; x < keypad[y].length; x++) {
      if (keypad[y][x] === char) {
        return { x, y };
      }
    }
  }
  return null;
}

function getValidMoves(keypad, pos) {
  const moves = [];

  for (const { dx, dy, move } of Directions) {
    const nx = pos.x + dx;
    const ny = pos.y + dy;
    if (
      ny >= 0 &&
      ny < keypad.length &&
      nx >= 0 &&
      nx < keypad[ny].length &&
      keypad[ny][nx] !== null
    ) {
      moves.push({ x: nx, y: ny, move: move });
    }
  }
  return moves;
}

function findMoves(keypad, start, target) {
  const queue = [{ pos: start, path: [] }];
  const visited = new Map();
  const shortestPaths = [];

  if (start.x === target.x && start.y === target.y) {
    return ["A"];
  }

  while (queue.length > 0) {
    const current = queue.shift();
    const posKey = `${current.pos.x},${current.pos.y}`;

    if (current.pos.x === target.x && current.pos.y === target.y) {
      current.path.push("A");
      shortestPaths.push(current.path);
    }

    if (visited.has(posKey) && visited.get(posKey) < current.path.length) {
      continue;
    }

    const moves = getValidMoves(keypad, current.pos);
    for (const { x, y, move } of moves) {
      const newPath = [...current.path, move];

      if (
        !visited.has(`${x},${y}`) ||
        visited.get(`${x},${y}`) >= newPath.length
      ) {
        queue.push({
          pos: { x, y },
          path: newPath,
        });
        visited.set(`${x},${y}`, newPath.length);
      }
    }
  }

  return shortestPaths;
}

function getKeyPresses(input, sourceKeypad, depth, cache) {
  const key = `${input},${depth}`;
  if (cache.has(key)) {
    return cache.get(key);
  }

  let length = 0;
  let current = "A";

  for (const char of input) {
    const moves = findMoves(
      sourceKeypad,
      findPosition(sourceKeypad, current),
      findPosition(sourceKeypad, char)
    );
    if (depth === 0) {
      length += moves[0].length;
    } else {
      length += Math.min(
        ...moves.map((move) =>
          getKeyPresses(move, DirectionalKeypad, depth - 1, cache)
        )
      );
    }
    current = char;
  }

  cache.set(key, length);
  return length;
}

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_a(input) {
  const list = input.split(/\r?\n/);
  let solution = 0;
  const cache = new Map();

  for (const code of list) {
    const keyPresses = getKeyPresses(code, NumericKeypad, 2, cache);
    const numericPart = parseInt(code);
    const complexity = keyPresses * numericPart;

    solution += complexity;
  }

  return solution;
}

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_b(input) {
  const list = input.split(/\r?\n/);
  let solution = 0;
  const cache = new Map();

  for (const code of list) {
    const keyPresses = getKeyPresses(code, NumericKeypad, 25, cache);
    const numericPart = parseInt(code);
    const complexity = keyPresses * numericPart;

    solution += complexity;
  }

  return solution;
}

part_a(exampleInput);
part_b(exampleInput);
