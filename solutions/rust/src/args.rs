use std::path::PathBuf;

use chrono::{Datelike, Utc};
use clap::{Parser, Subcommand};
use common::Part;

#[derive(Parser)]
#[command(
    name = "advent_of_code",
    author = "Connor Slade <connor@connorcode.com>"
)]
pub struct Args {
    #[command(subcommand)]
    pub command: Commands,
}

#[derive(Subcommand)]
pub enum Commands {
    /// Run a solution to a problem
    Run(RunArgs),
    /// List all solutions for a given year
    List(ListArgs),
    RunAll,
    RunYear(ListArgs),
    ListAll,
    /// Benchmark a solution to a problem
    Benchmark(BenchmarkArgs),
    /// Benchmark all solutions
    BenchmarkAll,
}

#[derive(Parser)]
pub struct RunArgs {
    /// The day to run
    #[arg(default_value_t = current_day())]
    pub day: u32,
    /// The year to run
    #[arg(default_value_t = current_year())]
    pub year: u16,
    /// The part to run, a or b
    pub part: Option<Part>,
    /// The location of the input file, will default to `data/{year:pad(2)}/{day:pad(2)}.txt`
    #[arg(short, long)]
    pub input: Option<PathBuf>,
}

#[derive(Parser)]
pub struct ListArgs {
    /// The year to list solutions for
    #[arg(default_value_t = current_year())]
    pub year: u16,
}

#[derive(Parser)]
pub struct BenchmarkArgs {
    /// The day to benchmark
    #[arg(default_value_t = current_day())]
    pub day: u32,
    /// The year to benchmark
    #[arg(default_value_t = current_year())]
    pub year: u16,
    /// The part to benchmark, a or b
    pub part: Option<Part>,
}

pub fn current_year() -> u16 {
    Utc::now().year() as u16
}

pub fn current_day() -> u32 {
    Utc::now().day()
}
