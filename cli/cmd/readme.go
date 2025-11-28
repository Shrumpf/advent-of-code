package cmd

import (
	"fmt"

	"github.com/shrumpf/advent-of-code/cli/internal/readme"
	"github.com/spf13/cobra"
)

var readmeCmd = &cobra.Command{
	Use:   "readme",
	Short: "Generate README and benchmark documentation",
	Long:  `Generate README.md and BENCHMARKS.md files from solutions and benchmark results.`,
}

var readmeGenerateCmd = &cobra.Command{
	Use:   "generate",
	Short: "Generate the main README.md",
	Long:  `Generate the main README.md with solution calendars and links.`,
	RunE: func(cmd *cobra.Command, args []string) error {
		gen := readme.NewGenerator()
		path, err := gen.GenerateReadme()
		if err != nil {
			return err
		}

		fmt.Printf("Generated README at %s\n", path)
		return nil
	},
}

var readmeBenchmarksCmd = &cobra.Command{
	Use:     "benchmarks",
	Aliases: []string{"bench"},
	Short:   "Generate BENCHMARKS.md",
	Long:    `Generate BENCHMARKS.md with benchmark comparison tables.`,
	RunE: func(cmd *cobra.Command, args []string) error {
		gen := readme.NewGenerator()
		path, err := gen.GenerateBenchmarks()
		if err != nil {
			return err
		}

		if path == "" {
			fmt.Println("No benchmarks found")
			return nil
		}

		fmt.Printf("Generated BENCHMARKS.md at %s\n", path)
		return nil
	},
}

var readmeAllCmd = &cobra.Command{
	Use:   "all",
	Short: "Generate both README.md and BENCHMARKS.md",
	Long:  `Generate both README.md and BENCHMARKS.md files.`,
	RunE: func(cmd *cobra.Command, args []string) error {
		gen := readme.NewGenerator()

		readmePath, err := gen.GenerateReadme()
		if err != nil {
			return fmt.Errorf("failed to generate README: %w", err)
		}
		fmt.Printf("Generated README at %s\n", readmePath)

		benchPath, err := gen.GenerateBenchmarks()
		if err != nil {
			return fmt.Errorf("failed to generate BENCHMARKS: %w", err)
		}
		if benchPath != "" {
			fmt.Printf("Generated BENCHMARKS.md at %s\n", benchPath)
		}

		return nil
	},
}

func init() {
	rootCmd.AddCommand(readmeCmd)
	readmeCmd.AddCommand(readmeGenerateCmd)
	readmeCmd.AddCommand(readmeBenchmarksCmd)
	readmeCmd.AddCommand(readmeAllCmd)
}
