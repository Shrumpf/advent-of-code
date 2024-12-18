use core::panic;
use std::{env, fs, io};

use crate::{Answer, Part};

/// Load the input for the given year and day.
/// Removes carriage returns and trims leading and trailing whitespace.
pub fn load(year: u16, day: u32) -> io::Result<String> {
    load_raw(year, day).map(|x| x.trim().replace('\r', ""))
}

/// Load the input for the given year and day.
pub fn load_raw(year: u16, day: u32) -> io::Result<String> {
    let file = if env::current_dir()
        .unwrap()
        .to_str()
        .unwrap()
        .contains("aoc_")
    {
        format!("../../../inputs/{year}/{:02}/{:02}.input.txt", day, day)
    } else {
        format!("../../inputs/{year}/{:02}/{:02}.input.txt", day, day)
    };

    fs::read_to_string(file)
}

pub fn load_example(year: u16, day: u32, part: Part) -> String {
    let path = format!("../../../examples/{year}/{:02}/{:02}.input.txt", day, day);
    println!("{}", path);
    let file = fs::read_to_string(path);

    if let Ok(file) = file {
        return file;
    }

    let path_with_part = format!(
        "../../../examples/{year}/{:02}/{:02}{}.input.txt",
        day, day, part
    );

    let file_with_part = fs::read_to_string(path_with_part);

    match file_with_part {
        Ok(file) => file,
        Err(err) => panic!("{}", err),
    }
}

pub fn load_example_solution(year: u16, day: u32, part: Part) -> Answer {
    let path = format!(
        "../../../examples/{year}/{:02}/{:02}{}.solution.txt",
        day, day, part
    );
    let file = fs::read_to_string(path);

    match file {
        Ok(file) => file.into(),
        Err(err) => panic!("{}", err),
    }
}
