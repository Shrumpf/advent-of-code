use std::time::{Duration, Instant};

use anyhow::{Context, Result};
use common::{load, Part, Solution};

use crate::{args::RunArgs, get_year, get_years};

pub fn run_solution(solution: &dyn Solution, part: Option<Part>) -> Duration {
    let input = load(*solution.year(), *solution.day()).unwrap();
    println!(
        "[*] Running: {} Day {}: {}",
        solution.year(),
        solution.day(),
        solution.name()
    );

    if part.is_some() {
        let start = Instant::now();
        let out = match part.unwrap() {
            Part::A => solution.part_a(&input),
            Part::B => solution.part_b(&input),
        };

        let time = start.elapsed();
        println!(
            "  [+] Part {}: {} ({:.2?})",
            part.unwrap().to_string().to_uppercase(),
            out,
            time
        );
        return time;
    }

    let start_a = Instant::now();
    let sln_a = solution.part_a(&input);
    let time_a = start_a.elapsed();
    println!("  [+] Part A: {} ({:.2?})", sln_a, time_a);

    let start_b = Instant::now();
    let sln_b = solution.part_b(&input);
    let time_b = start_b.elapsed();

    println!("  [+] Part B: {} ({:.2?})", sln_b, time_b);

    time_a + time_b
}

pub fn run_all() -> Result<()> {
    let years = get_years();

    let mut sum = Duration::new(0, 0);
    let mut solutions = 0;

    for year in years {
        for solution in year {
            solutions += 1;

            sum += run_solution(*solution, None);
        }
    }

    println!(
        "Everything done. {} year(s) and {} solution(s) with 2 parts took {:.2?}",
        years.len(),
        solutions,
        sum
    );

    Ok(())
}

pub fn run(cmd: &RunArgs) -> Result<()> {
    let solutions = get_year(cmd.year);
    let solution = solutions
        .iter()
        .find(|s| s.day() == &cmd.day)
        .with_context(|| format!("No solution for day {} in year {}", cmd.day, cmd.year))?;

    run_solution(*solution, cmd.part);
    Ok(())
}
