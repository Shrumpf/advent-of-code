package generator

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/shrumpf/advent-of-code/cli/internal/config"
)

// Generator handles template generation
type Generator struct {
	config *config.Config
}

// NewGenerator creates a new template generator
func NewGenerator() *Generator {
	return &Generator{
		config: config.Get(),
	}
}

// Result represents the result of a generation operation
type Result struct {
	Path    string
	Created bool
	Skipped bool
	Error   error
}

// Generate generates solution files for a given language, year, and day
func (g *Generator) Generate(langKey string, year, day int) ([]Result, error) {
	lang, ok := config.GetLanguage(langKey)
	if !ok {
		return nil, fmt.Errorf("unknown language: %s", langKey)
	}

	var results []Result

	// Generate solution templates
	solutionResults, err := g.generateSolutionTemplates(lang, year, day)
	if err != nil {
		return nil, err
	}
	results = append(results, solutionResults...)

	// Generate example templates
	exampleResults, err := g.generateExampleTemplates(year, day)
	if err != nil {
		return nil, err
	}
	results = append(results, exampleResults...)

	return results, nil
}

// GenerateExamplesOnly generates only the example templates
func (g *Generator) GenerateExamplesOnly(year, day int) ([]Result, error) {
	return g.generateExampleTemplates(year, day)
}

// generateSolutionTemplates generates language-specific solution files
func (g *Generator) generateSolutionTemplates(lang *config.Language, year, day int) ([]Result, error) {
	templateDir := g.config.TemplatePath(filepath.Join("solutions", lang.Key))
	files, err := os.ReadDir(templateDir)
	if err != nil {
		return nil, fmt.Errorf("failed to read template directory %s: %w", templateDir, err)
	}

	var results []Result

	for _, file := range files {
		if file.IsDir() {
			continue
		}

		templatePath := filepath.Join(templateDir, file.Name())
		destPath := g.getSolutionDestPath(lang, year, day, file.Name())

		result := g.processTemplate(templatePath, destPath, year, day)
		results = append(results, result)
	}

	return results, nil
}

// getSolutionDestPath returns the destination path for a solution file
func (g *Generator) getSolutionDestPath(lang *config.Language, year, day int, templateName string) string {
	dayStr := fmt.Sprintf("%02d", day)

	// Replace placeholders in filename
	fileName := templateName
	fileName = strings.ReplaceAll(fileName, "{day}", dayStr)
	fileName = strings.TrimSuffix(fileName, ".template")

	// Use the language's solution directory
	solutionDir := lang.SolutionDir(year)
	// Remove leading slash for filepath.Join
	solutionDir = strings.TrimPrefix(solutionDir, "/")

	return filepath.Join(g.config.ProjectRoot, solutionDir, fileName)
}

// generateExampleTemplates generates example input/solution files
func (g *Generator) generateExampleTemplates(year, day int) ([]Result, error) {
	templateDir := g.config.TemplatePath("examples")
	files, err := os.ReadDir(templateDir)
	if err != nil {
		return nil, fmt.Errorf("failed to read examples template directory: %w", err)
	}

	var results []Result

	for _, file := range files {
		if file.IsDir() {
			continue
		}

		templatePath := filepath.Join(templateDir, file.Name())

		// Determine destination path
		dayStr := fmt.Sprintf("%02d", day)
		fileName := file.Name()
		fileName = strings.ReplaceAll(fileName, "{day}", dayStr)
		fileName = strings.TrimSuffix(fileName, ".template")

		destPath := filepath.Join(g.config.ExamplesPath(year, day), fileName)

		result := g.processTemplate(templatePath, destPath, year, day)
		results = append(results, result)
	}

	return results, nil
}

// processTemplate processes a single template file
func (g *Generator) processTemplate(templatePath, destPath string, year, day int) Result {
	result := Result{Path: destPath}

	// Check if destination exists
	if _, err := os.Stat(destPath); err == nil {
		if !g.config.Force {
			// Ask for confirmation
			if !g.config.DryRun && !g.askOverwrite(destPath) {
				result.Skipped = true
				return result
			}
		}
	}

	if g.config.DryRun {
		g.config.LogDryRun("Would create %s from template", destPath)
		result.Created = true
		return result
	}

	// Ensure destination directory exists
	destDir := filepath.Dir(destPath)
	if err := os.MkdirAll(destDir, 0755); err != nil {
		result.Error = fmt.Errorf("failed to create directory: %w", err)
		return result
	}

	// Read template
	content, err := os.ReadFile(templatePath)
	if err != nil {
		result.Error = fmt.Errorf("failed to read template: %w", err)
		return result
	}

	// Replace placeholders
	processed := g.replacePlaceholders(string(content), year, day)

	// Write to destination
	if err := os.WriteFile(destPath, []byte(processed), 0644); err != nil {
		result.Error = fmt.Errorf("failed to write file: %w", err)
		return result
	}

	result.Created = true
	return result
}

// replacePlaceholders replaces template placeholders with actual values
func (g *Generator) replacePlaceholders(content string, year, day int) string {
	dayStr := fmt.Sprintf("%02d", day)

	replacements := map[string]string{
		"{{day}}":        dayStr,
		"{{year}}":       fmt.Sprintf("%d", year),
		"{{day_as_int}}": fmt.Sprintf("%d", day),
	}

	result := content
	for placeholder, value := range replacements {
		result = strings.ReplaceAll(result, placeholder, value)
	}

	return result
}

// askOverwrite prompts the user to confirm overwriting a file
func (g *Generator) askOverwrite(path string) bool {
	reader := bufio.NewReader(os.Stdin)
	fmt.Printf("Do you want to overwrite %s? [y/N]: ", path)

	response, err := reader.ReadString('\n')
	if err != nil {
		return false
	}

	response = strings.TrimSpace(strings.ToLower(response))
	return response == "y" || response == "yes"
}

// PrintResults prints the generation results
func PrintResults(results []Result) {
	for _, r := range results {
		if r.Error != nil {
			fmt.Printf("  ✗ %s: %v\n", r.Path, r.Error)
		} else if r.Skipped {
			fmt.Printf("  ⊘ %s (skipped)\n", r.Path)
		} else if r.Created {
			fmt.Printf("  ✓ %s\n", r.Path)
		}
	}
}
