package readme

import (
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"

	"github.com/shrumpf/advent-of-code/cli/internal/benchmark"
	"github.com/shrumpf/advent-of-code/cli/internal/config"
)

// sortedLanguages returns languages sorted by key for consistent output
func sortedLanguages() []*config.Language {
	langs := config.GetLanguages()
	sort.Slice(langs, func(i, j int) bool {
		return langs[i].Key < langs[j].Key
	})
	return langs
}

// Generator handles README and BENCHMARKS.md generation
type Generator struct {
	config *config.Config
}

// NewGenerator creates a new readme generator
func NewGenerator() *Generator {
	return &Generator{
		config: config.Get(),
	}
}

// logo generates an img tag for a language logo
func logo(lang string, height int) string {
	return fmt.Sprintf(`<img height=%d src="./assets/%s.svg">`, height, lang)
}

// isFutureDate checks if the given date is in the future
func isFutureDate(year, day int) bool {
	now := time.Now()
	date := time.Date(year, time.December, day, 0, 0, 0, 0, time.UTC)
	return date.After(now)
}

// checkSolution checks if a solution exists and returns a link if it does
func (g *Generator) checkSolution(lang *config.Language, year, day int) string {
	filePath := lang.SolutionFile(g.config.ProjectRoot, year, day)

	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		return ""
	}

	// Generate link
	dayStr := fmt.Sprintf("%02d", day)
	url := filepath.Join(lang.SolutionDir(year), lang.FileName(day))
	return fmt.Sprintf(` [%s](%s "%s solution for %d/%s")`, logo(lang.Key, 12), url, lang.Name, year, dayStr)
}

// generateDayCell generates the markdown for a single day cell
func (g *Generator) generateDayCell(year, day int, hasSolution bool, solutions string) string {
	cfg := g.config.Readme

	if cfg.HideFutureDays && isFutureDate(year, day) {
		return ""
	}

	var baseCell string
	if cfg.UnlinkFutureDays && isFutureDate(year, day) {
		baseCell = fmt.Sprintf("**%02d**", day)
	} else {
		baseCell = fmt.Sprintf("[**%02d**](https://adventofcode.com/%d/day/%d)", day, year, day)
	}

	if !hasSolution && !cfg.IncludeEmptyDays {
		return ""
	}

	return baseCell + solutions
}

// generateCalendar generates the calendar markdown for a specific year
func (g *Generator) generateCalendar(year int) []string {
	var lines [][]string
	var line []string
	langs := make(map[string]int)

	// Get the day of week for December 1st
	// time.Weekday: Sunday = 0, Monday = 1, ..., Saturday = 6
	// We want Monday = 0, so we convert
	firstDay := time.Date(year, time.December, 1, 0, 0, 0, 0, time.UTC).Weekday()
	// Convert to Monday-based (Monday = 0, Sunday = 6)
	mondayBased := int(firstDay+6) % 7

	// Add empty cells for days before December 1st
	for i := 0; i < mondayBased; i++ {
		line = append(line, "")
	}

	for day := 1; day <= 25; day++ {
		if len(line) == 7 {
			if g.config.Readme.IncludeEmptyDays || containsSolutions(line) {
				lines = append(lines, line)
			}
			line = []string{}
		}

		hasSolution := false
		var solutions string

		for _, lang := range sortedLanguages() {
			solution := g.checkSolution(lang, year, day)
			if solution != "" {
				hasSolution = true
				langs[lang.Key]++
				solutions += solution
			}
		}

		dayCell := g.generateDayCell(year, day, hasSolution, solutions)
		line = append(line, dayCell)
	}

	// Add the last row
	if len(line) > 0 && (g.config.Readme.IncludeEmptyDays || containsSolutions(line)) {
		lines = append(lines, line)
	}

	// Generate stats line
	var stats []string
	for _, lang := range sortedLanguages() {
		count := langs[lang.Key]
		if count == 0 {
			continue
		}
		stats = append(stats, fmt.Sprintf("[%s %s](%s): %d/25", logo(lang.Key, 18), lang.Name, lang.SolutionDir(year), count))
	}

	var result []string
	statsStr := ""
	if len(stats) > 0 {
		statsStr = fmt.Sprintf(" (%s)", strings.Join(stats, ", "))
	}
	result = append(result, fmt.Sprintf("## [%d](https://adventofcode.com/%d)%s", year, year, statsStr))
	result = append(result, "|Mo|Tu|We|Th|Fr|Sa|Su|")
	result = append(result, "|-|-|-|-|-|-|-|")

	for _, row := range lines {
		// Pad row to 7 cells
		for len(row) < 7 {
			row = append(row, "")
		}
		result = append(result, "|"+strings.Join(row, "|")+"|")
	}

	return result
}

// containsSolutions checks if any cell in the line contains a solution link
func containsSolutions(line []string) bool {
	for _, cell := range line {
		if strings.Contains(cell, "/solutions/") {
			return true
		}
	}
	return false
}

// GenerateReadme generates the main README.md file
func (g *Generator) GenerateReadme() (string, error) {
	var calendars []string

	for year := config.LatestYear; year >= 2015; year-- {
		calendar := g.generateCalendar(year)
		// Only include years with solutions
		if containsSolutions(calendar) {
			calendars = append(calendars, calendar...)
			calendars = append(calendars, "") // Empty line between calendars
		}
	}

	// Get language names for header
	var langLinks []string
	for _, lang := range sortedLanguages() {
		langLinks = append(langLinks, fmt.Sprintf("[%s](%s)", lang.Name, lang.BasePath()))
	}

	var content []string
	content = append(content, "# Advent of Code")
	content = append(content, fmt.Sprintf("## [Advent of Code](https://adventofcode.com) Solutions in %s", strings.Join(langLinks, " and ")))
	content = append(content, calendars...)
	content = append(content, "---")
	content = append(content, "  ## Thanks to")
	content = append(content, "- [Eric Wastl](https://github.com/topaz) for creating this awesome event")
	content = append(content, "- [Defelo](https://github.com/defelo) for his README inspiration.")
	content = append(content, "- [Connor Slade](https://github.com/connorslade) for his rust project template")

	readmePath := filepath.Join(g.config.ProjectRoot, "README.md")

	if g.config.DryRun {
		g.config.LogDryRun("Would write README.md to %s", readmePath)
		return readmePath, nil
	}

	if err := os.WriteFile(readmePath, []byte(strings.Join(content, "\n")), 0644); err != nil {
		return "", fmt.Errorf("failed to write README.md: %w", err)
	}

	return readmePath, nil
}

// GenerateBenchmarks generates the BENCHMARKS.md file
func (g *Generator) GenerateBenchmarks() (string, error) {
	var content []string

	for year := config.LatestYear; year >= 2015; year-- {
		yearContent := g.generateBenchmarkTable(year)
		if len(yearContent) > 0 {
			content = append(content, yearContent...)
			content = append(content, "") // Empty line between years
		}
	}

	if len(content) == 0 {
		return "", nil
	}

	benchmarkPath := filepath.Join(g.config.ProjectRoot, "BENCHMARKS.md")

	if g.config.DryRun {
		g.config.LogDryRun("Would write BENCHMARKS.md to %s", benchmarkPath)
		return benchmarkPath, nil
	}

	if err := os.WriteFile(benchmarkPath, []byte(strings.Join(content, "\n")), 0644); err != nil {
		return "", fmt.Errorf("failed to write BENCHMARKS.md: %w", err)
	}

	return benchmarkPath, nil
}

// generateBenchmarkTable generates benchmark tables for a specific year
func (g *Generator) generateBenchmarkTable(year int) []string {
	// Collect all benchmarks by day
	benchmarks := make(map[int]map[string]*benchmark.Result)

	for day := 1; day <= 25; day++ {
		for _, lang := range sortedLanguages() {
			benchPath := benchmark.GetResultPath(g.config.ProjectRoot, year, day, lang.Key)
			result, err := benchmark.LoadResult(benchPath)
			if err != nil {
				continue
			}

			if benchmarks[day] == nil {
				benchmarks[day] = make(map[string]*benchmark.Result)
			}
			benchmarks[day][lang.Key] = result
		}
	}

	if len(benchmarks) == 0 {
		return nil
	}

	var sections []string
	sections = append(sections, fmt.Sprintf("# Benchmarks %d", year))
	sections = append(sections, "")

	// Sort days in descending order
	days := make([]int, 0, len(benchmarks))
	for day := range benchmarks {
		days = append(days, day)
	}
	sort.Sort(sort.Reverse(sort.IntSlice(days)))

	for _, day := range days {
		langBenchmarks := benchmarks[day]

		// Find fastest times for each part
		fastestA := float64(-1)
		fastestB := float64(-1)
		for _, bench := range langBenchmarks {
			if fastestA < 0 || bench.PartA.Time < fastestA {
				fastestA = bench.PartA.Time
			}
			if fastestB < 0 || bench.PartB.Time < fastestB {
				fastestB = bench.PartB.Time
			}
		}

		// Sort languages by Part A time
		type langResult struct {
			lang  string
			bench *benchmark.Result
		}
		var sortedLangs []langResult
		for langKey, bench := range langBenchmarks {
			sortedLangs = append(sortedLangs, langResult{langKey, bench})
		}
		sort.Slice(sortedLangs, func(i, j int) bool {
			return sortedLangs[i].bench.PartA.Time < sortedLangs[j].bench.PartA.Time
		})

		sections = append(sections, fmt.Sprintf("## Day %d", day))
		sections = append(sections, "")
		sections = append(sections, "| Language | Part A | Part B |")
		sections = append(sections, "|----------|--------|---------|")

		for _, lr := range sortedLangs {
			lang, _ := config.GetLanguage(lr.lang)

			var partA, partB string

			if lr.bench.PartA.Time == fastestA {
				partA = fmt.Sprintf("+ %s", benchmark.FormatTime(lr.bench.PartA.Time))
			} else {
				percentSlower := ((lr.bench.PartA.Time - fastestA) / fastestA) * 100
				partA = fmt.Sprintf("- %s (+%.1f%%)", benchmark.FormatTime(lr.bench.PartA.Time), percentSlower)
			}

			if lr.bench.PartB.Time == fastestB {
				partB = fmt.Sprintf("+ %s", benchmark.FormatTime(lr.bench.PartB.Time))
			} else {
				percentSlower := ((lr.bench.PartB.Time - fastestB) / fastestB) * 100
				partB = fmt.Sprintf("- %s (+%.1f%%)", benchmark.FormatTime(lr.bench.PartB.Time), percentSlower)
			}

			sections = append(sections, fmt.Sprintf("| %s | %s | %s |", lang.Name, partA, partB))
		}

		sections = append(sections, "")
	}

	return sections
}
