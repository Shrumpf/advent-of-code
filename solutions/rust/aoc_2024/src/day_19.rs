use std::collections::HashMap;

use common::{Answer, Solution};

pub struct Day19;

impl Solution for Day19 {
    fn name(&self) -> &'static str {
        "Linen Layout"
    }

    fn year(&self) -> &'static u16 {
        &2024
    }

    fn day(&self) -> &'static u32 {
        &19
    }

    fn part_a(&self, input: &str) -> Answer {
        fn check<'a>(
            design: &'a str,
            patterns: &Vec<&str>,
            cache: &mut HashMap<&'a str, usize>,
        ) -> usize {
            if design.is_empty() {
                return 1;
            }

            if let Some(&cached) = cache.get(design) {
                return cached;
            }

            for pattern in patterns {
                if let Some(subpattern) = design.strip_prefix(pattern) {
                    if check(subpattern, patterns, cache) == 1 {
                        cache.insert(design, 1);
                        return 1;
                    }
                }
            }

            cache.insert(design, 0);
            0
        }

        let mut lines = input.lines();
        let patterns = lines.next().unwrap().split(", ").collect::<Vec<&str>>();
        let designs = lines.skip(1).collect::<Vec<&str>>();
        let cache = &mut HashMap::new();

        designs
            .iter()
            .filter(|design| check(design, &patterns, cache) > 0)
            .count()
            .into()
    }

    fn part_b(&self, input: &str) -> Answer {
        fn check<'a>(
            design: &'a str,
            patterns: &Vec<&str>,
            cache: &mut HashMap<&'a str, usize>,
        ) -> usize {
            if design.is_empty() {
                return 1;
            }

            if cache.contains_key(design) {
                return *cache.get(design).unwrap();
            }

            let mut ways = 0;

            for pattern in patterns {
                if let Some(subpattern) = design.strip_prefix(pattern) {
                    ways += check(subpattern, patterns, cache);
                }
            }

            cache.insert(design, ways);
            ways
        }

        let mut lines = input.lines();
        let patterns = lines.next().unwrap().split(", ").collect::<Vec<&str>>();
        let designs = lines.skip(1).collect::<Vec<&str>>();
        let cache = &mut HashMap::new();

        designs
            .iter()
            .map(|design| check(design, &patterns, cache))
            .sum::<usize>()
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
        let year = *Day19.year();
        let day = *Day19.day();
        let part = common::Part::A;

        let input = load_example(year, day, part);
        let res = Day19.part_a(&input);
        let ans = load_example_solution(year, day, part);
        assert_eq!(res, ans);
    }

    #[test]
    fn part_b() {
        let year = *Day19.year();
        let day = *Day19.day();
        let part = common::Part::B;

        let input = load_example(year, day, part);
        let res = Day19.part_b(&input);
        let ans = load_example_solution(year, day, part);
        assert_eq!(res, ans);
    }
}
