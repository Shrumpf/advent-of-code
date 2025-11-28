package cmd

import (
	"fmt"

	"github.com/shrumpf/advent-of-code/cli/internal/aoc"
	"github.com/shrumpf/advent-of-code/cli/internal/benchmark"
	"github.com/shrumpf/advent-of-code/cli/internal/config"
	"github.com/shrumpf/advent-of-code/cli/internal/generator"
	"github.com/shrumpf/advent-of-code/cli/internal/readme"
	"github.com/spf13/cobra"
)

var startCmd = &cobra.Command{
	Use:   "start",
	Short: "Start working on a new day",
	Long: `Start working on a new day by downloading input, markdown, and generating templates.

This command combines:
  - download input
  - download markdown
  - generate templates (for specified language)

Example:
  cli start -d 1 -y 2024 -l js`,
	RunE: func(cmd *cobra.Command, args []string) error {
		year, _ := cmd.Flags().GetInt("year")
		day, _ := cmd.Flags().GetInt("day")
		lang, _ := cmd.Flags().GetString("lang")

		fmt.Printf("Starting day %d of %d for %s...\n\n", day, year, lang)

		// 1. Download input
		fmt.Println("📥 Downloading input...")
		downloader, err := aoc.NewDownloader()
		if err != nil {
			fmt.Printf("   Warning: %v\n", err)
		} else {
			if err := downloader.DownloadInput(year, day); err != nil {
				fmt.Printf("   Warning: %v\n", err)
			}
		}

		// 2. Download markdown
		fmt.Println("\n📄 Downloading puzzle description...")
		if downloader != nil {
			if err := downloader.DownloadMarkdown(year, day); err != nil {
				fmt.Printf("   Warning: %v\n", err)
			}
		}

		// 3. Generate templates
		fmt.Printf("\n🔧 Generating %s templates...\n", lang)
		gen := generator.NewGenerator()
		results, err := gen.Generate(lang, year, day)
		if err != nil {
			fmt.Printf("   Warning: %v\n", err)
		} else {
			generator.PrintResults(results)
		}

		fmt.Printf("\n✅ Ready to solve day %d of %d!\n", day, year)
		return nil
	},
}

var endCmd = &cobra.Command{
	Use:   "end",
	Short: "Finish working on a day",
	Long: `Finish working on a day by updating markdown, running benchmarks, and generating docs.

This command combines:
  - download markdown (to get part 2 if solved)
  - run benchmarks for all languages
  - generate BENCHMARKS.md
  - generate README.md

Example:
  cli end -d 1 -y 2024`,
	RunE: func(cmd *cobra.Command, args []string) error {
		year, _ := cmd.Flags().GetInt("year")
		day, _ := cmd.Flags().GetInt("day")

		fmt.Printf("Finishing day %d of %d...\n\n", day, year)

		// 1. Download markdown (to get part 2)
		fmt.Println("📄 Updating puzzle description...")
		downloader, err := aoc.NewDownloader()
		if err != nil {
			fmt.Printf("   Warning: %v\n", err)
		} else {
			if err := downloader.DownloadMarkdown(year, day); err != nil {
				fmt.Printf("   Warning: %v\n", err)
			}
		}

		// 2. Run benchmarks
		fmt.Println("\n⏱️  Running benchmarks...")
		runner := benchmark.NewRunner()
		if err := runner.RunAll(year, day); err != nil {
			fmt.Printf("   Warning: %v\n", err)
		}

		// 3. Generate documentation
		fmt.Println("\n📝 Generating documentation...")
		gen := readme.NewGenerator()

		benchPath, err := gen.GenerateBenchmarks()
		if err != nil {
			fmt.Printf("   Warning: failed to generate BENCHMARKS.md: %v\n", err)
		} else if benchPath != "" {
			fmt.Printf("   ✓ Generated %s\n", benchPath)
		}

		readmePath, err := gen.GenerateReadme()
		if err != nil {
			fmt.Printf("   Warning: failed to generate README.md: %v\n", err)
		} else {
			fmt.Printf("   ✓ Generated %s\n", readmePath)
		}

		fmt.Printf("\n✅ Day %d of %d complete!\n", day, year)
		return nil
	},
}

func init() {
	rootCmd.AddCommand(startCmd)
	rootCmd.AddCommand(endCmd)

	// Start command flags
	startCmd.Flags().IntP("year", "y", config.DefaultYear(), "Year of the puzzle")
	startCmd.Flags().IntP("day", "d", config.DefaultDay(), "Day of the puzzle")
	startCmd.Flags().StringP("lang", "l", config.Get().DefaultLanguage, "Language to generate templates for")

	// End command flags
	endCmd.Flags().IntP("year", "y", config.DefaultYear(), "Year of the puzzle")
	endCmd.Flags().IntP("day", "d", config.DefaultDay(), "Day of the puzzle")
}
