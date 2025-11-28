package cmd

import (
	"github.com/shrumpf/advent-of-code/cli/internal/benchmark"
	"github.com/shrumpf/advent-of-code/cli/internal/config"
	"github.com/spf13/cobra"
)

var benchmarkCmd = &cobra.Command{
	Use:     "benchmark",
	Aliases: []string{"bench"},
	Short:   "Run benchmarks for solutions",
	Long:    `Run benchmarks for solutions using the justfile commands.`,
}

var benchmarkRunCmd = &cobra.Command{
	Use:   "run",
	Short: "Run benchmark for a specific language and day",
	Long:  `Run benchmark for a specific language, year, and day.`,
	RunE: func(cmd *cobra.Command, args []string) error {
		year, _ := cmd.Flags().GetInt("year")
		day, _ := cmd.Flags().GetInt("day")
		lang, _ := cmd.Flags().GetString("lang")

		runner := benchmark.NewRunner()
		return runner.Run(lang, year, day)
	},
}

var benchmarkDayCmd = &cobra.Command{
	Use:   "day",
	Short: "Run benchmarks for all languages for a specific day",
	Long:  `Run benchmarks for all configured languages for a specific day.`,
	RunE: func(cmd *cobra.Command, args []string) error {
		year, _ := cmd.Flags().GetInt("year")
		day, _ := cmd.Flags().GetInt("day")

		runner := benchmark.NewRunner()
		return runner.RunAll(year, day)
	},
}

var benchmarkYearCmd = &cobra.Command{
	Use:   "year",
	Short: "Run benchmarks for all days in a year",
	Long:  `Run benchmarks for all days in a year for a specific language.`,
	RunE: func(cmd *cobra.Command, args []string) error {
		year, _ := cmd.Flags().GetInt("year")
		lang, _ := cmd.Flags().GetString("lang")

		runner := benchmark.NewRunner()
		return runner.RunYear(lang, year)
	},
}

var benchmarkAllCmd = &cobra.Command{
	Use:   "all",
	Short: "Run all benchmarks for a language",
	Long:  `Run all benchmarks across all years for a specific language.`,
	RunE: func(cmd *cobra.Command, args []string) error {
		lang, _ := cmd.Flags().GetString("lang")

		runner := benchmark.NewRunner()
		return runner.RunAllLang(lang)
	},
}

var benchmarkJsCmd = &cobra.Command{
	Use:   "js",
	Short: "Run JavaScript benchmark",
	Long:  `Run benchmark for JavaScript solution.`,
	RunE: func(cmd *cobra.Command, args []string) error {
		year, _ := cmd.Flags().GetInt("year")
		day, _ := cmd.Flags().GetInt("day")

		runner := benchmark.NewRunner()
		return runner.Run("js", year, day)
	},
}

var benchmarkRustCmd = &cobra.Command{
	Use:   "rust",
	Short: "Run Rust benchmark",
	Long:  `Run benchmark for Rust solution.`,
	RunE: func(cmd *cobra.Command, args []string) error {
		year, _ := cmd.Flags().GetInt("year")
		day, _ := cmd.Flags().GetInt("day")

		runner := benchmark.NewRunner()
		return runner.Run("rust", year, day)
	},
}

func init() {
	rootCmd.AddCommand(benchmarkCmd)
	benchmarkCmd.AddCommand(benchmarkRunCmd)
	benchmarkCmd.AddCommand(benchmarkDayCmd)
	benchmarkCmd.AddCommand(benchmarkYearCmd)
	benchmarkCmd.AddCommand(benchmarkAllCmd)
	benchmarkCmd.AddCommand(benchmarkJsCmd)
	benchmarkCmd.AddCommand(benchmarkRustCmd)

	cfg := config.Get()

	// Flags for run command
	benchmarkRunCmd.Flags().IntP("year", "y", config.DefaultYear(), "Year of the puzzle")
	benchmarkRunCmd.Flags().IntP("day", "d", config.DefaultDay(), "Day of the puzzle")
	benchmarkRunCmd.Flags().StringP("lang", "l", cfg.DefaultLanguage, "Language to benchmark")

	// Flags for day command
	benchmarkDayCmd.Flags().IntP("year", "y", config.DefaultYear(), "Year of the puzzle")
	benchmarkDayCmd.Flags().IntP("day", "d", config.DefaultDay(), "Day of the puzzle")

	// Flags for year command
	benchmarkYearCmd.Flags().IntP("year", "y", config.DefaultYear(), "Year to benchmark")
	benchmarkYearCmd.Flags().StringP("lang", "l", cfg.DefaultLanguage, "Language to benchmark")

	// Flags for all command
	benchmarkAllCmd.Flags().StringP("lang", "l", cfg.DefaultLanguage, "Language to benchmark")

	// Flags for js/rust shortcuts
	for _, cmd := range []*cobra.Command{benchmarkJsCmd, benchmarkRustCmd} {
		cmd.Flags().IntP("year", "y", config.DefaultYear(), "Year of the puzzle")
		cmd.Flags().IntP("day", "d", config.DefaultDay(), "Day of the puzzle")
	}
}
