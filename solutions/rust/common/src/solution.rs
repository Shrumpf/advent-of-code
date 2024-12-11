use crate::Answer;

pub trait Solution {
    fn name(&self) -> &'static str;
    fn year(&self) -> &'static u16;
    fn day(&self) -> &'static u32;
    fn part_a(&self, input: &str) -> Answer;
    fn part_b(&self, input: &str) -> Answer;
}
