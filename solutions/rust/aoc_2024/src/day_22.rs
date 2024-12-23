use std::collections::{HashMap, VecDeque};

use common::{Answer, Solution};
use itertools::Itertools;

pub struct Day22;

fn calculate_secret(mut secret: usize) -> usize {
    secret ^= (secret << 6) & 16777215;
    secret ^= (secret >> 5) & 16777215;
    secret ^= (secret << 11) & 16777215;
    secret
}

impl Solution for Day22 {
    fn name(&self) -> &'static str {
        "Monkey Market"
    }

    fn year(&self) -> &'static u16 {
        &2024
    }

    fn day(&self) -> &'static u32 {
        &22
    }

    fn part_a(&self, input: &str) -> Answer {
        input
            .lines()
            .map(|code| code.parse::<usize>().unwrap())
            .fold(0, |acc, code| {
                let mut secret = code;
                for _ in 0..2000 {
                    secret = calculate_secret(secret);
                }
                acc + secret
            })
            .into()
    }

    fn part_b(&self, input: &str) -> Answer {
        let solution = input
            .lines()
            .map(|code| code.parse::<isize>().unwrap())
            .fold(HashMap::new(), |mut acc, code| {
                let mut secret = code;
                let mut price;
                let mut last_price;
                let mut prices = VecDeque::new();
                let mut cache = HashMap::new();

                for _ in 0..2000 {
                    last_price = secret % 10;
                    secret = calculate_secret(secret as usize) as isize;
                    price = secret % 10;
                    let diff = price - last_price;
                    prices.push_back(diff);

                    if prices.len() > 4 {
                        prices.pop_front();
                    }

                    if prices.len() == 4 {
                        let key = prices.iter().join(",");

                        if !cache.contains_key(&key) {
                            cache.insert(key.clone(), true);

                            *acc.entry(key).or_insert(0) += price;
                        }
                    }
                }
                acc
            });
        let solution = solution.values().max().unwrap();
        (*solution as i32).into()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use common::load_example;
    use common::load_example_solution;

    #[test]
    fn part_a() {
        let year = *Day22.year();
        let day = *Day22.day();
        let part = common::Part::A;

        let input = load_example(year, day, part);
        let res = Day22.part_a(&input);
        let ans = load_example_solution(year, day, part);
        assert_eq!(res, ans);
    }

    #[test]
    fn part_b() {
        let year = *Day22.year();
        let day = *Day22.day();
        let part = common::Part::B;

        let input = load_example(year, day, part);
        let res = Day22.part_b(&input);
        let ans = load_example_solution(year, day, part);
        assert_eq!(res, ans);
    }
}
