use core::panic;
use std::{fs, io, path::PathBuf};

use crate::{Answer, Part};

/// Get the real repo root starting from this crate's manifest directory.
///
/// Assumed layout:
///   <repo-root>/solutions/rust/common/Cargo.toml  (this crate)
///   <repo-root>/inputs/...
///   <repo-root>/examples/...
fn repo_root() -> PathBuf {
    let manifest_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"));

    // CARGO_MANIFEST_DIR = <repo-root>/solutions/rust/common
    // parent()           = <repo-root>/solutions/rust
    // parent()           = <repo-root>/solutions
    // parent()           = <repo-root>
    manifest_dir
        .parent()
        .and_then(|p| p.parent())
        .and_then(|p| p.parent())
        .expect("CARGO_MANIFEST_DIR hierarchy not as expected")
        .to_path_buf()
}

/// <repo-root>/inputs/<year>/<day>/<day>.input.txt
fn input_path(year: u16, day: u32) -> PathBuf {
    let mut base = repo_root();
    base.push("inputs");
    base.push(year.to_string());
    base.push(format!("{:02}", day));
    base.push(format!("{:02}.input.txt", day));
    base
}

/// <repo-root>/examples/<year>/<day>/<day>.input.txt
fn example_input_path(year: u16, day: u32) -> PathBuf {
    let mut base = repo_root();
    base.push("examples");
    base.push(year.to_string());
    base.push(format!("{:02}", day));
    base.push(format!("{:02}.input.txt", day));
    base
}

/// <repo-root>/examples/<year>/<day>/<day><part>.input.txt
fn example_input_part_path(year: u16, day: u32, part: Part) -> PathBuf {
    let mut base = repo_root();
    base.push("examples");
    base.push(year.to_string());
    base.push(format!("{:02}", day));
    base.push(format!("{:02}{}.input.txt", day, part));
    base
}

/// <repo-root>/examples/<year>/<day>/<day><part>.solution.txt
fn example_solution_path(year: u16, day: u32, part: Part) -> PathBuf {
    let mut base = repo_root();
    base.push("examples");
    base.push(year.to_string());
    base.push(format!("{:02}", day));
    base.push(format!("{:02}{}.solution.txt", day, part));
    base
}

/// Load the input for the given year and day.
/// Removes carriage returns and trims leading and trailing whitespace.
pub fn load(year: u16, day: u32) -> io::Result<String> {
    load_raw(year, day).map(|x| x.trim().replace('\r', ""))
}

/// Load the raw input for the given year and day.
pub fn load_raw(year: u16, day: u32) -> io::Result<String> {
    let path = input_path(year, day);
    fs::read_to_string(path)
}

pub fn load_example(year: u16, day: u32, part: Part) -> String {
    let path = example_input_path(year, day);
    if let Ok(file) = fs::read_to_string(&path) {
        return file;
    }

    let path_with_part = example_input_part_path(year, day, part);
    match fs::read_to_string(&path_with_part) {
        Ok(file) => file,
        Err(err) => panic!(
            "Failed to load example input for {year}-{day:02} part {part}: {err}\n\
             Tried:\n  {}\n  {}",
            path.display(),
            path_with_part.display()
        ),
    }
}

pub fn load_example_solution(year: u16, day: u32, part: Part) -> Answer {
    let path = example_solution_path(year, day, part);
    match fs::read_to_string(&path) {
        Ok(file) => file.into(),
        Err(err) => panic!(
            "Failed to load example solution for {year}-{day:02} part {part}: {err}\n\
             Tried: {}",
            path.display()
        ),
    }
}
