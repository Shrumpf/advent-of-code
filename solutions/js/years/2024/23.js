import { readExampleInput } from "../../tools/read.js";
const exampleInput = readExampleInput("2024", "23");

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_a(input) {
  const list = input.split(/\r?\n/);
  let graph = new Map();
  let solution;

  for (const line of list) {
    let [a, b] = line.split("-");

    if (graph.has(a)) {
      let temp = graph.get(a);
      temp.add(b);
      graph.set(a, temp);
    } else {
      graph.set(a, new Set([b]));
    }

    if (graph.has(b)) {
      let temp = graph.get(b);
      temp.add(a);
      graph.set(b, temp);
    } else {
      graph.set(b, new Set([a]));
    }
  }

  let tripletsWithT = new Set();

  for (const [node, neighbors] of graph) {
    for (const neighbor of neighbors) {
      let others = graph.get(neighbor);
      for (const other of others) {
        if (
          neighbors.has(other) &&
          (node.startsWith("t") ||
            other.startsWith("t") ||
            neighbor.startsWith("t"))
        ) {
          let triplet = [node, neighbor, other];
          triplet.sort();
          tripletsWithT.add(triplet.join("-"));
        }
      }
    }
  }

  solution = tripletsWithT.size;

  return solution;
}

/**
 *
 * @param {string} input
 * @returns {string | number}
 */
export function part_b(input) {
  const list = input.split(/\r?\n/);
  let graph = new Map();
  let largestGroup = new Set();
  let solution;

  for (const line of list) {
    let [a, b] = line.split("-");

    if (graph.has(a)) {
      let temp = graph.get(a);
      temp.add(b);
      graph.set(a, temp);
    } else {
      graph.set(a, new Set([b]));
    }

    if (graph.has(b)) {
      let temp = graph.get(b);
      temp.add(a);
      graph.set(b, temp);
    } else {
      graph.set(b, new Set([a]));
    }
  }

  for (const [node, neighbors] of graph) {
    let group = new Set([node]);
    for (const neighbor of neighbors) {
      if ([...group].every((n) => graph.get(neighbor).has(n))) {
        group.add(neighbor);
        // group.sort();
      }
    }

    if (group.size > largestGroup.size) {
      largestGroup = group;
    }
  }

  solution = [...largestGroup.keys()].sort().join(",");

  return solution;
}

part_a(exampleInput);
part_b(exampleInput);
