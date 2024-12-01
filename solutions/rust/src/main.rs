use anyhow::Result;
use clap::Parser;

use args::{Args, Commands};
use common::Solution;
mod args;
mod commands;

fn main() -> Result<()> {
    let args = Args::parse();

    match &args.command {
        Commands::Run(cmd) => commands::run::run(cmd)?,
        Commands::List(cmd) => commands::list::list(cmd)?,
        Commands::RunAll => commands::run::run_all()?,
    }

    Ok(())
}

fn get_years() -> [&'static [&'static dyn Solution]; 4] {
    [
        &aoc_2018::ALL,
        &aoc_2022::ALL,
        &aoc_2023::ALL,
        &aoc_2024::ALL,
    ]
}

fn get_year(year: u16) -> &'static [&'static dyn Solution] {
    match year {
        2018 => &aoc_2018::ALL,
        2022 => &aoc_2022::ALL,
        2023 => &aoc_2023::ALL,
        2024 => &aoc_2024::ALL,
        _ => &[],
    }
}
