import { readExampleInput } from "../../tools/read.js";
const exampleInput = readExampleInput("2025", "08");
const find = (parent, x) => {
    let root = x;
    while (root !== parent[root]) root = parent[root];
    while (x !== root) {
        const next = parent[x];
        parent[x] = root;
        x = next;
    }
    return root;
};

const union = (parent, size, a, b) => {
    const rootA = find(parent, a);
    const rootB = find(parent, b);
    if (rootA === rootB) return;
    if (size[rootA] < size[rootB]) {
        parent[rootA] = rootB;
        size[rootB] += size[rootA];
    } else {
        parent[rootB] = rootA;
        size[rootA] += size[rootB];
    }
    return true;
};
/**
 * 
 * @param {string} input 
 * @returns {string | number}
 */
export function part_a(input, pairs = 1000) {
    const list = input.split(/\r?\n/).map(line => line.split(",").map(c => parseInt(c)));
    let solution;

    const distances = [];
    for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
            const [ax, ay, az] = list[i];
            const [bx, by, bz] = list[j];
            const dx = ax - bx;
            const dy = ay - by;
            const dz = az - bz;
            const distSq = dx * dx + dy * dy + dz * dz;
            distances.push({ i, j, distSq });
        }
    }

    distances.sort((a, b) => a.distSq - b.distSq);

    const parent = Array.from({ length: list.length }, (_, idx) => idx);
    const size = Array(list.length).fill(1);

    for (let k = 0; k < pairs; k++) {
        const { i, j } = distances[k];
        union(parent, size, i, j);
    }

    const componentSizes = new Map();
    for (let i = 0; i < list.length; i++) {
        const root = find(parent, i);
        componentSizes.set(root, (componentSizes.get(root) ?? 0) + 1);
    }

    const sorted = [...componentSizes.values()].sort((a, b) => b - a);

    solution = sorted[0] * sorted[1] * sorted[2];

    return solution;
}

/**
 * 
 * @param {string} input 
 * @returns {string | number}
 */
export function part_b(input) {
    const list = input.split(/\r?\n/).map(line => line.split(",").map(c => parseInt(c)));
    let solution;

    const distances = [];
    for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
            const [ax, ay, az] = list[i];
            const [bx, by, bz] = list[j];
            const dx = ax - bx;
            const dy = ay - by;
            const dz = az - bz;
            const distSq = dx * dx + dy * dy + dz * dz;
            distances.push({ i, j, distSq });
        }
    }

    distances.sort((a, b) => a.distSq - b.distSq);

    const parent = Array.from({ length: list.length }, (_, idx) => idx);
    const size = Array(list.length).fill(1);

    let components = list.length;
    let lastPair = null;

    for (const { i, j } of distances) {
        if (union(parent, size, i, j)) {
            components--;
            lastPair = [i, j];
            if (components === 1) break;
        }
    }

    solution = list[lastPair[0]][0] * list[lastPair[1]][0];
    return solution;
}

part_a(exampleInput, 10);
part_b(exampleInput);