# Root justfile - unified interface for all languages

default_year := `date +%Y`
default_day := `date +%d`

_default:
    @just --list

# Run a solution: just run <lang> [day] [year] [part]
run lang day=default_day year=default_year part="":
    just solutions/{{lang}}/run {{day}} {{year}} {{part}}

run-year lang year=default_year:
    just solutions/{{lang}}/run-year {{year}}

run-all lang:
    just solutions/{{lang}}/run-all

# Benchmark a solution
bench lang day=default_day year=default_year:
    just solutions/{{lang}}/bench {{day}} {{year}}

bench-year lang year=default_year:
    just solutions/{{lang}}/bench-year {{year}}

bench-all lang:
    just solutions/{{lang}}/bench-all

# List solutions for a year
list lang year=default_year:
    just solutions/{{lang}}/list {{year}}

list-all lang:
    just solutions/{{lang}}/list-all

# Test solution: just run <lang> [day] [year]
test lang day=default_day year=default_year:
    just solutions/{{lang}}/test {{day}} {{year}}

test-year lang year=default_year:
    just solutions/{{lang}}/test-year {{year}}

test-all lang:
    just solutions/{{lang}}/test-all

test-watch lang day=default_day year=default_year:
    just solutions/{{lang}}/test-watch {{day}} {{year}}


# === Shortcuts ===

# JS shortcut
js day=default_day year=default_year:
    just run js {{day}} {{year}}

# Rust shortcut
rust day=default_day year=default_year:
    just run rust {{day}} {{year}}
