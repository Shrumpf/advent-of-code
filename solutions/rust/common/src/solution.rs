use crate::Answer;

pub trait Solution {
    fn name(&self) -> &'static str;
    fn year(&self) -> &'static u16;
    fn day(&self) -> &'static u32;
    fn part_a(&self, input: &str) -> Answer;
    fn part_b(&self, input: &str) -> Answer;

    fn is_dummy(&self) -> bool {
        false
    }
}

pub struct DummySolution;

impl Solution for DummySolution {
    fn name(&self) -> &'static str {
        unreachable!()
    }

    fn part_a(&self, _input: &str) -> Answer {
        unreachable!()
    }

    fn part_b(&self, _input: &str) -> Answer {
        unreachable!()
    }

    fn is_dummy(&self) -> bool {
        true
    }
    
    fn year(&self) -> &'static u16 {
        unreachable!()
    }
    
    fn day(&self) -> &'static u32 {
        unreachable!()
    }
}
