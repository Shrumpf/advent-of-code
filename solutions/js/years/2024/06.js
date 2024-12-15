import { readExampleInput } from "../../tools/read.js";
const exampleInput = readExampleInput("2024", "06");

const visited = new Set();

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_a(input) {
  const list = input.split(/\r?\n/).map((line) => line.split(""));
  let solution = 0;

  let currentDirection = "UP";

  let startPoint;
  let currentPosition;

  for (let y = 0; y < list.length; y++) {
    for (let x = 0; x < list[y].length; x++) {
      const cell = list[y][x];

      if (cell === "^") {
        startPoint = [y, x];
        currentPosition = [y, x];
        visited.add(currentPosition.toString());
      }
    }
  }

  while (
    currentPosition[0] > 0 &&
    currentPosition[0] < list.length &&
    currentPosition[1] > 0 &&
    currentPosition[1] < list[0].length
  ) {
    // console.log(currentPosition);
    switch (currentDirection) {
      case "UP": {
        if (
          currentPosition[0] - 1 >= 0 &&
          list[currentPosition[0] - 1][currentPosition[1]] === "#"
        ) {
          currentDirection = "RIGHT";
          break;
        }
        currentPosition[0] -= 1;
        break;
      }
      case "DOWN": {
        if (
          currentPosition[0] + 1 < list.length &&
          list[currentPosition[0] + 1][currentPosition[1]] === "#"
        ) {
          currentDirection = "LEFT";
          break;
        }
        currentPosition[0] += 1;
        break;
      }
      case "LEFT": {
        if (
          currentPosition[1] - 1 >= 0 &&
          list[currentPosition[0]][currentPosition[1] - 1] === "#"
        ) {
          currentDirection = "UP";
          break;
        }
        currentPosition[1] -= 1;
        break;
      }
      case "RIGHT": {
        if (
          currentPosition[1] + 1 < list[0].length &&
          list[currentPosition[0]][currentPosition[1] + 1] === "#"
        ) {
          currentDirection = "DOWN";
          break;
        }
        currentPosition[1] += 1;
        break;
      }
    }
    if (
      currentPosition[0] >= 1 &&
      currentPosition[0] <= list.length - 1 &&
      currentPosition[1] >= 1 &&
      currentPosition[1] <= list[0].length - 1
    ) {
      visited.add(currentPosition.toString());
    }
    // try {
    //     list[currentPosition[0]][currentPosition[1]] = "X";
    // } catch {}
  }

  //   printMap(list);

  solution = visited.size;

  // CODE GOES HERE

  return solution;
}

function printMap(list) {
  let string = "";
  for (let y = 0; y < list.length; y++) {
    for (let x = 0; x < list[y].length; x++) {
      const cell = list[y][x];

      string += cell;
    }
    string += "\n";
  }

  console.log(string);
}

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_b(input) {
  function tryNewMap(list, obstacles, x, y, direction) {
    while (true) {
      let [dx, dy] = move[direction];
      let nx = x + dx;
      let ny = y + dy;

      if (isNotValid(nx, ny)) {
        return 0;
      }

      const key = `${nx},${ny}`;
      if (!obstacles.has(key)) {
        obstacles.set(key, []);
      }

      if (list[nx][ny] === "#") {
        if (obstacles.get(key).includes(direction)) {
          return 1;
        } else {
          obstacles.get(key).push(direction);
          direction = (direction + 1) % move.length;
        }
      } else {
        [x, y] = [nx, ny];
        list[x][y] = 'X';
      }
    }
  }

  let list = input.split(/\r?\n/).map((line) => line.split(""));
  let solution = 0;

  const obstacles = new Map();
  const move = [[-1, 0], [0, 1], [1, 0], [0, -1]];
  let direction = 0;

  const isNotValid = (x, y) => x >= list.length || x < 0 || y >= list[0].length || y < 0;

  for (let y = 0; y < list.length; y++) {
    for (let x = 0; x < list[y].length; x++) {
      if (list[y][x] === "#") {
        obstacles.set(`${y},${x}`, []);
      }
    }
  }

  let currentPosition = [0, 0];
  for (let y = 0; y < list.length; y++) {
    for (let x = 0; x < list[y].length; x++) {
      if (list[y][x] === "^") {
        currentPosition = [y, x];
        break;
      }
    }
  }

  while (true) {
    let [x, y] = currentPosition;
    let [dx, dy] = move[direction];

    let nx = x + dx;
    let ny = y + dy;

    if (isNotValid(nx, ny)) {
      break;
    }

    if (list[nx][ny] === "#") {
      if (!obstacles.get(`${nx},${ny}`).includes(direction)) {
        obstacles.get(`${nx},${ny}`).push(direction);
      }
      direction = (direction + 1) % move.length;
    } else {
      if (list[nx][ny] !== "X") {
        const listCopy = list.map(line => [...line]);
        listCopy[nx][ny] = "#";

        const obstacleCopy = new Map();
        obstacles.forEach((value, key) => {
          obstacleCopy.set(key, [...value]);
        });

        solution += tryNewMap(listCopy, obstacleCopy, currentPosition[0], currentPosition[1], direction);
      }

      currentPosition = [nx, ny];
      list[nx][ny] = 'X';
    }
  }

  return solution;
}

part_a(exampleInput);
part_b(exampleInput);
