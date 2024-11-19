use std::{fmt::Display, str::FromStr};

#[derive(Debug, Clone, Copy)]
pub enum Part {
    A,
    B,
}

impl FromStr for Part {
    type Err = String;

    fn from_str(s: &str) -> Result<Part, Self::Err> {
        match s {
            "a" => Ok(Part::A),
            "b" => Ok(Part::B),
            _ => Err("part must be `a` or `b`".to_owned()),
        }
    }
}

impl Display for Part {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Part::A => write!(f, "a"),
            Part::B => write!(f, "b"),
        }
    }
}
