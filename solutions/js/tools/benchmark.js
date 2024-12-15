import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { readInput } from "./read.js";
import { existsSync, readdirSync } from "fs";
import minimist from "minimist";

let { year, day, all } = minimist(process.argv.slice(2), {
  string: ["year", "day"],
  default: {
    year: new Date().getFullYear().toString(),
    day: new Date().getDate().toString().padStart(2, "0"),
    all: false,
  },
});

day = day.padStart(2, "0");

async function measurePerformance(fn, iterations = 100) {
  const times = [];

  // Warmup
  for (let i = 0; i < 10; i++) await fn();

  // Measure
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await fn();
    times.push(performance.now() - start);
  }

  return {
    time: Math.min(...times) * 1_000_000, // Convert to nanoseconds
    iterations,
    memory: process.memoryUsage().heapUsed,
  };
}

async function ensureBenchmarkDir(year, day) {
  const dir = path.join(
    process.cwd(),
    "../../benchmarks",
    year.toString(),
    String(day).padStart(2, "0")
  );
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
  return dir;
}

async function benchmarkDay(year, day) {
  const dayString = String(day).padStart(2, "0");
  const { part_a, part_b } = await import(`../years/${year}/${dayString}.js`);
  const input = readInput(year.toString(), dayString);

  console.log(`Benchmarking ${year} day ${day}`);

  const results = {
    part_a: await measurePerformance(() => part_a(input)),
    part_b: await measurePerformance(() => part_b(input)),
  };

  const benchmarkDir = await ensureBenchmarkDir(year, day);
  const benchmarkPath = path.join(benchmarkDir, "js.json");
  await writeFile(benchmarkPath, JSON.stringify(results, null, 2));
}

async function benchmarkAll(year) {
  const solutionsPath = path.join(process.cwd(), "years", year.toString());
  const files = readdirSync(solutionsPath)
    .filter(
      (file) =>
        file.endsWith(".js") && !file.includes("skip") && !file.includes("test")
    )
    .map((file) => parseInt(file));

  console.log(files);
  for (const day of files) {
    try {
      await benchmarkDay(year, day);
      console.log(`Benchmarked ${year} day ${day}`);
    } catch (error) {
      console.error(`Failed to benchmark ${year} day ${day}:`, error);
    }
  }
}

async function benchmarkEverything() {
  const yearsPath = path.join(process.cwd(), "years");
  const years = readdirSync(yearsPath)
    .filter((file) => !file.includes("."))
    .map(Number);

  for (const year of years) {
    await benchmarkAll(year);
  }
}

// Main execution
// const [year, day] = process.argv.slice(2).map(Number);
if (all) {
  benchmarkEverything().catch(console.error);
} else if (year && day) {
  benchmarkDay(year, day).catch(console.error);
} else if (year) {
  benchmarkAll(year).catch(console.error);
}
