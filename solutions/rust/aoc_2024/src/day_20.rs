use std::collections::{HashSet, VecDeque};

use common::{Answer, Solution};

pub struct Day20;

impl Solution for Day20 {
    fn name(&self) -> &'static str {
        "Race Condition"
    }

    fn year(&self) -> &'static u16 {
        &2024
    }

    fn day(&self) -> &'static u32 {
        &20
    }

    fn part_a(&self, input: &str) -> Answer {
        let is_test = input.lines().count() == 15;
        let size = input.lines().count();
        let mut solution = 0;

        let directions: [(isize, isize); 4] = [(-1, 0), (0, 1), (1, 0), (0, -1)];

        let grid = input.lines().map(str::as_bytes).collect::<Vec<_>>();

        let mut start = (0, 0);
        let mut end = (0, 0);

        for (y, row) in grid.iter().enumerate() {
            if let Some(x) = row.iter().position(|&cell| cell == b'S') {
                start = (y, x);
            }
            if let Some(x) = row.iter().position(|&cell| cell == b'E') {
                end = (y, x);
            }
        }

        let mut queue: VecDeque<(usize, usize)> = VecDeque::new();
        let mut visited: HashSet<(usize, usize)> = HashSet::new();
        let mut path: Vec<(usize, usize)> = vec![];

        queue.push_front(start);
        visited.insert((0, 0));

        while let Some((y, x)) = queue.pop_front() {
            path.push((y, x));

            if (y, x) == end {
                break;
            }

            visited.insert((y, x));

            for (dy, dx) in directions {
                let ny = (y as isize + dy).try_into().unwrap_or(99);
                let nx = (x as isize + dx).try_into().unwrap_or(99);

                if ny < size && nx < size && !visited.contains(&(ny, nx)) && grid[ny][nx] != b'#' {
                    queue.push_back((ny, nx));
                }
            }
        }

        // println!("{:?}", path);

        for i in 0..path.len() - 1 {
            let (y1, x1) = path.get(i).unwrap();
            for j in i + 1..path.len() {
                let (y2, x2) = path.get(j).unwrap();
                let skips = j - i;

                if y1 == y2 || x1 == x2 {
                    let distance = y1.abs_diff(*y2) + x1.abs_diff(*x2);

                    if is_test && distance <= 2 && skips - distance >= 2 && skips - distance <= 64
                        || distance <= 2 && skips - distance >= 100
                    {
                        solution += 1;
                    }
                }
            }
        }

        solution.into()
    }

    fn part_b(&self, input: &str) -> Answer {
        let is_test = input.lines().count() == 15;
        let size = input.lines().count();
        let mut solution = 0;

        let directions: [(isize, isize); 4] = [(-1, 0), (0, 1), (1, 0), (0, -1)];

        let grid = input.lines().map(str::as_bytes).collect::<Vec<_>>();

        let mut start = (0, 0);
        let mut end = (0, 0);

        for (y, row) in grid.iter().enumerate() {
            if let Some(x) = row.iter().position(|&cell| cell == b'S') {
                start = (y, x);
            }
            if let Some(x) = row.iter().position(|&cell| cell == b'E') {
                end = (y, x);
            }
        }

        let mut queue: VecDeque<(usize, usize)> = VecDeque::new();
        let mut visited: HashSet<(usize, usize)> = HashSet::new();
        let mut path: Vec<(usize, usize)> = vec![];

        queue.push_front(start);
        visited.insert((0, 0));

        while let Some((y, x)) = queue.pop_front() {
            path.push((y, x));

            if (y, x) == end {
                break;
            }

            visited.insert((y, x));

            for (dy, dx) in directions {
                let ny = (y as isize + dy).try_into().unwrap_or(99);
                let nx = (x as isize + dx).try_into().unwrap_or(99);

                if ny < size && nx < size && !visited.contains(&(ny, nx)) && grid[ny][nx] != b'#' {
                    queue.push_back((ny, nx));
                }
            }
        }

        for i in 0..path.len() - 1 {
            let (y1, x1) = path.get(i).unwrap();
            for j in i + 1..path.len() {
                let (y2, x2) = path.get(j).unwrap();
                let skips = j - i;

                let distance = y1.abs_diff(*y2) + x1.abs_diff(*x2);

                if is_test && distance <= 20 && skips - distance >= 50 && skips - distance <= 76
                    || distance <= 20 && skips - distance >= 100
                {
                    solution += 1;
                }
            }
        }

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
        let year = *Day20.year();
        let day = *Day20.day();
        let part = common::Part::A;

        let input = load_example(year, day, part);
        let res = Day20.part_a(&input);
        let ans = load_example_solution(year, day, part);
        assert_eq!(res, ans);
    }

    #[test]
    fn part_b() {
        let year = *Day20.year();
        let day = *Day20.day();
        let part = common::Part::B;

        let input = load_example(year, day, part);
        let res = Day20.part_b(&input);
        let ans = load_example_solution(year, day, part);
        assert_eq!(res, ans);
    }
}
