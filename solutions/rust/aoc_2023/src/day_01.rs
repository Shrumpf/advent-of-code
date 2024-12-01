use common::{Answer, Solution};
use regex::Regex;

pub struct Day01;

impl Solution for Day01 {
    fn name(&self) -> &'static str {
        "Trebuchet"
    }

    fn year(&self) -> &'static u16 {
        &2023
    }

    fn day(&self) -> &'static u32 {
        &1
    }

    fn part_a(&self, input: &str) -> Answer {
        let re = Regex::new(r"\D").unwrap();
        input
            .trim()
            .split("\n")
            .map(|l| re.replace_all(l, "").to_string())
            .map(|l| format!("{}{}", l.chars().nth(0).unwrap(), l.chars().last().unwrap()))
            .map(|l| l.parse::<i32>().unwrap())
            .sum::<i32>()
            .into()
    }

    fn part_b(&self, input: &str) -> Answer {
        let re = Regex::new(r"\D").unwrap();
        input
            .trim()
            .split("\n")
            .map(|l| {
                re.replace_all(
                    &l.replace("one", "o1e")
                        .replace("two", "t2o")
                        .replace("three", "t3e")
                        .replace("four", "f4r")
                        .replace("five", "f5e")
                        .replace("six", "s6x")
                        .replace("seven", "s7n")
                        .replace("eight", "e8t")
                        .replace("nine", "n9e"),
                    "",
                )
                .to_string()
            })
            .map(|l| format!("{}{}", l.chars().nth(0).unwrap(), l.chars().last().unwrap()))
            .map(|l| l.parse::<i32>().unwrap())
            .sum::<i32>()
            .into()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use common::load_example;
    use common::load_example_solution;

    #[test]
    fn part_a() {
        let year = *Day01.year();
        let day = *Day01.day();
        let part = common::Part::A;

        let input = load_example(year, day, part);
        let res = Day01.part_a(&input);
        let ans = load_example_solution(year, day, part);
        assert_eq!(res, ans);
    }

    #[test]
    fn part_b() {
        let year = *Day01.year();
        let day = *Day01.day();
        let part = common::Part::B;

        let input = load_example(year, day, part);
        let res = Day01.part_b(&input);
        let ans = load_example_solution(year, day, part);
        assert_eq!(res, ans);
    }
}
