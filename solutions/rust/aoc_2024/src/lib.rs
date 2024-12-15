pub use common::Solution;

mod day_01;
mod day_02;
mod day_03;
mod day_11;
mod day_14;
// [import_marker]

pub const ALL: [&dyn Solution; 5] = [
    &day_01::Day01,
    &day_02::Day02,
    &day_03::Day03,
    &day_11::Day11,
    &day_14::Day14,
    // [list_marker]
];
