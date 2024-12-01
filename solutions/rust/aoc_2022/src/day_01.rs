use common::{Answer, Solution};

pub struct Day01;

impl Solution for Day01 {
    fn name(&self) -> &'static str {
        "Sonar Sweep"
    }

    fn year(&self) -> &'static u16 {
        &2022
    }

    fn day(&self) -> &'static u32 {
        &1
    }

    fn part_a(&self, input: &str) -> Answer {
        input
            .split("\n\n")
            .map(|f| {
                f.split('\n')
                    .map(|c| c.parse::<u32>().unwrap())
                    .collect::<Vec<u32>>()
            })
            .map(|s| s.iter().sum())
            .collect::<Vec<u32>>()
            .iter()
            .max()
            .unwrap()
            .to_string()
            .into()
    }

    fn part_b(&self, input: &str) -> Answer {
        let mut numbers: Vec<u32> = input
            .split("\n\n")
            .map(|f| {
                f.split('\n')
                    .map(|c| c.parse::<u32>().unwrap())
                    .collect::<Vec<u32>>()
            })
            .map(|s| s.iter().sum())
            .collect::<Vec<u32>>();
        numbers.sort();
        numbers.reverse();
        let max = [numbers[0], numbers[1], numbers[2]].iter().sum::<u32>();

        max.into()
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
