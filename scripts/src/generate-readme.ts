import "dotenv/config";
import { existsSync, writeFileSync } from "fs";
import path from "path";
import { languages, LATEST_YEAR, ReadmeConfig } from "./lib/config.js";

const { PROJECT_ROOT } = process.env;

const CONFIG: ReadmeConfig = {
  includeEmptyYears: false,
  includeEmptyDays: true,
  hideFutureDays: false,
  unlinkFutureDays: true,
};

function isFutureDate(year: number, day: number): boolean {
  const today = new Date();
  const date = new Date(year, 11, day);
  return date > today;
}

function generateDayCell(
  year: number,
  day: number,
  hasSolution: boolean,
  solutions: string = ""
): string {
  let baseCell = "";

  if (CONFIG.hideFutureDays && isFutureDate(year, day)) {
    return "";
  }

  baseCell =
    CONFIG.unlinkFutureDays && isFutureDate(year, day)
      ? `**${day}**`
      : `[**${day}**](https://adventofcode.com/${year}/day/${day})`;

  // If no solution and we're not including empty days, return empty
  if (!hasSolution && !CONFIG.includeEmptyDays) {
    return "";
  }

  // Add solution links
  baseCell += solutions;

  return baseCell;
}

function logo(lang: string, height: number = 12): string {
  return `<img height=${height} src="./assets/${lang}.svg">`;
}

// Helper functions
function getPath(
  root: string,
  lang: string,
  year: number,
  day: number
): string {
  const config = languages[lang];
  return `${root}${config.getStatsPath(year)}/${config.fileName(day)}`;
}

function generateLink(lang: string, year: number, day: number): string {
  const config = languages[lang];
  const dayString = String(day).padStart(2, "0");
  const url = path.join(config.getStatsPath(year), config.fileName(day));
  return ` [${logo(lang)}](${url} "${
    config.name
  } solution for ${year}/${dayString}")`;
}

function checkSolution(lang: string, year: number, day: number): string {
  const filePath = getPath(PROJECT_ROOT!, lang, year, day);
  if (!existsSync(filePath)) {
    return "";
  }
  return generateLink(lang, year, day);
}

function generateCalendar(year: number): string[] {
  const lines: string[][] = [];
  let line: string[] = [];
  const langs = new Map<string, number>();

  const firstDay = new Date(year, 11, 1).getDay();
  line = Array(firstDay).fill("");

  for (let day = 1; day <= 25; day++) {
    if (line.length === 7) {
      if (
        CONFIG.includeEmptyDays ||
        line.some((cell) => cell.includes("/solutions/"))
      ) {
        lines.push(line);
      }
      line = [];
    }

    let hasSolution = false;
    let solutions = "";
    for (const lang of Object.keys(languages)) {
      const solution = checkSolution(lang, year, day);
      if (solution) {
        hasSolution = true;
        langs.set(lang, (langs.get(lang) || 0) + 1);
        solutions += solution;
      }
    }

    let dayCell = generateDayCell(year, day, hasSolution, solutions);
    if (dayCell) {
      line.push(dayCell);
    } else {
      line.push("");
    }
  }

  if (
    line.length > 0 &&
    (CONFIG.includeEmptyDays ||
      line.some((cell) => cell.includes("/solutions/")))
  ) {
    lines.push(line);
  }

  const stats = Object.entries(languages)
    .map(([lang, config]) => {
      const count = langs.get(lang) || 0;
      if (count === 0) return "";
      return `[${logo(lang, 18)} ${config.name}](${config.getStatsPath(
        year
      )}): ${count}/25`;
    })
    .filter((s) => s.length > 0);

  return [
    `## [${year}](https://adventofcode.com/${year})${
      stats.length ? ` (${stats.join(", ")})` : ""
    }`,
    "|Mo|Tu|We|Th|Fr|Sa|Su|",
    "|-|-|-|-|-|-|-|",
    ...lines.map(
      (line) =>
        "|" + [...line, ...Array(7 - line.length).fill("")].join("|") + "|"
    ),
  ];
}

export async function generateReadme() {
  const calendars = [];
  for (let year = LATEST_YEAR; year >= 2015; year--) {
    const calendar = generateCalendar(year);
    if (calendar.some((line) => line.includes("/solutions/"))) {
      calendars.push(...calendar, ""); // Add empty line between calendars
    }
  }

  const readmePath = path.join(PROJECT_ROOT!, "README.md");
  writeFileSync(
    readmePath,
    [
      `# Advent of Code`,
      `## [Advent of Code](https://adventofcode.com) Solutions in ${Object.values(
        languages
      )
        .map((lang) => `[${lang.name}](${lang.basePath()})`)
        .join(" and ")}`,
      ...calendars,
      `---\n  ## Thanks to`,
      `- [Eric Wastl](https://github.com/topaz) for creating this awesome event`,
      `- [Defelo](https://github.com/defelo) for his README inspiration.`,
      `- [Connor Slade](https://github.com/connorslade) for his rust project template`,
    ].join("\n")
  );
  return readmePath;
}

generateReadme();
