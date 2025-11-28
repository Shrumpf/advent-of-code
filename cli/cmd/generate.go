package cmd

import (
	"fmt"

	"github.com/shrumpf/advent-of-code/cli/internal/config"
	"github.com/shrumpf/advent-of-code/cli/internal/generator"
	"github.com/spf13/cobra"
)

var generateCmd = &cobra.Command{
	Use:     "generate",
	Aliases: []string{"gen"},
	Short:   "Generate solution templates",
	Long:    `Generate solution template files for a specific language, year, and day.`,
}

var generateTemplateCmd = &cobra.Command{
	Use:   "template",
	Short: "Generate solution templates for a language",
	Long:  `Generate solution template files for a specific language.`,
	RunE: func(cmd *cobra.Command, args []string) error {
		year, _ := cmd.Flags().GetInt("year")
		day, _ := cmd.Flags().GetInt("day")
		lang, _ := cmd.Flags().GetString("lang")

		gen := generator.NewGenerator()
		results, err := gen.Generate(lang, year, day)
		if err != nil {
			return err
		}

		fmt.Printf("Generated templates for %s (%d/%02d):\n", lang, year, day)
		generator.PrintResults(results)
		return nil
	},
}

var generateJsCmd = &cobra.Command{
	Use:   "js",
	Short: "Generate JavaScript solution templates",
	Long:  `Generate JavaScript solution template files.`,
	RunE: func(cmd *cobra.Command, args []string) error {
		year, _ := cmd.Flags().GetInt("year")
		day, _ := cmd.Flags().GetInt("day")

		gen := generator.NewGenerator()
		results, err := gen.Generate("js", year, day)
		if err != nil {
			return err
		}

		fmt.Printf("Generated JavaScript templates (%d/%02d):\n", year, day)
		generator.PrintResults(results)
		return nil
	},
}

var generateRustCmd = &cobra.Command{
	Use:   "rust",
	Short: "Generate Rust solution templates",
	Long:  `Generate Rust solution template files.`,
	RunE: func(cmd *cobra.Command, args []string) error {
		year, _ := cmd.Flags().GetInt("year")
		day, _ := cmd.Flags().GetInt("day")

		gen := generator.NewGenerator()
		results, err := gen.Generate("rust", year, day)
		if err != nil {
			return err
		}

		fmt.Printf("Generated Rust templates (%d/%02d):\n", year, day)
		generator.PrintResults(results)
		return nil
	},
}

var generateExamplesCmd = &cobra.Command{
	Use:   "examples",
	Short: "Generate example input/solution files only",
	Long:  `Generate only the example input and solution template files.`,
	RunE: func(cmd *cobra.Command, args []string) error {
		year, _ := cmd.Flags().GetInt("year")
		day, _ := cmd.Flags().GetInt("day")

		gen := generator.NewGenerator()
		results, err := gen.GenerateExamplesOnly(year, day)
		if err != nil {
			return err
		}

		fmt.Printf("Generated example files (%d/%02d):\n", year, day)
		generator.PrintResults(results)
		return nil
	},
}

var generateAllCmd = &cobra.Command{
	Use:   "all",
	Short: "Generate templates for all configured languages",
	Long:  `Generate solution templates for all configured languages.`,
	RunE: func(cmd *cobra.Command, args []string) error {
		year, _ := cmd.Flags().GetInt("year")
		day, _ := cmd.Flags().GetInt("day")

		gen := generator.NewGenerator()

		for _, lang := range config.GetLanguages() {
			fmt.Printf("Generating %s templates (%d/%02d):\n", lang.Key, year, day)
			results, err := gen.Generate(lang.Key, year, day)
			if err != nil {
				fmt.Printf("  Warning: %v\n", err)
				continue
			}
			generator.PrintResults(results)
		}

		return nil
	},
}

func init() {
	rootCmd.AddCommand(generateCmd)
	generateCmd.AddCommand(generateTemplateCmd)
	generateCmd.AddCommand(generateJsCmd)
	generateCmd.AddCommand(generateRustCmd)
	generateCmd.AddCommand(generateExamplesCmd)
	generateCmd.AddCommand(generateAllCmd)

	// Add flags to all generate subcommands
	for _, cmd := range []*cobra.Command{generateTemplateCmd, generateJsCmd, generateRustCmd, generateExamplesCmd, generateAllCmd} {
		cmd.Flags().IntP("year", "y", config.DefaultYear(), "Year of the puzzle")
		cmd.Flags().IntP("day", "d", config.DefaultDay(), "Day of the puzzle")
	}

	// Language flag only for template command
	generateTemplateCmd.Flags().StringP("lang", "l", config.Get().DefaultLanguage, "Language to generate templates for")
}
