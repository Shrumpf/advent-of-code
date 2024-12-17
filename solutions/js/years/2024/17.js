import { readExampleInput } from "../../tools/read.js";
const exampleInputA = readExampleInput("2024", "17", "a");
const exampleInputB = readExampleInput("2024", "17", "b");

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_a(input) {
  let [register, program] = input.split(/\r?\n\r?\n/);
  let [a, b, c] = [...register.matchAll(/(\d+)/g)].map((m) =>
    parseInt(m[0], 10)
  );
  const instructions = program
    .split(":")[1]
    .split(",")
    .map((n) => parseInt(n, 10));
  let solution = [];

  //   let a = 27575648;
  //   //   let a = 9087222088;
  //   let b = 0;
  //   let c = 0;

  //   let instructions = [2, 4, 1, 2, 7, 5, 4, 1, 1, 3, 5, 5, 0, 3, 3, 0];

  //   let a = 0;
  //   let b = 2024;
  //   let c = 43690;

  //   let instructions = [4, 0];
  for (let i = 0; i < instructions.length; i += 2) {
    let opcode = instructions[i];
    let thing = instructions[i + 1];

    let value;

    switch (thing) {
      case 0:
      case 1:
      case 3: {
        value = thing;
        break;
      }
      case 4:
        value = a;
        break;
      case 5:
        value = b;
        break;
      case 6:
        value = c;
    }

    if (opcode === 0) {
      //   a = Math.trunc(a / (value * value));
      // a = a >> value
      a = Math.trunc(a / Math.pow(2, value));
    } else if (opcode === 1) {
      b = b ^ thing;
    } else if (opcode === 2) {
      b = value % 8;
    } else if (opcode === 3) {
      if (a !== 0) {
        i = thing - 2;
      }
    } else if (opcode === 4) {
      b = b ^ c;
    } else if (opcode === 5) {
      solution.push(value % 8);
    } else if (opcode === 6) {
      b = Math.trunc(a / Math.pow(2, value));
    } else if (opcode === 7) {
      c = Math.trunc(a / Math.pow(2, value));
    }
  }

  // CODE GOES HERE

  return solution.join(",");
}

function outBinary(val) {
  return (val >>> 0).toString(2);
}

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_b(input) {
  let [register, program] = input.split(/\r?\n\r?\n/);
  let [a, b, c] = [...register.matchAll(/(\d+)/g)].map((m) =>
    parseInt(m[0], 10)
  );
  const instructions = program
    .split(":")[1]
    .split(",")
    .map((n) => parseInt(n, 10));
  let solution = [];
  // let instructions = [2, 4, 1, 2, 7, 5, 4, 1, 1, 3, 5, 5, 0, 3, 3, 0];
  // let instructions = [0, 3, 5, 4, 3, 0];
  // let instructions = [0, 1, 5, 4, 3, 0];

  // console.log(
  //   [117440, 14680, 1835, 229, 28, 3, 0].map((i) => [i >> 3, outBinary(i >> 3)])
  // );

  // function compute(val) {
  //   let solution = [];
  //   let a = val;
  //   let b = 0;
  //   let c = 0;
  //   // console.log(val);
  //   for (let i = 0; i < instructions.length; i += 2) {
  //     let opcode = instructions[i];
  //     let thing = instructions[i + 1];

  //     let value;

  //     switch (thing) {
  //       case 0:
  //       case 1:
  //       case 3: {
  //         value = thing;
  //         break;
  //       }
  //       case 4:
  //         value = a;
  //         break;
  //       case 5:
  //         value = b;
  //         break;
  //       case 6:
  //         value = c;
  //     }

  //     if (opcode === 0) {
  //       //   a = Math.trunc(a / (value * value));
  //       a = a >> value;
  //     } else if (opcode === 1) {
  //       b = b ^ thing;
  //     } else if (opcode === 2) {
  //       b = value & 7;
  //     } else if (opcode === 3) {
  //       a && (i = thing - 2);
  //       // if (a !== 0) {
  //       //   i = thing - 2;
  //       //   // i -= 2;
  //       // }
  //     } else if (opcode === 4) {
  //       b = b ^ c;
  //     } else if (opcode === 5) {
  //       solution.push(value & 7);
  //     } else if (opcode === 6) {
  //       // b = Math.trunc(a / (1 << value));
  //       b = a >> value;
  //     } else if (opcode === 7) {
  //       c = a >> value;
  //     }
  //   }

  //   return solution;
  // }

  /*
a
117440
value
3
a / (1 << value)
14680
1 << value
8
117440 / 8
14680
117440 >> 3
14680


  b = a % 8
  b = b ^ 2
  c = a >> b
  b = b ^ c
  b = b ^ 3
  out b % 8
  a = a >> 3
  jmp 0 if a != 0
  */
  // return compute(117440);
  function compute(ins, ans) {
    let a = 0;
    let b = 0;
    let c = 0;
    if (ins.length === 0) {
      return ans;
    }

    for (let i = 0; i < 8; i++) {
      a = ans * 8 + i;
      b = a & 7;
      b = b ^ 2;
      c = a >> b;
      b = b ^ c;
      b = b ^ 3;
      if ((b & 7) === ins.at(-1)) {
        let sub = compute(ins.slice(0, -1), a);
        if (sub === null) {
          continue;
        }
        return sub;
      }
    }
    return null;
  }

  return compute(instructions, 0);
}

part_a(exampleInputA);
part_b(exampleInputB);
