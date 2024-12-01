use common::{Answer, Solution};
use itertools::Itertools;

pub struct Day01;

impl Solution for Day01 {
    fn name(&self) -> &'static str {
        "Historian Hysteria"
    }

    fn year(&self) -> &'static u16 {
        &2024
    }

    fn day(&self) -> &'static u32 {
        &1
    }

    fn part_a(&self, input: &str) -> Answer {
        let (mut lefts, mut rights): (Vec<i32>, Vec<i32>) = input
            .trim()
            .lines()
            .map(|l| {
                l.split_whitespace()
                    .map(|nums| nums.parse::<i32>().unwrap())
                    .collect_tuple()
                    .unwrap()
            })
            .unzip();

        lefts.sort();
        rights.sort();

        lefts
            .into_iter()
            .zip(rights)
            .map(|(l, r)| (l - r).abs())
            .sum::<i32>()
            .into()
    }

    fn part_b(&self, input: &str) -> Answer {
        let (lefts, rights): (Vec<i32>, Vec<i32>) = input
            .trim()
            .lines()
            .map(|l| {
                l.split_whitespace()
                    .map(|nums| nums.parse::<i32>().unwrap())
                    .collect_tuple()
                    .unwrap()
            })
            .unzip();

        lefts
            .iter()
            .map(|l| l * rights.iter().filter(|r| *r == l).count() as i32)
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
