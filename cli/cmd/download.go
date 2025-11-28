package cmd

import (
	"fmt"

	"github.com/shrumpf/advent-of-code/cli/internal/aoc"
	"github.com/shrumpf/advent-of-code/cli/internal/config"
	"github.com/spf13/cobra"
)

var downloadCmd = &cobra.Command{
	Use:   "download",
	Short: "Download puzzle inputs and descriptions",
	Long:  `Download puzzle inputs and/or markdown descriptions from Advent of Code.`,
}

var downloadInputCmd = &cobra.Command{
	Use:   "input",
	Short: "Download puzzle input",
	Long:  `Download the puzzle input for a specific day and year.`,
	RunE: func(cmd *cobra.Command, args []string) error {
		year, _ := cmd.Flags().GetInt("year")
		day, _ := cmd.Flags().GetInt("day")

		downloader, err := aoc.NewDownloader()
		if err != nil {
			return fmt.Errorf("failed to create downloader: %w", err)
		}

		return downloader.DownloadInput(year, day)
	},
}

var downloadMarkdownCmd = &cobra.Command{
	Use:     "markdown",
	Aliases: []string{"md"},
	Short:   "Download puzzle description as markdown",
	Long:    `Download the puzzle description and convert it to markdown.`,
	RunE: func(cmd *cobra.Command, args []string) error {
		year, _ := cmd.Flags().GetInt("year")
		day, _ := cmd.Flags().GetInt("day")

		downloader, err := aoc.NewDownloader()
		if err != nil {
			return fmt.Errorf("failed to create downloader: %w", err)
		}

		return downloader.DownloadMarkdown(year, day)
	},
}

var downloadAllCmd = &cobra.Command{
	Use:   "all",
	Short: "Download both input and markdown",
	Long:  `Download both the puzzle input and markdown description.`,
	RunE: func(cmd *cobra.Command, args []string) error {
		year, _ := cmd.Flags().GetInt("year")
		day, _ := cmd.Flags().GetInt("day")

		downloader, err := aoc.NewDownloader()
		if err != nil {
			return fmt.Errorf("failed to create downloader: %w", err)
		}

		return downloader.DownloadAll(year, day)
	},
}

func init() {
	rootCmd.AddCommand(downloadCmd)
	downloadCmd.AddCommand(downloadInputCmd)
	downloadCmd.AddCommand(downloadMarkdownCmd)
	downloadCmd.AddCommand(downloadAllCmd)

	// Add flags to all download subcommands
	for _, cmd := range []*cobra.Command{downloadInputCmd, downloadMarkdownCmd, downloadAllCmd} {
		cmd.Flags().IntP("year", "y", config.DefaultYear(), "Year of the puzzle")
		cmd.Flags().IntP("day", "d", config.DefaultDay(), "Day of the puzzle")
	}
}
