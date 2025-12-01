package config

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/joho/godotenv"
)

// LatestYear is the most recent AoC year
const LatestYear = 2025

// Language represents a programming language configuration loaded from language.json
type Language struct {
	Key          string `json:"-"`            // Inferred from folder name
	Name         string `json:"name"`         // Display name, e.g., "JS", "Rust"
	SolutionPath string `json:"solutionPath"` // Path pattern: "years/{year}" or "aoc_{year}/src"
	FilePattern  string `json:"filePattern"`  // Filename pattern: "{day}.js" or "day_{day}.rs"
}

// ReadmeConfig holds configuration for README generation
type ReadmeConfig struct {
	IncludeEmptyYears bool `json:"includeEmptyYears"`
	IncludeEmptyDays  bool `json:"includeEmptyDays"`
	HideFutureDays    bool `json:"hideFutureDays"`
	UnlinkFutureDays  bool `json:"unlinkFutureDays"`
}

// Config holds the application configuration
type Config struct {
	ProjectRoot     string
	SessionCookie   string
	UserAgent       string
	DefaultLanguage string
	Readme          ReadmeConfig
	Verbose         bool
	DryRun          bool
	Force           bool

	// Discovered languages
	languages map[string]*Language
}

// Global config instance
var cfg *Config

// Load loads the configuration from environment and discovers languages
func Load() (*Config, error) {
	if cfg != nil {
		return cfg, nil
	}

	projectRoot := findProjectRoot()

	// Try to load .env file
	for _, envPath := range []string{
		filepath.Join(projectRoot, "scripts", ".env"),
		filepath.Join(projectRoot, "cli", ".env"),
	} {
		if err := godotenv.Load(envPath); err == nil {
			break
		}
	}

	cfg = &Config{
		ProjectRoot:     projectRoot,
		SessionCookie:   os.Getenv("AOC_SESSION_COOKIE"),
		UserAgent:       os.Getenv("AOC_USER_AGENT"),
		DefaultLanguage: "js",
		Readme: ReadmeConfig{
			IncludeEmptyYears: false,
			IncludeEmptyDays:  true,
			HideFutureDays:    false,
			UnlinkFutureDays:  true,
		},
		languages: make(map[string]*Language),
	}

	// Load config file overrides
	configPath := filepath.Join(projectRoot, "cli", "config.json")
	if data, err := os.ReadFile(configPath); err == nil {
		var fileConfig struct {
			DefaultLanguage string       `json:"defaultLanguage"`
			Readme          ReadmeConfig `json:"readme"`
		}
		if json.Unmarshal(data, &fileConfig) == nil {
			if fileConfig.DefaultLanguage != "" {
				cfg.DefaultLanguage = fileConfig.DefaultLanguage
			}
			cfg.Readme = fileConfig.Readme
		}
	}

	// Discover languages from solutions folder
	cfg.discoverLanguages()

	return cfg, nil
}

// discoverLanguages scans solutions/ for language.json files
func (c *Config) discoverLanguages() {
	solutionsDir := filepath.Join(c.ProjectRoot, "solutions")
	entries, err := os.ReadDir(solutionsDir)
	if err != nil {
		return
	}

	for _, entry := range entries {
		if !entry.IsDir() {
			continue
		}

		langKey := entry.Name()
		configPath := filepath.Join(solutionsDir, langKey, "language.json")

		data, err := os.ReadFile(configPath)
		if err != nil {
			continue // No language.json, skip this folder
		}

		var lang Language
		if err := json.Unmarshal(data, &lang); err != nil {
			continue
		}

		lang.Key = langKey
		c.languages[langKey] = &lang
	}
}

// Get returns the current configuration
func Get() *Config {
	if cfg == nil {
		cfg, _ = Load()
	}
	return cfg
}

// findProjectRoot attempts to find the project root directory
func findProjectRoot() string {
	dir, err := os.Getwd()
	if err != nil {
		return "."
	}

	// If we're in cli directory, go up one level
	if filepath.Base(dir) == "cli" {
		return filepath.Dir(dir)
	}

	// Walk up looking for justfile + solutions directory
	for {
		if _, err := os.Stat(filepath.Join(dir, "justfile")); err == nil {
			if _, err := os.Stat(filepath.Join(dir, "solutions")); err == nil {
				return dir
			}
		}

		parent := filepath.Dir(dir)
		if parent == dir {
			break
		}
		dir = parent
	}

	// Fallback to PROJECT_ROOT env var or current directory
	if root := os.Getenv("PROJECT_ROOT"); root != "" {
		return root
	}

	cwd, _ := os.Getwd()
	return cwd
}

// SetVerbose sets the verbose flag
func (c *Config) SetVerbose(v bool) { c.Verbose = v }

// SetDryRun sets the dry run flag
func (c *Config) SetDryRun(v bool) { c.DryRun = v }

// SetForce sets the force flag
func (c *Config) SetForce(v bool) { c.Force = v }

// --- Language accessors ---

// GetLanguage returns a language by key
func GetLanguage(key string) (*Language, bool) {
	cfg := Get()
	lang, ok := cfg.languages[key]
	return lang, ok
}

// GetLanguages returns all discovered languages
func GetLanguages() []*Language {
	cfg := Get()
	langs := make([]*Language, 0, len(cfg.languages))
	for _, lang := range cfg.languages {
		langs = append(langs, lang)
	}
	return langs
}

// GetLanguageKeys returns all language keys
func GetLanguageKeys() []string {
	cfg := Get()
	keys := make([]string, 0, len(cfg.languages))
	for k := range cfg.languages {
		keys = append(keys, k)
	}
	return keys
}

// --- Language methods ---

// BasePath returns the base solutions path for this language
func (l *Language) BasePath() string {
	return fmt.Sprintf("/solutions/%s", l.Key)
}

// SolutionDir returns the solution directory for a given year
func (l *Language) SolutionDir(year int) string {
	path := l.SolutionPath
	path = strings.ReplaceAll(path, "{year}", fmt.Sprintf("%d", year))
	return fmt.Sprintf("/solutions/%s/%s", l.Key, path)
}

// FileName returns the solution filename for a given day
func (l *Language) FileName(day int) string {
	name := l.FilePattern
	name = strings.ReplaceAll(name, "{day}", fmt.Sprintf("%02d", day))
	return name
}

// SolutionFile returns the full path to a solution file
func (l *Language) SolutionFile(projectRoot string, year, day int) string {
	dir := l.SolutionDir(year)
	// Remove leading slash for filepath.Join
	dir = strings.TrimPrefix(dir, "/")
	return filepath.Join(projectRoot, dir, l.FileName(day))
}

// --- Path helpers ---

// InputPath returns the path for puzzle inputs
func (c *Config) InputPath(year, day int) string {
	return filepath.Join(c.ProjectRoot, "inputs", fmt.Sprintf("%d", year), fmt.Sprintf("%02d", day))
}

// BenchmarkPath returns the path for benchmark results
func (c *Config) BenchmarkPath(year, day int) string {
	return filepath.Join(c.ProjectRoot, "benchmarks", fmt.Sprintf("%d", year), fmt.Sprintf("%02d", day))
}

// TemplatePath returns the path for templates
func (c *Config) TemplatePath(folder string) string {
	return filepath.Join(c.ProjectRoot, "scripts", "templates", folder)
}

// ExamplesPath returns the path for example inputs
func (c *Config) ExamplesPath(year, day int) string {
	return filepath.Join(c.ProjectRoot, "examples", fmt.Sprintf("%d", year), fmt.Sprintf("%02d", day))
}

// SolutionsPath returns the path for a language's solutions
func (c *Config) SolutionsPath(lang string) string {
	return filepath.Join(c.ProjectRoot, "solutions", lang)
}

// --- Time helpers ---

// DefaultYear returns the current year
func DefaultYear() int {
	return time.Now().Year()
}

// DefaultDay returns the current day of the month
func DefaultDay() int {
	return time.Now().Day()
}

// --- Logging helpers ---

// Log prints a message if verbose mode is enabled
func (c *Config) Log(format string, args ...interface{}) {
	if c.Verbose {
		fmt.Printf("[INFO] "+format+"\n", args...)
	}
}

// LogDryRun prints what would happen in dry run mode
func (c *Config) LogDryRun(format string, args ...interface{}) {
	if c.DryRun {
		fmt.Printf("[DRY-RUN] "+format+"\n", args...)
	}
}
