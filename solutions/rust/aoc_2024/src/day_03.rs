use common::{Answer, Solution};
use regex::Regex;

pub struct Day03;

impl Solution for Day03 {
    fn name(&self) -> &'static str {
        "Mull It Over"
    }

    fn year(&self) -> &'static u16 {
        &2024
    }

    fn day(&self) -> &'static u32 {
        &3
    }

    fn part_a(&self, input: &str) -> Answer {
        let re = Regex::new(r"(mul\((\d+),(\d+)\))").unwrap();

        re.captures_iter(input)
            .map(|c| c.extract())
            .fold(0, |acc, (_, [_, first, second])| {
                acc + first.parse::<i64>().unwrap() * second.parse::<i64>().unwrap()
            })
            .into()
    }

    fn part_b(&self, input: &str) -> Answer {
        let re = Regex::new(r"(mul\((\d+),(\d+)\))|(don't\(\))()()|(do\(\))()()").unwrap();

        let mut add = true;
        re.captures_iter(input)
            .map(|c| c.extract())
            .fold(0, |acc, (_, [op, first, second])| {
                if op == "don't()" {
                    add = false;
                } else if op == "do()" {
                    add = true;
                } else if add {
                    return acc + first.parse::<i32>().unwrap() * second.parse::<i32>().unwrap();
                }
                acc
            })
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
        let year = *Day03.year();
        let day = *Day03.day();
        let part = common::Part::A;

        let input = load_example(year, day, part);
        let res = Day03.part_a(&input);
        let ans = load_example_solution(year, day, part);
        assert_eq!(res, ans);
    }

    #[test]
    fn part_b() {
        let year = *Day03.year();
        let day = *Day03.day();
        let part = common::Part::B;

        let input = load_example(year, day, part);
        let res = Day03.part_b(&input);
        let ans = load_example_solution(year, day, part);
        assert_eq!(res, ans);
    }
}
