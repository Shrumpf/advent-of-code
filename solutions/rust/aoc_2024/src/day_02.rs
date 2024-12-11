use common::{Answer, Solution};

pub struct Day02;

fn parse_levels(input: &str) -> Vec<Vec<i32>> {
    input
        .trim()
        .lines()
        .map(|l| l.split(" ").map(|l| l.parse().unwrap()).collect())
        .collect()
}

fn are_sorted(levels: &[i32]) -> bool {
    levels.is_sorted() || levels.iter().rev().is_sorted()
}

fn has_distance(levels: &[i32]) -> bool {
    levels
        .windows(2)
        .all(|l| (l[0] - l[1]).abs() >= 1 && (l[0] - l[1]).abs() <= 3)
}

fn are_safe(levels: &[i32]) -> bool {
    are_sorted(levels) && has_distance(levels)
}

fn try_variants(levels: &[i32]) -> bool {
    let mut temp = levels.to_vec();
    for i in 0..levels.len() {
        temp.remove(i);
        if are_safe(&temp) {
            return true;
        }
        temp.insert(i, *levels.get(i).unwrap());
    }

    false
}

impl Solution for Day02 {
    fn name(&self) -> &'static str {
        "Red-Nosed Reports"
    }

    fn year(&self) -> &'static u16 {
        &2024
    }

    fn day(&self) -> &'static u32 {
        &2
    }

    fn part_a(&self, input: &str) -> Answer {
        parse_levels(input)
            .iter()
            .filter(|l| are_safe(l))
            .count()
            .into()
    }

    fn part_b(&self, input: &str) -> Answer {
        let mut solution = 0;
        solution += parse_levels(input).iter().filter(|l| are_safe(l)).count();

        solution += parse_levels(input)
            .iter()
            .filter(|l| !are_safe(l))
            .filter(|l| try_variants(l))
            .count();

        solution.into()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use common::load_example;
    use common::load_example_solution;

    #[test]
    fn part_a() {
        let year = *Day02.year();
        let day = *Day02.day();
        let part = common::Part::A;

        let input = load_example(year, day, part);
        let res = Day02.part_a(&input);
        let ans = load_example_solution(year, day, part);
        assert_eq!(res, ans);
    }

    #[test]
    fn part_b() {
        let year = *Day02.year();
        let day = *Day02.day();
        let part = common::Part::B;

        let input = load_example(year, day, part);
        let res = Day02.part_b(&input);
        let ans = load_example_solution(year, day, part);
        assert_eq!(res, ans);
    }
}
