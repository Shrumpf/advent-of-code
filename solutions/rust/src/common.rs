use std::fs;
use std::io;
use std::io::Write;
use std::path::Path;

const TIME_UNITS: &[&str] = &["ns", "μs", "ms", "s"];

pub fn load(day: &str) -> String {
    let path = format!("../../inputs/2023/{}.input.txt", day);
    let file = Path::new(&path);
    fs::read_to_string(file).unwrap_or_else(|_| panic!("Error reading file {}", file.display()))
}

pub fn load_example(day: &str, part: &str) -> String {
    let path = format!("../../examples/2023/{}{}.input.txt", day, part);
    let file = Path::new(&path);
    fs::read_to_string(file).unwrap_or_else(|_| panic!("Error reading example {}", file.display()))
}

pub fn load_example_solution(year: &str, day: &str, part: &str) -> String {
    let path = format!("../../examples/{}/{}{}.solution.txt", year, day, part);
    let file = Path::new(&path);
    fs::read_to_string(file)
        .unwrap_or_else(|_| panic!("Error reading example solution {}", file.display()))
}

pub trait Solution {
    fn name(&self) -> String;
    fn part_a(&self, input: String) -> String;
    fn part_b(&self, input: String) -> String;
}

pub fn time_unit(time: u128) -> String {
    let mut time = time;
    for i in TIME_UNITS {
        if time < 1000 {
            return format!("{}{}", time, i);
        }
        time /= 1000;
    }

    format!("{}{}", time, TIME_UNITS.last().unwrap())
}

pub fn input(inp: &str) -> Option<String> {
    print!("{}", inp);

    let mut buff = String::new();
    io::stdout().flush().ok()?;
    io::stdin().read_line(&mut buff).ok()?;
    while buff.ends_with('\n') || buff.ends_with('\r') {
        buff.pop();
    }

    Some(buff)
}
