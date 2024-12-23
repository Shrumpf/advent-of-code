import { readExampleInput } from "../../tools/read.js";
const exampleInputA = readExampleInput("2024", "22", "a");
const exampleInputB = readExampleInput("2024", "22", "b");

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_a(input) {
  const list = input.split(/\r?\n/);
  let solution = 0;

  function mix(number, secret) {
    return number ^ secret;
  }

  function prune(secret) {
    return secret & 16777215;
  }

  function calculateSecret(secret) {
    let step = secret * 64;
    secret = mix(step, secret);
    secret = prune(secret);

    step = Math.floor(secret / 32);
    secret = mix(step, secret);
    secret = prune(secret);

    step = secret * 2048;
    secret = mix(step, secret);
    secret = prune(secret);

    return secret;
  }

  //   console.log(calculateSecret(123));

  for (const number of list) {
    let secret = number;
    for (let i = 0; i < 2000; i++) {
      secret = calculateSecret(secret);
      //   console.log(secret);
    }
    solution += secret;
  }

  // CODE GOES HERE

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
  function mix(number, secret) {
    return number ^ secret;
  }

  function prune(secret) {
    return secret & 16777215;
  }

  function calculateSecret(secret) {
    secret = prune(mix(secret * 64, secret));
    secret = prune(mix(Math.floor(secret / 32), secret));
    secret = prune(mix(secret * 2048, secret));

    return secret;
  }

  let sequences = new Map();

  for (const number of list) {
    let secret = number;
    let price;
    let lastPrice;
    let sequence = [];

    let cache = new Map();

    for (let i = 0; i < 2000; i++) {
      lastPrice = secret % 10;
      secret = calculateSecret(secret);
      price = secret % 10;
      const diff = price - lastPrice;
      sequence.push(diff);

      if (sequence.length > 4) {
        sequence.shift();
      }

      if (sequence.length === 4) {
        const key = sequence.join(",");
        if (!cache.has(key)) {
          cache.set(key, true);
          if (!sequences.has(key)) {
            sequences.set(key, price);
          } else {
            sequences.set(key, sequences.get(key) + price);
          }
        }
      }
    }
  }

  // CODE GOES HERE
  solution = Math.max(...[...sequences.values()]);

  return solution;
}

part_a(exampleInputA);
part_b(exampleInputB);
