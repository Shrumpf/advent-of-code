use std::collections::{HashSet, VecDeque};

use common::{Answer, Solution};
use itertools::Itertools;

pub struct Day18;

impl Solution for Day18 {
    fn name(&self) -> &'static str {
        "RAM Run"
    }

    fn year(&self) -> &'static u16 {
        &2024
    }

    fn day(&self) -> &'static u32 {
        &18
    }

    fn part_a(&self, input: &str) -> Answer {
        let is_test = input.lines().count() == 25;
        let take = if is_test { 12 } else { 1024 };

        let obstacles = input
            .lines()
            .map(|l| {
                l.split(',')
                    .map(|n| n.parse().unwrap())
                    .collect_tuple()
                    .unwrap()
            })
            .take(take)
            .collect::<Vec<(usize, usize)>>();

        let directions: [(isize, isize); 4] = [(-1, 0), (0, 1), (1, 0), (0, -1)];

        let size = if is_test { 7 } else { 71 };

        let mut visited: HashSet<(usize, usize)> = HashSet::new();
        let mut queue: VecDeque<(usize, usize, usize)> = VecDeque::new();

        queue.push_front((0, 0, 0));
        visited.insert((0, 0));

        while !queue.is_empty() {
            let (y, x, cost) = queue.pop_front().unwrap();

            if x == size - 1 && y == size - 1 {
                return cost.into();
            }

            for (dy, dx) in directions {
                let nx = (x as isize + dx).try_into().unwrap_or(99);
                let ny = (y as isize + dy).try_into().unwrap_or(99);

                if ny < size
                    && nx < size
                    && !visited.contains(&(ny, nx))
                    && !obstacles.iter().any(|o| o == &(nx, ny))
                {
                    visited.insert((ny, nx));
                    queue.push_back((ny, nx, cost + 1));
                }
            }
        }

        "unsolved".into()
    }

    fn part_b(&self, input: &str) -> Answer {
        let is_test = input.lines().count() == 25;
        let size = if is_test { 7 } else { 71 };

        fn bfs(obstacles: Vec<&(usize, usize)>, size: usize) -> Option<usize> {
            let directions: [(isize, isize); 4] = [(-1, 0), (0, 1), (1, 0), (0, -1)];

            let mut visited: HashSet<(usize, usize)> = HashSet::new();
            let mut queue: VecDeque<(usize, usize, usize)> = VecDeque::new();

            queue.push_front((0, 0, 0));
            visited.insert((0, 0));

            while !queue.is_empty() {
                let (y, x, cost) = queue.pop_front().unwrap();

                if x == size - 1 && y == size - 1 {
                    return cost.into();
                }

                for (dy, dx) in directions {
                    let nx = (x as isize + dx).try_into().unwrap_or(99);
                    let ny = (y as isize + dy).try_into().unwrap_or(99);

                    if ny < size
                        && nx < size
                        && !visited.contains(&(ny, nx))
                        && !obstacles.iter().any(|o| *o == &(nx, ny))
                    {
                        visited.insert((ny, nx));
                        queue.push_back((ny, nx, cost + 1));
                    }
                }
            }

            None
        }

        let obstacles = input
            .lines()
            .map(|l| {
                l.split(',')
                    .map(|n| n.parse().unwrap())
                    .collect_tuple()
                    .unwrap()
            })
            .collect::<Vec<(usize, usize)>>();

        let mut left = if is_test { 12 } else { 1024 };
        let mut right = obstacles.len();

        let mut solution = 0;

        while left <= right {
            let mid = (left + right) / 2;
            let o = obstacles.iter().take(mid).collect_vec();
            if bfs(o, size).is_some() {
                solution = mid;
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        format!("{},{}", obstacles[solution].0, obstacles[solution].1)
            .to_string()
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
        let year = *Day18.year();
        let day = *Day18.day();
        let part = common::Part::A;

        let input = load_example(year, day, part);
        let res = Day18.part_a(&input);
        let ans = load_example_solution(year, day, part);
        assert_eq!(res, ans);
    }

    #[test]
    fn part_b() {
        let year = *Day18.year();
        let day = *Day18.day();
        let part = common::Part::B;

        let input = load_example(year, day, part);
        let res = Day18.part_b(&input);
        let ans = load_example_solution(year, day, part);
        assert_eq!(res, ans);
    }
}
