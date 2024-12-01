use std::time::Instant;

use anyhow::{Context, Result};
use common::{human_time, load, Part, Solution};

use crate::{args::RunArgs, get_year, get_years};

fn run_solution(solution: &dyn Solution, part: Option<Part>) -> u128 {
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

        let time = start.elapsed().as_nanos();
        println!(
            "  [+] Part {}: {} ({})",
            part.unwrap().to_string().to_uppercase(),
            out,
            human_time(time)
        );
        return time;
    }

    let start_a = Instant::now();
    let sln_a = solution.part_a(&input);
    let time_a = start_a.elapsed().as_nanos();
    println!("  [+] Part A: {} ({})", sln_a, human_time(time_a));

    let start_b = Instant::now();
    let sln_b = solution.part_b(&input);
    let time_b = start_b.elapsed().as_nanos();

    println!("  [+] Part B: {} ({})", sln_b, human_time(time_b));

    time_a + time_b
}

pub fn run_all() -> Result<()> {
    let years = get_years();

    let mut sum = 0;
    let mut solutions = 0;

    for year in years {
        for solution in year {
            solutions += 1;

            sum += run_solution(*solution, None);
        }
    }

    println!(
        "Everything done. {} year(s) and {} solution(s) with 2 parts took {}",
        years.len(),
        solutions,
        human_time(sum)
    );

    Ok(())
}

pub fn run(cmd: &RunArgs) -> Result<()> {
    let solutions = get_year(cmd.year);
    let solution = solutions
        .get(cmd.day.saturating_sub(1) as usize)
        .with_context(|| format!("No solution for day {} in year {}", cmd.day, cmd.year))?;

    run_solution(*solution, cmd.part);
    Ok(())
}
