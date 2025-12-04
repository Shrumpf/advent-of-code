import { readInput } from "./tools/read.js";
import minimist from "minimist";
import { readdirSync, existsSync } from "fs";
import { join } from "path";

let { year, day, part, all, "all-years": allYears } = minimist(process.argv.slice(2), {
  string: ["year", "day"],
  boolean: ["all", "all-years"],
  default: {
    year: new Date().getFullYear().toString(),
    day: new Date().getDate().toString().padStart(2, "0"),
    part: null,
    all: false,
    "all-years": false,
  },
});

// In case day is given as number, pad it
day = day.padStart(2, "0");

// Run all years
if (allYears) {
  await runAllYears();
  process.exit(0);
}

// Run all days in a year
if (all) {
  await runYear(year);
  process.exit(0);
}

await runDay(year, day);

// ─────────────────────────────────────────────────────────────────
// Functions
// ─────────────────────────────────────────────────────────────────

async function runDay(year, day, silent = false) {

  try {
    const start = performance.now();
    const { part_a, part_b } = await import(`./years/${year}/${day}.js`);
    const input = readInput(year, day);

    let resultA, resultB;

    if (part === "a" || (part === null && part_a)) {
      resultA = part_a?.(input);
    }

    if (part === "b" || (part === null && part_b)) {
      resultB = part_b?.(input);
    }

    const elapsed = performance.now() - start;

    if (silent) {
      return { year, day: day, resultA, resultB, elapsed, success: true };
    }

    console.log(`Day ${day}:`);
    if (resultA !== undefined) console.log(`  Part A: ${resultA}`);
    if (resultB !== undefined) console.log(`  Part B: ${resultB}`);
    console.log(`  Time: ${elapsed.toFixed(2)}ms`);

    return { year, day: day, resultA, resultB, elapsed, success: true };
  } catch (ex) {
    if (!silent) {
      handleError(ex, year, day);
    }
    return { year, day: day, success: false, error: ex.code };
  }
}

async function runYear(year) {
  const yearsDir = join(import.meta.dirname, "years", year);

  if (!existsSync(yearsDir)) {
    console.error(`No solutions found for year ${year}`);
    process.exit(1);
  }

  const files = readdirSync(yearsDir)
    .filter((f) => f.endsWith(".js") && /^\d{2}\.js$/.test(f))
    .sort();

  console.log(`\n🎄 Advent of Code ${year}\n${"═".repeat(40)}`);

  const results = [];
  let totalTime = 0;

  for (const file of files) {
    const day = file.replace(".js", "");
    const result = await runDay(year, day, true);
    results.push(result);

    if (result.success) {
      totalTime += result.elapsed;
      console.log(
        `Day ${day}: ` +
        `A=${result.resultA ?? "—"}, B=${result.resultB ?? "—"} ` +
        `(${result.elapsed.toFixed(2)}ms)`,
      );
    } else {
      console.log(`Day ${day}: ❌ ${result.error || "failed"}`);
    }
  }

  console.log(`${"═".repeat(40)}`);
  console.log(`Total: ${files.length} days, ${totalTime.toFixed(2)}ms`);
}

async function runAllYears() {
  const yearsDir = join(import.meta.dirname, "years");

  if (!existsSync(yearsDir)) {
    console.error("No years directory found");
    process.exit(1);
  }

  const years = readdirSync(yearsDir)
    .filter((f) => /^\d{4}$/.test(f))
    .sort();

  console.log(`\n🎄 Advent of Code - All Years\n${"═".repeat(40)}`);

  let grandTotal = 0;

  for (const year of years) {
    console.log(`\n📅 ${year}`);

    const yearsPath = join(yearsDir, year);
    const files = readdirSync(yearsPath)
      .filter((f) => f.endsWith(".js") && /^\d{2}\.js$/.test(f))
      .sort();

    let yearTime = 0;
    for (const file of files) {
      const day = file.replace(".js", "");
      const result = await runDay(year, day, true);
      if (result.success) {
        yearTime += result.elapsed;
        process.stdout.write(`  ${day}  ✓`);
      } else {
        process.stdout.write(`  ${day}  ✗`);
      }
    }

    console.log(`\n  → ${files.length} days, ${yearTime.toFixed(2)}ms`);
    grandTotal += yearTime;
  }

  console.log(`\n${"═".repeat(40)}`);
  console.log(`Grand Total: ${grandTotal.toFixed(2)}ms`);
}

function handleError(ex, year, day) {
  switch (ex.code) {
    case "ERR_MODULE_NOT_FOUND":
      console.error(`Day ${day}/${year}: Module not found, did you create it?`);
      break;
    case "ENOENT":
      console.error(`Day ${day}/${year}: ${ex.message}`);
      break;
    default:
      console.error(`Day ${day}/${year}:`, ex);
      break;
  }
}
