use std::collections::{BTreeSet, HashMap, HashSet};

use common::{Answer, Solution};

use itertools::Itertools;

pub struct Day23;

impl Solution for Day23 {
    fn name(&self) -> &'static str {
        "LAN Party"
    }

    fn year(&self) -> &'static u16 {
        &2024
    }

    fn day(&self) -> &'static u32 {
        &23
    }

    fn part_a(&self, input: &str) -> Answer {
        let mut graph = HashMap::new();

        for line in input.lines() {
            let (a, b) = line.split_once('-').unwrap();
            graph.entry(a).or_insert_with(HashSet::new).insert(b);
            graph.entry(b).or_insert_with(HashSet::new).insert(a);
        }

        let mut triplets_with_t = HashSet::new();

        for (node, neighbors) in &graph {
            for neighbor in neighbors {
                let others = graph.get(neighbor).unwrap();
                for other in others {
                    if neighbors.contains(other)
                        && (node.starts_with("t")
                            || other.starts_with("t")
                            || neighbor.starts_with("t"))
                    {
                        let mut triplet = vec![node, neighbor, other];
                        triplet.sort();
                        triplets_with_t.insert(triplet);
                    }
                }
            }
        }

        triplets_with_t.len().into()
    }

    fn part_b(&self, input: &str) -> Answer {
        let mut graph = HashMap::new();
        let mut largest_group = BTreeSet::new();

        for line in input.lines() {
            let (a, b) = line.split_once('-').unwrap();
            graph.entry(a).or_insert_with(HashSet::new).insert(b);
            graph.entry(b).or_insert_with(HashSet::new).insert(a);
        }

        for (node, neighbors) in &graph {
            let mut group = BTreeSet::from([node]);
            for neighbor in neighbors {
                if group
                    .iter()
                    .all(|n| graph.get(neighbor).unwrap().contains(*n))
                {
                    group.insert(neighbor);
                }
            }

            if group.len() > largest_group.len() {
                largest_group = group;
            }
        }

        largest_group.iter().join(",").into()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use common::load_example;
    use common::load_example_solution;

    #[test]
    fn part_a() {
        let year = *Day23.year();
        let day = *Day23.day();
        let part = common::Part::A;

        let input = load_example(year, day, part);
        let res = Day23.part_a(&input);
        let ans = load_example_solution(year, day, part);
        assert_eq!(res, ans);
    }

    #[test]
    fn part_b() {
        let year = *Day23.year();
        let day = *Day23.day();
        let part = common::Part::B;

        let input = load_example(year, day, part);
        let res = Day23.part_b(&input);
        let ans = load_example_solution(year, day, part);
        assert_eq!(res, ans);
    }
}
