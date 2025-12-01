package aoc

import (
	"fmt"
	"io"
	"net/http"
	"regexp"
	"strings"
	"time"

	"github.com/shrumpf/advent-of-code/cli/internal/config"
)

// Client handles communication with the Advent of Code website
type Client struct {
	config     *config.Config
	httpClient *http.Client
}

// NewClient creates a new AoC client
func NewClient() (*Client, error) {
	cfg := config.Get()

	if cfg.SessionCookie == "" {
		return nil, fmt.Errorf("AOC_SESSION_COOKIE is not set")
	}
	if cfg.UserAgent == "" {
		return nil, fmt.Errorf("AOC_USER_AGENT is not set")
	}

	return &Client{
		config: cfg,
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
	}, nil
}

// doRequest performs an HTTP request to the AoC website
func (c *Client) doRequest(url string) ([]byte, error) {
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Cookie", fmt.Sprintf("session=%s", c.config.SessionCookie))
	req.Header.Set("User-Agent", c.config.UserAgent)
	req.Header.Set("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/jxl,image/webp,*/*;q=0.8")
	req.Header.Set("Accept-Language", "en-US,en;q=0.5")
	req.Header.Set("Upgrade-Insecure-Requests", "1")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("request failed with status %d: %s", resp.StatusCode, string(body))
	}

	return io.ReadAll(resp.Body)
}

// GetInput downloads the puzzle input for a given day and year
func (c *Client) GetInput(year, day int) (string, error) {
	url := fmt.Sprintf("https://adventofcode.com/%d/day/%d/input", year, day)

	c.config.Log("Downloading input from %s", url)

	data, err := c.doRequest(url)
	if err != nil {
		return "", err
	}

	return string(data), nil
}

// GetPuzzlePage downloads the puzzle page HTML for a given day and year
func (c *Client) GetPuzzlePage(year, day int) (string, error) {
	url := fmt.Sprintf("https://adventofcode.com/%d/day/%d", year, day)

	c.config.Log("Downloading puzzle page from %s", url)

	data, err := c.doRequest(url)
	if err != nil {
		return "", err
	}

	return string(data), nil
}

// ExtractContent extracts the <article> and <p> elements from the puzzle page HTML
func ExtractContent(html string) string {
	// Match all article and paragraph tags and their content
	re := regexp.MustCompile(`(?is)<article\b[^>]*>.*?</article>|<p\b[^>]*>.*?</p>`)
	matches := re.FindAllString(html, -1)

	if len(matches) == 0 {
		return ""
	}

	return strings.Join(matches, "\n")
}

// StripHyphens removes the "--- Title ---" formatting from headers
func StripHyphens(content string) string {
	re := regexp.MustCompile(`--- (.+) ---`)
	return re.ReplaceAllString(content, "$1")
}
