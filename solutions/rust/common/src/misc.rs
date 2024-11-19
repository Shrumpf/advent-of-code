use core::panic;
use std::{fs, io};

use crate::{Answer, Part};

/// Load the input for the given year and day.
/// Removes carriage returns and trims leading and trailing whitespace.
pub fn load(year: u16, day: u32) -> io::Result<String> {
    load_raw(year, day).map(|x| x.trim().replace('\r', ""))
}

/// Load the input for the given year and day.
pub fn load_raw(year: u16, day: u32) -> io::Result<String> {
    let file = format!("../../inputs/{year}/{:02}/{:02}.input.txt", day, day);
    fs::read_to_string(file)
}

pub fn load_example(year: u16, day: u32, part: Part) -> String {
    let path = format!("../../../examples/{year}/{:02}/{:02}.input.txt", day, day);
    println!("{}", path);
    let file = fs::read_to_string(path);

    if file.is_ok() {
        return file.unwrap();
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

pub fn human_time(time: u128) -> String {
    const TIME_UNITS: &[&str] = &["ns", "μs", "ms", "s"];

    let mut time = time;
    for i in TIME_UNITS {
        if time < 1000 {
            return format!("{}{}", time, i);
        }
        time /= 1000;
    }

    format!("{}{}", time, TIME_UNITS.last().unwrap())
}
