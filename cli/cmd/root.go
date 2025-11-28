package cmd

import (
	"fmt"
	"os"

	"github.com/shrumpf/advent-of-code/cli/internal/config"
	"github.com/spf13/cobra"
)

var (
	verbose bool
	dryRun  bool
	force   bool
)

// rootCmd represents the base command
var rootCmd = &cobra.Command{
	Use:   "cli",
	Short: "Advent of Code CLI tool",
	Long: `A CLI tool for managing Advent of Code solutions.

This tool helps you:
  - Download puzzle inputs and descriptions
  - Generate solution templates for different languages
  - Run benchmarks across languages
  - Generate README and benchmark reports

Use "cli [command] --help" for more information about a command.`,
	PersistentPreRun: func(cmd *cobra.Command, args []string) {
		cfg := config.Get()
		cfg.SetVerbose(verbose)
		cfg.SetDryRun(dryRun)
		cfg.SetForce(force)
	},
}

// Execute adds all child commands to the root command and sets flags appropriately.
func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

func init() {
	// Initialize config on startup
	cobra.OnInitialize(initConfig)

	// Global flags
	rootCmd.PersistentFlags().BoolVarP(&verbose, "verbose", "v", false, "Enable verbose output")
	rootCmd.PersistentFlags().BoolVar(&dryRun, "dry-run", false, "Show what would be done without making changes")
	rootCmd.PersistentFlags().BoolVarP(&force, "force", "f", false, "Force overwrite of existing files")
}

func initConfig() {
	if _, err := config.Load(); err != nil {
		if verbose {
			fmt.Fprintf(os.Stderr, "Warning: failed to load config: %v\n", err)
		}
	}
}
