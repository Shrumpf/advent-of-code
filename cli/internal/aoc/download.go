package aoc

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/shrumpf/advent-of-code/cli/internal/config"
)

// Downloader handles downloading and saving puzzle data
type Downloader struct {
	client *Client
	config *config.Config
}

// NewDownloader creates a new downloader
func NewDownloader() (*Downloader, error) {
	client, err := NewClient()
	if err != nil {
		return nil, err
	}

	return &Downloader{
		client: client,
		config: config.Get(),
	}, nil
}

// DownloadInput downloads and saves the puzzle input for a given day and year
func (d *Downloader) DownloadInput(year, day int) error {
	inputPath := d.config.InputPath(year, day)
	filePath := filepath.Join(inputPath, fmt.Sprintf("%02d.input.txt", day))

	// Check if file already exists and has content
	if info, err := os.Stat(filePath); err == nil && info.Size() > 0 {
		if !d.config.Force {
			return fmt.Errorf("input file already exists: %s (use --force to overwrite)", filePath)
		}
		d.config.Log("Overwriting existing input file")
	}

	if d.config.DryRun {
		d.config.LogDryRun("Would download input for %d/%02d to %s", year, day, filePath)
		return nil
	}

	// Ensure directory exists
	if err := os.MkdirAll(inputPath, 0755); err != nil {
		return fmt.Errorf("failed to create directory: %w", err)
	}

	// Download the input
	input, err := d.client.GetInput(year, day)
	if err != nil {
		return fmt.Errorf("failed to download input: %w", err)
	}

	// Save the input
	if err := os.WriteFile(filePath, []byte(input), 0644); err != nil {
		return fmt.Errorf("failed to save input: %w", err)
	}

	fmt.Printf("Downloaded input to %s\n", filePath)
	return nil
}

// DownloadMarkdown downloads the puzzle page and converts it to markdown
func (d *Downloader) DownloadMarkdown(year, day int) error {
	inputPath := d.config.InputPath(year, day)
	filePath := filepath.Join(inputPath, "README.md")

	if d.config.DryRun {
		d.config.LogDryRun("Would download markdown for %d/%02d to %s", year, day, filePath)
		return nil
	}

	// Ensure directory exists
	if err := os.MkdirAll(inputPath, 0755); err != nil {
		return fmt.Errorf("failed to create directory: %w", err)
	}

	// Download the puzzle page
	html, err := d.client.GetPuzzlePage(year, day)
	if err != nil {
		return fmt.Errorf("failed to download puzzle page: %w", err)
	}

	// Extract content
	content := ExtractContent(html)
	if content == "" {
		return fmt.Errorf("no puzzle content found")
	}

	// Strip the "--- Title ---" formatting
	content = StripHyphens(content)

	// Convert to markdown
	converter := NewHTMLToMarkdown()
	markdown, err := converter.Convert(content)
	if err != nil {
		return fmt.Errorf("failed to convert to markdown: %w", err)
	}

	// Save the markdown
	if err := os.WriteFile(filePath, []byte(markdown), 0644); err != nil {
		return fmt.Errorf("failed to save markdown: %w", err)
	}

	fmt.Printf("Downloaded markdown to %s\n", filePath)
	return nil
}

// DownloadAll downloads both input and markdown
func (d *Downloader) DownloadAll(year, day int) error {
	if err := d.DownloadInput(year, day); err != nil {
		// Log but don't fail on input error (might already exist)
		fmt.Printf("Warning: %v\n", err)
	}

	if err := d.DownloadMarkdown(year, day); err != nil {
		return err
	}

	return nil
}
