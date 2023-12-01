use chrono::Datelike;
use std::env;

mod common;
mod years;

fn main() {
    println!("Advent of Code 2022 Solutions");
    println!("  template by Connor Slade  \n");

    // Use run args for day and part
    // Run like: cargo run -- <day><a | b>
    // Ex: cargo run -- 0a
    if let Some(run_arg) = env::args().nth(1) {
        if run_arg == "all" {
            for i in 0..years::year_2023::ALL.len() {
                run(i, "a".to_string());
                run(i, "b".to_string());
            }
            return;
        } else if run_arg == "today" {
            let today = chrono::offset::Local::now().date_naive().day0() as usize;
            run(today, "a".to_string());
            run(today, "b".to_string());
            return;
        }
        let part = run_arg.chars().last().unwrap().to_string();
        let mut run_arg = run_arg.chars();
        run_arg.next_back().unwrap();
        return run(run_arg.as_str().parse().unwrap(), part);
    };

    for (i, item) in years::year_2023::ALL.iter().enumerate() {
        println!("[{}] {}", i, item.name());
    }

    let run_index = common::input("\nIndex ❯ ").unwrap();
    let run_index = match run_index.parse::<usize>() {
        Ok(i) => i,
        Err(_) => return println!("Das not a number..."),
    };

    if run_index >= years::year_2023::ALL.len() {
        return println!("[*] Invaild Id");
    }

    let part = common::input("Part (A / B) ❯ ").unwrap();
    run(run_index, part);
}

fn run(run_index: usize, part: String) {
    let a = format!("{:02}", run_index + 1);
    let this_sol = years::year_2023::ALL[run_index];

    println!("[*] Running: {} ({})", this_sol.name(), part.to_uppercase());

    let start = std::time::Instant::now();
    let out = match part.to_lowercase().as_str() {
        "a" => this_sol.part_a(common::load(&a)),
        "b" => this_sol.part_b(common::load(&a)),
        _ => return println!("[-] Invalid Part"),
    };
    let time = start.elapsed().as_nanos();

    println!("[+] OUT: {} ({})", out, common::time_unit(time));
}
