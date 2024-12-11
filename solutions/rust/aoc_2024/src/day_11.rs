use std::collections::HashMap;

use common::{Answer, Solution};

pub struct Day11;

fn parse(input: &str) -> HashMap<usize, usize> {
    input
        .trim()
        .split(" ")
        .map(|n| (n.parse().unwrap(), 1))
        .collect()
}

fn iterate(input: &str, count: usize) -> usize {
    let mut list = parse(input);

    for _ in 0..count {
        let mut temp = HashMap::new();

        list.clone().into_iter().for_each(|(stone, count)| {
            if stone == 0 {
                *temp.entry(1).or_insert(0) += count;
            } else if stone.to_string().len() % 2 == 0 {
                let stringified = stone.to_string();
                let (first, second) = stringified.split_at(stringified.len() / 2);
                *temp.entry(first.parse().unwrap()).or_insert(0) += count;
                *temp.entry(second.parse().unwrap()).or_insert(0) += count;
            } else {
                *temp.entry(stone * 2024).or_insert(0) += count;
            }
        });

        list = temp;
    }

    list.values().sum()
}

impl Solution for Day11 {
    fn name(&self) -> &'static str {
        "Plutonian Pebbles"
    }

    fn year(&self) -> &'static u16 {
        &2024
    }

    fn day(&self) -> &'static u32 {
        &11
    }

    fn part_a(&self, input: &str) -> Answer {
        iterate(input, 25).into()
    }

    fn part_b(&self, input: &str) -> Answer {
        iterate(input, 75).into()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use common::load_example;
    use common::load_example_solution;

    #[test]
    fn part_a() {
        let year = *Day11.year();
        let day = *Day11.day();
        let part = common::Part::A;

        let input = load_example(year, day, part);
        let res = Day11.part_a(&input);
        let ans = load_example_solution(year, day, part);
        assert_eq!(res, ans);
    }

    #[test]
    fn part_b() {
        let year = *Day11.year();
        let day = *Day11.day();
        let part = common::Part::B;

        let input = load_example(year, day, part);
        let res = Day11.part_b(&input);
        let ans = load_example_solution(year, day, part);
        assert_eq!(res, ans);
    }
}
