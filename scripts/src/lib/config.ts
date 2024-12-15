// Extend the language configuration
interface LanguageConfig {
  name: string;
  extensions: string[];
  // Base path pattern for the language
  basePath: () => string;
  // File name pattern for solutions
  fileName: (day: number) => string;
  getStatsPath: (year: number) => string;
}

export interface ReadmeConfig {
  includeEmptyYears: boolean;
  includeEmptyDays: boolean;
  hideFutureDays: boolean;
  unlinkFutureDays: boolean;
}

export const languages: Record<string, LanguageConfig> = {
  js: {
    name: "JS",
    extensions: [".js"],
    basePath: () => `/solutions/js`,
    fileName: (day: number) => `${String(day).padStart(2, "0")}.js`,
    getStatsPath: (year: number) => `/solutions/js/years/${year}`,
  },
  rust: {
    name: "Rust",
    extensions: [".rs"],
    basePath: () => `/solutions/rust`,
    fileName: (day: number) => `day_${String(day).padStart(2, "0")}.rs`,
    getStatsPath: (year: number) => `/solutions/rust/aoc_${year}/src`,
  },
};

export const LATEST_YEAR = 2024;
