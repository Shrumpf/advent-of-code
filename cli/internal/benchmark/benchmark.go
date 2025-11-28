package benchmark

import (
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/shrumpf/advent-of-code/cli/internal/config"
)

// PartResult represents benchmark results for a single part
type PartResult struct {
	Time       float64 `json:"time"`       // Time in nanoseconds
	Iterations int     `json:"iterations"` // Number of iterations
	Memory     int64   `json:"memory,omitempty"`
}

// Result represents the complete benchmark results for a day
type Result struct {
	PartA PartResult `json:"part_a"`
	PartB PartResult `json:"part_b"`
}

// Runner handles running benchmarks via justfiles
type Runner struct {
	config *config.Config
}

// NewRunner creates a new benchmark runner
func NewRunner() *Runner {
	return &Runner{
		config: config.Get(),
	}
}

// Run runs benchmark for a specific language, year, and day using justfile
func (r *Runner) Run(lang string, year, day int) error {
	if _, ok := config.GetLanguage(lang); !ok {
		return fmt.Errorf("unknown language: %s", lang)
	}

	// Ensure benchmark directory exists
	benchDir := r.config.BenchmarkPath(year, day)
	if err := os.MkdirAll(benchDir, 0755); err != nil {
		return fmt.Errorf("failed to create benchmark directory: %w", err)
	}

	if r.config.DryRun {
		r.config.LogDryRun("Would run: just bench %s %d %d", lang, day, year)
		return nil
	}

	r.config.Log("Running benchmark: just bench %s %d %d", lang, day, year)

	// Use root justfile to run benchmarks
	cmd := exec.Command("just", "bench", lang, fmt.Sprintf("%d", day), fmt.Sprintf("%d", year))
	cmd.Dir = r.config.ProjectRoot
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	if err := cmd.Run(); err != nil {
		return fmt.Errorf("benchmark failed: %w", err)
	}

	fmt.Printf("Completed %s benchmark for %d/%02d\n", lang, year, day)
	return nil
}

// RunAll runs benchmarks for all languages that have solutions for a specific day
func (r *Runner) RunAll(year, day int) error {
	for _, lang := range config.GetLanguages() {
		// Check if solution exists
		solutionPath := lang.SolutionFile(r.config.ProjectRoot, year, day)
		if _, err := os.Stat(solutionPath); os.IsNotExist(err) {
			r.config.Log("Skipping %s - no solution found at %s", lang.Key, solutionPath)
			continue
		}

		if err := r.Run(lang.Key, year, day); err != nil {
			fmt.Printf("Warning: %s benchmark failed: %v\n", lang.Key, err)
		}
	}
	return nil
}

// RunYear runs benchmarks for all days in a year for a language
func (r *Runner) RunYear(lang string, year int) error {
	if _, ok := config.GetLanguage(lang); !ok {
		return fmt.Errorf("unknown language: %s", lang)
	}

	if r.config.DryRun {
		r.config.LogDryRun("Would run: just bench-year %s %d", lang, year)
		return nil
	}

	cmd := exec.Command("just", "bench-year", lang, fmt.Sprintf("%d", year))
	cmd.Dir = r.config.ProjectRoot
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	if err := cmd.Run(); err != nil {
		return fmt.Errorf("benchmark failed: %w", err)
	}

	return nil
}

// RunAllLang runs all benchmarks for a language
func (r *Runner) RunAllLang(lang string) error {
	if _, ok := config.GetLanguage(lang); !ok {
		return fmt.Errorf("unknown language: %s", lang)
	}

	if r.config.DryRun {
		r.config.LogDryRun("Would run: just bench-all %s", lang)
		return nil
	}

	cmd := exec.Command("just", "bench-all", lang)
	cmd.Dir = r.config.ProjectRoot
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	if err := cmd.Run(); err != nil {
		return fmt.Errorf("benchmark failed: %w", err)
	}

	return nil
}

// LoadResult loads a benchmark result from a JSON file
func LoadResult(path string) (*Result, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var result Result
	if err := json.Unmarshal(data, &result); err != nil {
		return nil, err
	}

	return &result, nil
}

// FormatTime formats a time in nanoseconds to a human-readable string
func FormatTime(ns float64) string {
	if ns < 1000 {
		return fmt.Sprintf("%.2fns", ns)
	}
	if ns < 1_000_000 {
		return fmt.Sprintf("%.2fµs", ns/1000)
	}
	if ns < 1_000_000_000 {
		return fmt.Sprintf("%.2fms", ns/1_000_000)
	}
	return fmt.Sprintf("%.2fs", ns/1_000_000_000)
}

// GetResultPath returns the path for a benchmark result JSON file
func GetResultPath(projectRoot string, year, day int, lang string) string {
	return filepath.Join(projectRoot, "benchmarks", fmt.Sprintf("%d", year), fmt.Sprintf("%02d", day), fmt.Sprintf("%s.json", lang))
}
