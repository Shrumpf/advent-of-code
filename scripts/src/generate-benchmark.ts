import "dotenv/config";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { languages, LATEST_YEAR } from "./lib/config";
import path from "node:path";

const { PROJECT_ROOT } = process.env;

function formatTime(ns: number): string {
  if (ns < 1000) return `${ns.toFixed(2)}ns`;
  if (ns < 1000000) return `${(ns / 1000).toFixed(2)}µs`;
  if (ns < 1000000000) return `${(ns / 1000000).toFixed(2)}ms`;
  return `${(ns / 1000000000).toFixed(2)}s`;
}

function generateBenchmarkTable(year: number): string[] {
  const benchmarks: Record<string, Record<string, any>> = {};

  // First collect all benchmarks by day
  for (let day = 1; day <= 25; day++) {
    const dayString = String(day).padStart(2, "0");

    for (const lang of Object.keys(languages)) {
      const benchPath = path.join(
        PROJECT_ROOT!,
        "benchmarks",
        year.toString(),
        dayString,
        `${lang}.json`
      );

      if (existsSync(benchPath)) {
        if (!benchmarks[dayString]) {
          benchmarks[dayString] = {};
        }
        benchmarks[dayString][lang] = JSON.parse(
          readFileSync(benchPath, "utf-8")
        );
      }
    }
  }

  if (Object.keys(benchmarks).length === 0) return [];

  const sections = Object.entries(benchmarks)
    .sort(([a], [b]) => parseInt(b) - parseInt(a)) // Sort days numerically
    .map(([day, langBenchmarks]) => {
      // Find fastest times for each part
      const fastestA = Math.min(
        ...Object.values(langBenchmarks).map((b) => b.part_a.time)
      );
      const fastestB = Math.min(
        ...Object.values(langBenchmarks).map((b) => b.part_b.time)
      );

      const rows = Object.entries(langBenchmarks)
        .sort((a, b) => a[1].part_a.time - b[1].part_a.time)
        .map(([lang, bench]) => {
          const percentSlowerA = (
            ((bench.part_a.time - fastestA) / fastestA) *
            100
          ).toFixed(1);
          const percentSlowerB = (
            ((bench.part_b.time - fastestB) / fastestB) *
            100
          ).toFixed(1);

          const partA =
            bench.part_a.time === fastestA
              ? `+ ${formatTime(bench.part_a.time)}`
              : `- ${formatTime(bench.part_a.time)} (+${percentSlowerA}%)`;

          const partB =
            bench.part_b.time === fastestB
              ? `+ ${formatTime(bench.part_b.time)}`
              : `- ${formatTime(bench.part_b.time)} (+${percentSlowerB}%)`;

          return `| ${languages[lang].name} | ${partA} | ${partB} |`;
        });

      return [
        `## Day ${parseInt(day)}`,
        "",
        "| Language | Part A | Part B |",
        "|----------|--------|---------|",
        ...rows,
        "",
      ];
    });

  return [`# Benchmarks ${year}`, "", ...sections.flat()];
}

export async function generateBenchmarks() {
  const benchmarks = [];
  for (let year = LATEST_YEAR; year >= 2015; year--) {
    const yearBenchmarks = generateBenchmarkTable(year);
    if (yearBenchmarks.length > 0) {
      benchmarks.push(...yearBenchmarks, ""); // Add empty line between years
    }
  }

  if (benchmarks.length > 0) {
    const benchmarkPath = path.join(PROJECT_ROOT!, "BENCHMARKS.md");
    writeFileSync(benchmarkPath, benchmarks.join("\n"));
    return benchmarkPath;
  }
}

generateBenchmarks();
