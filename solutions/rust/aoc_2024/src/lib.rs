pub use common::Solution;

mod day_01;
mod day_02;
mod day_03;
mod day_11;
// [import_marker]

pub const ALL: [&dyn Solution; 4] = [
    &day_01::Day01,
    &day_02::Day02,
    &day_03::Day03,
    &day_11::Day11,
    // [list_marker]
];
