# Architecture

This document describes the structure and design decisions of this Advent of Code repository.

## Overview

This repository contains solutions to [Advent of Code](https://adventofcode.com/) puzzles in multiple programming languages. The architecture is designed around these principles:

1. **Unified Interface**: All languages use the same commands via justfiles
2. **Runner Pattern**: Each language has a central runner that dispatches to individual day solutions
3. **Zero-Config Defaults**: Running without arguments defaults to today's puzzle
4. **Self-Contained Languages**: Each language lives in its own folder with its own tooling

```
advent-of-code/
├── justfile                    # Root task runner (delegates to languages)
├── ARCHITECTURE.md             # This file
├── README.md
├── BENCHMARKS.md
│
├── inputs/                     # Puzzle inputs (git submodule, private)
│   ├── 2023/
│   │   ├── 01.txt
│   │   └── ... 
│   └── 2024/
│       └── ... 
│
├── solutions/
│   ├── js/                     # JavaScript solutions
│   │   ├── justfile
│   │   ├── main.js             # Runner/entry point
│   │   ├── package.json
│   │   ├── tools/              # JS-specific utilities
│   │   ├── utils/              # Shared helper functions
│   │   └── years/
│   │       ├── 2023/
│   │       │   ├── 01.js
│   │       │   └── ...
│   │       └── 2024/
│   │           └── ...
│   │
│   └── rust/                   # Rust solutions
│       ├── justfile
│       ├── Cargo.toml          # Workspace manifest
│       ├── src/
│       │   ├── main.rs         # Runner/entry point
│       │   ├── args.rs         # CLI argument parsing
│       │   └── commands/       # Run, list, benchmark commands
│       ├── common/             # Shared Rust utilities
│       └── aoc_2024/           # Year-specific crate
│           ├── Cargo.toml
│           └── src/
│               ├── lib.rs
│               └── day01.rs
│
├── cli/                        # Go CLI tools (planned)
│   ├── go.mod
│   └── ... 
│
├── .vscode/                    # VS Code configuration
│   ├── launch.json             # Debug configurations
│   └── settings.json           # Editor settings
│
└── .zed/                       # Zed editor configuration
    ├── debug. json
    └── settings.json
```

---

## Runner Pattern

Both JavaScript and Rust use a **runner pattern** where a central entry point dispatches to individual day solutions. This provides:

- Consistent CLI interface across all days
- Automatic "today" defaults
- Built-in benchmarking and listing
- Shared input loading logic

### JavaScript Runner

```
bun main.js [--day=N] [--year=YYYY] [--part=P] [--all] [--all-years]
```

The runner dynamically imports day modules from `years/YYYY/DD.js`:

```javascript
// main.js loads days dynamically
const { part_a, part_b } = await import(`./years/${year}/${day}.js`);
```

Each day exports `part_a` and `part_b` functions:

```javascript
// years/2024/01.js
export function part_a(input) {
  // Solution here
  return answer;
}

export function part_b(input) {
  return answer;
}
```

### Rust Runner

```
cargo run [--release] -- <command> [day] [year] [part]
```

Commands:
- `run [day] [year] [part]` - Run a specific day (defaults to today) with optional part (a or b)
- `run-all` - Run all solutions
- `list [year]` - List solutions for a year
- `list-all` - List all solutions
- `benchmark [day] [year]` - Benchmark a solution
- `benchmark-all` - Benchmark everything

Each year is a separate crate (`aoc_2024`, `aoc_2023`, etc.) that exports solutions implementing the `Solution` trait from `common`:

```rust
// common/src/lib.rs
pub trait Solution {
    fn part_a(&self, input: &str) -> Option<String>;
    fn part_b(&self, input: &str) -> Option<String>;
}

// aoc_2024/src/day01.rs
pub struct Day01;

impl Solution for Day01 {
    fn part_a(&self, input: &str) -> Option<String> {
        // Solution here
        Some(answer. to_string())
    }

    fn part_b(&self, input: &str) -> Option<String> {
        Some(answer.to_string())
    }
}
```

---

## Justfile Interface

All languages expose the same commands through justfiles.  This provides a unified interface regardless of the underlying tooling. 

### Root Justfile Commands

| Command | Description | Example |
|---------|-------------|---------|
| `just run <lang> [day] [year] [part]` | Run a specific day | `just run js 5 2024` |
| `just run-year <lang> [year]` | Run all days in a year | `just run-year rust 2024` |
| `just run-all <lang>` | Run all solutions | `just run-all js` |
| `just list <lang> [year]` | List available solutions | `just list rust 2024` |
| `just <lang> [day] [year]` | Shortcut for run | `just js 5 2024` |
| `just today` | Run today in all languages | `just today` |

### Language Justfile Contract

Each language justfile must implement:

```just
# Required commands (same interface for all languages)
run day year part   # Run a specific day
run-year year       # Run all days in a year  
run-all             # Run everything
list year           # List solutions for a year
list-all            # List all solutions
bench day year      # Benchmark a day
```

This contract ensures new languages can be added seamlessly. 

---

## Input Management

Puzzle inputs are stored in a separate private git submodule (`inputs/`) to comply with Advent of Code's request not to share inputs publicly.

```
inputs/
├── 2023/
│   ├── 01.txt
│   ├── 02.txt
│   └── ...
└── 2024/
    ├── 01.txt
    └── ...
```

Input loading is handled by each language's utilities:

- **JavaScript**: `tools/read.js` → `readInput(year, day)`
- **Rust**: `common` crate → input loading functions

Both resolve paths relative to the repository root using environment variables or path traversal.

---

## Adding a New Language

To add a new language (e.g., Python):

### 1. Create the directory structure

```
solutions/python/
├── justfile              # Required: implements the command interface
├── main.py               # Runner with CLI argument parsing
├── pyproject.toml        # Language-specific config
└── years/
    └── 2024/
        └── 01.py
```

### 2.  Implement the runner

The runner should:
- Accept `day` and `year` arguments
- Default to today's date if not provided
- Support `--all` and `--all-years` flags
- Load input from `../../inputs/{year}/{day}.txt`
- Call the appropriate day's solution

### 3. Create the justfile

```just
# solutions/python/justfile

default_year := `date +%Y`
default_day := `date +%-d`

run day=default_day year=default_year:
    python main.py --day={{day}} --year={{year}}

run-year year=default_year:
    python main.py --year={{year}} --all

run-all:
    python main.py --all-years

list year=default_year:
    @ls -1 years/{{year}}/day_*.py 2>/dev/null | sed 's/.*day_//' | sed 's/\.py$//' || echo "No solutions"

list-all:
    @for year in years/*/; do echo "$$(basename $$year): $$(ls -1 $$year*.py 2>/dev/null | wc -l) days"; done

bench day=default_day year=default_year:
    python -m timeit -n 100 "exec(open('years/{{year}}/day_{{day}}.py').read())"
```

### 4. Add debug configuration

Add entries to `.vscode/launch.json` and `.zed/debug.json` for the new language. 

### 5. Update root justfile (optional)

Add a shortcut if desired:

```just
python day=default_day year=default_year:
    just run python {{day}} {{year}}
```

---

## Editor Configuration

### VS Code

Configuration lives in `.vscode/`:

- **`settings.json`**: Editor settings, LSP configuration
  - `rust-analyzer.linkedProjects`: Points to `solutions/rust/Cargo.toml`
  - `eslint.workingDirectories`: Points to `solutions/js`

- **`launch.json`**: Debug configurations for all languages
  - Uses `${input:day}` and `${input:year}` for interactive prompts
  - Each language has "Debug Day" and "Debug Today" configurations

### Zed

Configuration lives in `.zed/`:

- **`settings.json`**: LSP configuration
- **`debug.json`**: Debug configurations (DAP-based)

### Key Paths

Since the repository root is not where language projects live, LSPs need hints:

| Language | Project Root | Config Needed |
|----------|--------------|---------------|
| Rust | `solutions/rust/` | `rust-analyzer.linkedProjects` |
| JavaScript | `solutions/js/` | `eslint.workingDirectories` |
| Go | `cli/` | Usually auto-detected |

---

## Debugging

Debug configurations launch the **runner** with arguments, not individual day files.  This works because:

1. You set breakpoints in day files (e.g., `years/2024/01.js`)
2. Launch the runner with `--day=1 --year=2024`
3. Runner dynamically loads the day file
4.  Breakpoints hit when that code executes

### VS Code Debug Configurations

| Configuration | Language | Description |
|---------------|----------|-------------|
| `JS: Debug Day` | JavaScript | Prompts for day/year, runs main.js |
| `JS: Debug Today` | JavaScript | Runs main.js with defaults |
| `Rust: Debug Day` | Rust | Prompts for day/year, runs cargo |
| `Rust: Debug Today` | Rust | Runs cargo with defaults |
| `Go CLI: Download` | Go | Debug the CLI download command |

### Rust-Specific

Rust debugging requires:
- CodeLLDB extension
- `--manifest-path` pointing to `solutions/rust/Cargo.toml`
- Working directory set to `solutions/rust`

---

## Benchmarking

Each language supports benchmarking through its runner:

```bash
# Single day
just bench js 5 2024
just bench rust 5 2024

# All solutions (Rust)
cargo run --release -- benchmark-all
```

Benchmark results are tracked in `BENCHMARKS.md`. 

---

## CLI Tools (Maybe planned)

A Go-based CLI (`cli/`) is planned for cross-cutting utilities:

```bash
./bin/aoc-cli download 2024 5      # Download puzzle input
./bin/aoc-cli generate js 2024 5   # Generate day template
./bin/aoc-cli bench 2024 5         # Benchmark across languages
```

Benefits of Go for CLI:
- Compiles to single static binary
- No runtime dependencies
- Cross-platform (Linux, macOS, Windows)
- Fast startup time

---

## Design Decisions

### Why runners instead of standalone files?

1. **Consistent CLI**: `just run js 5` works the same as `just run rust 5`
2. **Smart defaults**: Auto-defaults to today's puzzle during December
3. **Built-in tooling**: Benchmarking, listing, run-all come free
4. **Shared utilities**: Input loading, common helpers are centralized
5. **Easier debugging**: One entry point to configure

### Why justfiles? 

1. **Language-agnostic**: Works for any language
2. **Self-documenting**: `just --list` shows available commands
3. **Composable**: Root justfile delegates to language justfiles
4. **No dependencies**: `just` is a single binary

### Why separate year crates in Rust?

1. **Faster compilation**: Only rebuild the year you're working on
2. **Clean namespacing**: `aoc_2024::Day01` vs `aoc_2023::Day01`
3. **Independent dependencies**: Different years can use different crate versions
4. **Workspace benefits**: Shared `target/` directory, unified `cargo` commands

### Why git submodule for inputs?

1. **Privacy**: Advent of Code asks not to share inputs publicly
2. **Separation**: Solutions are public, inputs are private
3. **Easy cloning**: Contributors can clone without inputs, add their own

---

## Future Considerations

- **More languages**: Go, C#, ...
- **Containerization**: Docker/devcontainer for zero-install running
- **CI/CD**: GitHub Actions for testing solutions (yeah you wish Copilot huh?)
- **Visualization**: Tools for visualizing puzzle solutions
- **Leaderboard tracking**: Automatic time/rank recording (since there are no more Leaderboards, probably not, maybe private ones)