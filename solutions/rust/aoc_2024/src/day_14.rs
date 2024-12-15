use std::{cmp::Ordering, collections::HashSet};

use common::{Answer, Solution};
use regex::Regex;

pub struct Day14;

#[derive(Debug, Clone, Copy)]
struct Robot {
    x: i32,
    y: i32,
    vx: i32,
    vy: i32,
}

impl Solution for Day14 {
    fn name(&self) -> &'static str {
        "Restroom Redoubt"
    }

    fn year(&self) -> &'static u16 {
        &2024
    }

    fn day(&self) -> &'static u32 {
        &14
    }

    fn part_a(&self, input: &str) -> Answer {
        let height = 103;
        let width = 101;

        let re = Regex::new(r"p=(\d+),(\d+) v=(-?\d+),(-?\d+)").unwrap();

        re.captures_iter(input)
            .map(|c| c.extract())
            .map(|(_, [x, y, vx, vy])| Robot {
                x: x.parse().unwrap(),
                y: y.parse().unwrap(),
                vx: vx.parse().unwrap(),
                vy: vy.parse().unwrap(),
            })
            .map(|mut robot| {
                robot.x = (robot.x + 100 * robot.vx).rem_euclid(width);
                robot.y = (robot.y + 100 * robot.vy).rem_euclid(height);

                match ((robot.y).cmp(&(height / 2)), robot.x.cmp(&(width / 2))) {
                    (Ordering::Less, Ordering::Less) => 1,
                    (Ordering::Less, Ordering::Greater) => 2,
                    (Ordering::Greater, Ordering::Less) => 3,
                    (Ordering::Greater, Ordering::Greater) => 4,
                    _ => 0,
                }
            })
            .fold([0, 0, 0, 0], |mut quad, qn| {
                if qn > 0 {
                    quad[qn - 1] += 1;
                }
                quad
            })
            .into_iter()
            .product::<i32>()
            .into()
    }

    fn part_b(&self, input: &str) -> Answer {
        let mut solution = 0;
        let height = 103;
        let width = 101;

        let re = Regex::new(r"p=(\d+),(\d+) v=(-?\d+),(-?\d+)").unwrap();

        let robots = re
            .captures_iter(input)
            .map(|c| c.extract())
            .map(|(_, [x, y, vx, vy])| Robot {
                x: x.parse().unwrap(),
                y: y.parse().unwrap(),
                vx: vx.parse().unwrap(),
                vy: vy.parse().unwrap(),
            })
            .collect::<Vec<Robot>>();

        'unique: loop {
            let mut hs = HashSet::new();
            for robot in &robots {
                if !hs.insert((
                    (robot.x + solution * robot.vx).rem_euclid(width),
                    (robot.y + solution * robot.vy).rem_euclid(height),
                )) {
                    solution += 1;
                    continue 'unique;
                }
            }

            break;
        }

        solution.into()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use common::load;
    use common::load_example_solution;

    #[test]
    fn part_a() {
        let year = *Day14.year();
        let day = *Day14.day();
        let part = common::Part::A;

        let input = load(year, day).unwrap();
        let res = Day14.part_a(&input);
        let ans = load_example_solution(year, day, part);
        assert_eq!(res, ans);
    }

    #[test]
    fn part_b() {
        let year = *Day14.year();
        let day = *Day14.day();
        let part = common::Part::B;

        let input = load(year, day).unwrap();
        let res = Day14.part_b(&input);
        let ans = load_example_solution(year, day, part);
        assert_eq!(res, ans);
    }
}
