use anyhow::Result;
use common::Solution;

use crate::{args::ListArgs, get_year, get_years};

fn print_list(solutions: &[&dyn Solution]) {
    for (i, e) in solutions.iter().enumerate() {
        let last = i + 1 == solutions.len();
        println!(
            " {} Day {}: {}",
            if last { "└" } else { "├" },
            e.day(),
            e.name()
        );
    }
}

pub fn list(cmd: &ListArgs) -> Result<()> {
    let solutions = get_year(cmd.year);
    println!("[*] Solutions for {}:", cmd.year);

    print_list(solutions);

    Ok(())
}

pub fn list_all() -> Result<()> {
    let years = get_years();

    for year in years {
        // let solutions = get_year(year);
        println!("[*] Solutions for {}:", year[0].year());

        print_list(year);
    }

    Ok(())
}
