use anyhow::{Context, Result};
use common::{Part, Solution};
use serde::Serialize;
use std::fs;
use std::path::PathBuf;
use std::time::Instant;

use crate::args::BenchmarkArgs;
use crate::{get_year, get_years};

use super::run::run_solution;

#[derive(Serialize)]
struct Benchmark {
    part_a: Measurement,
    part_b: Measurement,
}

#[derive(Serialize)]
struct Measurement {
    time: u128,
    iterations: u32,
}

fn benchmark_solution(solution: &dyn Solution) -> Result<Benchmark> {
    let results = Benchmark {
        part_a: measure_performance(|| run_solution(solution, Some(Part::A))),
        part_b: measure_performance(|| run_solution(solution, Some(Part::B))),
    };

    let benchmark_dir = PathBuf::from("../../benchmarks")
        .join(solution.year().to_string())
        .join(format!("{:02}", solution.day()));

    fs::create_dir_all(&benchmark_dir)?;

    let json = serde_json::to_string_pretty(&results)?;
    fs::write(benchmark_dir.join("rust.json"), json)?;

    Ok(results)
}

pub fn benchmark(cmd: &BenchmarkArgs) -> Result<()> {
    let solutions = get_year(cmd.year);
    let solution = solutions
        .iter()
        .find(|s| s.day() == &cmd.day)
        .with_context(|| format!("No solution for day {} in year {}", cmd.day, cmd.year))?;

    benchmark_solution(*solution)?;

    Ok(())
}

pub fn benchmark_all() -> Result<()> {
    let years = get_years();

    for year in years {
        for solution in year {
            benchmark_solution(*solution)?;
        }
    }

    Ok(())
}

fn measure_performance<F, T>(mut f: F) -> Measurement
where
    F: FnMut() -> T,
{
    // Warmup
    for _ in 0..10 {
        f();
    }

    let iterations = 100;
    let mut times = Vec::with_capacity(iterations as usize);

    // Measure
    for _ in 0..iterations {
        let start = Instant::now();
        f();
        times.push(start.elapsed().as_nanos());
    }

    Measurement {
        time: *times.iter().min().unwrap(),
        iterations,
    }
}
