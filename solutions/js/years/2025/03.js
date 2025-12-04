import { readExampleInput } from "../../tools/read.js";
const exampleInput = readExampleInput("2025", "03");

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_a(input) {
  function findBest(bank) {
    let best = 0;

    const digits = bank.split("").map((d) => parseInt(d));
    const n = digits.length;
    const suffixMax = [n];

    suffixMax[n - 1] = digits[n - 1];

    for (let i = n - 2; i >= 0; i--) {
      suffixMax[i] = Math.max(digits[i], suffixMax[i + 1]);
    }

    for (let i = 0; i < n - 1; i++) {
      const first = digits[i].toString();
      const second = suffixMax[i + 1].toString();

      best = Math.max(best, parseInt(first + second));
    }

    return best;
  }

  const list = input.split(/\r?\n/);
  let solution = list.reduce((acc, bank) => acc + findBest(bank), 0);
  return solution;
}

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_b(input) {
  function findBest(bank) {
    let best = "";

    const digits = bank.split("").map((d) => parseInt(d));
    const n = digits.length;

    let pos = 0;
    let digitsRemaining = 12;

    for (let i = 0; i < 12; i++) {
      const latestPosition = n - digitsRemaining;
      digitsRemaining--;

      let maxDigit = -1;
      let maxPos = pos;

      for (let j = pos; j <= latestPosition; j++) {
        if (digits[j] > maxDigit) {
          maxDigit = digits[j];
          maxPos = j;
        }
      }

      best += maxDigit;
      pos = maxPos + 1;
    }

    return parseInt(best);
  }

  const list = input.split(/\r?\n/);
  let solution = list.reduce((acc, bank) => acc + findBest(bank), 0);
  return solution;
}

part_a(exampleInput);
part_b(exampleInput);
