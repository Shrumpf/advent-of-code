import "dotenv/config";
import { exec } from "child_process";
import { promisify } from "util";
import { mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import minimist from "minimist";

let { year, day } = minimist(process.argv.slice(2), {
  string: ["year", "day"],
  default: {
    year: new Date().getFullYear().toString(),
    day: new Date().getDate().toString().padStart(2, "0"),
  },
});

day = day.padStart(2, "0");

const execAsync = promisify(exec);
const { PROJECT_ROOT } = process.env;

// Ensure benchmark directory exists
async function ensureBenchmarkDir(year: number, day: number) {
  const dir = path.join(
    PROJECT_ROOT!,
    "benchmarks",
    String(year),
    String(day).padStart(2, "0")
  );
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
  return dir;
}

// Run language-specific benchmark commands
async function benchmark(year: number, day: number) {
  await ensureBenchmarkDir(year, day);

  // JavaScript benchmark command
  await execAsync(
    `cd ../solutions/js && pnpm run benchmark --year=${year} --day=${day}`
  );

  // Rust benchmark command
  await execAsync(
    `cd ../solutions/rust && cargo run --release -- benchmark ${day} ${year}`
  );
}

benchmark(year, day).catch(console.error);
