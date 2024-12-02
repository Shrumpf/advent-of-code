pub use common::Solution;

mod day_01;
mod day_02;
// [import_marker]

pub const ALL: [&dyn Solution; 2] = [
    &day_01::Day01,
    &day_02::Day02,
    // [list_marker]
];
