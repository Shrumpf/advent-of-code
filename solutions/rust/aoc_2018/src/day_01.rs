use std::collections::HashSet;

use common::{Answer, Solution};

pub struct Day01;

impl Solution for Day01 {
    fn name(&self) -> &'static str {
        "Chronal Calibration"
    }

    fn year(&self) -> &'static u16 {
        &2018
    }

    fn day(&self) -> &'static u32 {
        &1
    }

    fn part_a(&self, input: &str) -> Answer {
        input
            .lines()
            .map(|l| l.parse::<i32>().unwrap())
            .sum::<i32>()
            .to_string()
            .into()
    }

    fn part_b(&self, input: &str) -> Answer {
        let mut frequency = 0;
        let mut history = HashSet::from([0]);

        loop {
            for change in input.lines().map(|l| l.parse::<i32>().unwrap()) {
                frequency += change;

                if history.contains(&frequency) {
                    return frequency.to_string().into();
                }

                history.insert(frequency);
            }
        }
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
