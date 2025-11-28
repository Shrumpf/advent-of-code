package cmd

import (
	"os"

	"github.com/spf13/cobra"
)

var completionCmd = &cobra.Command{
	Use:   "completion [bash|zsh|fish|powershell]",
	Short: "Generate shell completion scripts",
	Long: `Generate shell completion scripts for the CLI.

To load completions:

Bash:
  $ source <(cli completion bash)

  # To load completions for each session, execute once:
  # Linux:
  $ cli completion bash > /etc/bash_completion.d/cli
  # macOS:
  $ cli completion bash > $(brew --prefix)/etc/bash_completion.d/cli

Zsh:
  # If shell completion is not already enabled in your environment,
  # you will need to enable it. You can execute the following once:
  $ echo "autoload -U compinit; compinit" >> ~/.zshrc

  # To load completions for each session, execute once:
  $ cli completion zsh > "${fpath[1]}/_cli"

  # You will need to start a new shell for this setup to take effect.

Fish:
  $ cli completion fish | source

  # To load completions for each session, execute once:
  $ cli completion fish > ~/.config/fish/completions/cli.fish

PowerShell:
  PS> cli completion powershell | Out-String | Invoke-Expression

  # To load completions for every new session, run:
  PS> cli completion powershell > cli.ps1
  # and source this file from your PowerShell profile.
`,
	DisableFlagsInUseLine: true,
	ValidArgs:             []string{"bash", "zsh", "fish", "powershell"},
	Args:                  cobra.MatchAll(cobra.ExactArgs(1), cobra.OnlyValidArgs),
	RunE: func(cmd *cobra.Command, args []string) error {
		switch args[0] {
		case "bash":
			return cmd.Root().GenBashCompletion(os.Stdout)
		case "zsh":
			return cmd.Root().GenZshCompletion(os.Stdout)
		case "fish":
			return cmd.Root().GenFishCompletion(os.Stdout, true)
		case "powershell":
			return cmd.Root().GenPowerShellCompletionWithDesc(os.Stdout)
		}
		return nil
	},
}

func init() {
	rootCmd.AddCommand(completionCmd)
}
