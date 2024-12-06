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
  let list = input.split(/\r?\n/).map((line) => line.split(""));
  const orig = JSON.stringify(list);
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
        // list[currentPosition[0]][currentPosition[1]] = "X";
      }
    }
  }

  for (let y = 0; y < list.length; y++) {
    for (let x = 0; x < list[y].length; x++) {
      const counter = new Map();

      if (
        list[y][x] === "^" ||
        list[y][x] === "#" ||
        !visited.has(`${y},${x}`)
      ) {
        continue;
      }

      list[y][x] = "#";

      let start = performance.now();

      while (counter.values().every((v) => v < 5)) {
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
          if (counter.has(currentPosition.toString())) {
            counter.set(
              currentPosition.toString(),
              counter.get(currentPosition.toString()) + 1
            );
          } else {
            counter.set(currentPosition.toString(), 1);
          }
        } else {
          //   console.log(`X: ${x}, Y: ${y} didn't break the loop`);
          break;
        }
      }
      let end = performance.now();
      //   console.log(`Call to doSomething took ${end - start} milliseconds.`);
      //   console.log(counter);
      if (counter.values().some((v) => v === 5)) {
        solution++;
        // console.log(`X: ${x}, Y: ${y} breaked the loop`);
      }
      list = JSON.parse(orig);
      currentPosition = [...startPoint];
      currentDirection = "UP";
    }
  }

  //   printMap(list);

  // CODE GOES HERE

  return solution;
}

// part_a(exampleInput);
// part_b(exampleInput);
