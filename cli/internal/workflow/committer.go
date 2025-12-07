package workflow

import (
	"bufio"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/shrumpf/advent-of-code/cli/internal/config"
)

// CommitResult describes the outcome of the automated commits.
type CommitResult struct {
	Title         string
	InputsMessage string
	RootMessage   string
}

// Committer handles extracting puzzle metadata and creating commits.
type Committer struct {
	cfg      *config.Config
	runGitFn func(repoDir string, args ...string) error
}

// NewCommitter builds a Committer using the global config.
func NewCommitter() *Committer {
	return &Committer{
		cfg:      config.Get(),
		runGitFn: execGit,
	}
}

// Commit stages and commits the inputs submodule and repo root for the given day.
func (c *Committer) Commit(year, day int) (*CommitResult, error) {
	title, err := c.puzzleTitle(year, day)
	if err != nil {
		return nil, err
	}

	inputsMsg := fmt.Sprintf("feat(%d): Day %02d: %s", year, day, title)
	if err := c.commitInputs(year, day, inputsMsg); err != nil {
		return nil, err
	}

	lang := c.cfg.DefaultLanguage
	rootMsg := fmt.Sprintf("feat(%s): %d - Day %02d: %s", lang, year, day, title)
	if err := c.commitRoot(lang, rootMsg); err != nil {
		return nil, err
	}

	return &CommitResult{
		Title:         title,
		InputsMessage: inputsMsg,
		RootMessage:   rootMsg,
	}, nil
}

func (c *Committer) puzzleTitle(year, day int) (string, error) {
	readmePath := filepath.Join(c.cfg.InputPath(year, day), "README.md")

	file, err := os.Open(readmePath)
	if err != nil {
		return "", fmt.Errorf("open puzzle README: %w", err)
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" {
			continue
		}

		line = strings.TrimSpace(strings.TrimLeft(line, "# "))
		parts := strings.SplitN(line, ":", 2)
		if len(parts) != 2 {
			return "", fmt.Errorf("first non-empty line lacks ':' in %s", readmePath)
		}

		title := strings.TrimSpace(parts[1])
		if title == "" {
			return "", fmt.Errorf("empty puzzle title in %s", readmePath)
		}

		return title, nil
	}

	if err := scanner.Err(); err != nil {
		return "", fmt.Errorf("read puzzle README: %w", err)
	}

	return "", fmt.Errorf("puzzle title not found in %s", readmePath)
}

func (c *Committer) commitInputs(year, day int, message string) error {
	if c.cfg.DryRun {
		c.cfg.LogDryRun("Would commit inputs submodule for %d/%02d", year, day)
		return nil
	}

	inputsDir := filepath.Join(c.cfg.ProjectRoot, "inputs")
	relPath := filepath.Join(fmt.Sprintf("%d", year), fmt.Sprintf("%02d", day))
	return c.gitCommit(inputsDir, []string{relPath}, message)
}

func (c *Committer) commitRoot(lang, message string) error {
	if c.cfg.DryRun {
		c.cfg.LogDryRun("Would commit root with message %q", message)
		return nil
	}

	return c.gitCommit(c.cfg.ProjectRoot, []string{"."}, message)
}

func (c *Committer) gitCommit(repoDir string, paths []string, message string) error {
	if err := c.runGit(repoDir, append([]string{"add"}, paths...)...); err != nil {
		return err
	}
	return c.runGit(repoDir, "commit", "-m", message)
}

func (c *Committer) runGit(repoDir string, args ...string) error {
	return c.runGitFn(repoDir, args...)
}

func execGit(repoDir string, args ...string) error {
	cmd := exec.Command("git", append([]string{"-C", repoDir}, args...)...)
	output, err := cmd.CombinedOutput()
	if err != nil {
		trimmed := strings.TrimSpace(string(output))
		if trimmed != "" {
			return fmt.Errorf("git %s: %w: %s", strings.Join(args, " "), err, trimmed)
		}
		return fmt.Errorf("git %s: %w", strings.Join(args, " "), err)
	}
	return nil
}
