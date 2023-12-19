use std::collections::HashMap;

#[derive(Debug, PartialEq, Eq)]
enum Direction {
    Left,
    Right,
}
impl From<char> for Direction {
    fn from(value: char) -> Self {
        match value {
            'L' => Direction::Left,
            'R' => Direction::Right,
            _ => panic!("Check your input"),
        }
    }
}

#[derive(Debug)]
struct Directions<'a>(&'a str, usize);
impl<'a> From<&'a str> for Directions<'a> {
    fn from(value: &'a str) -> Self {
        Directions(value, 0)
    }
}
impl Iterator for Directions<'_> {
    type Item = Direction;

    fn next(&mut self) -> Option<Self::Item> {
        let curr = self.0.chars().nth(self.1).map(Direction::from);
        if curr.is_none() {
            self.1 = 0;
            return self.next();
        }
        self.1 += 1;
        curr
    }
}

#[derive(Debug)]
struct Nav<'a>(
    HashMap<String, (String, String)>,
    Directions<'a>,
    (String, String),
);

impl<'a> Nav<'a> {
    fn new(lines: HashMap<String, (String, String)>, directions: Directions<'a>) -> Self {
        Nav::<'a>(lines.clone(), directions, lines.get("AAA").unwrap().clone())
    }
}
impl Iterator for Nav<'_> {
    type Item = String;

    fn next(&mut self) -> Option<Self::Item> {
        let next;
        self.2 = match self.1.next().expect("to loop infinitely") {
            Direction::Left => {
                next = Some(self.2 .0.clone());
                self.0.get(&self.2 .0).clone().unwrap().clone()
            }
            Direction::Right => {
                next = Some(self.2 .1.clone());
                self.0.get(&self.2 .1).clone().unwrap().clone()
            }
        };
        next
    }
}

pub fn solve<'a>(input: impl Iterator<Item = &'a str>) -> usize {
    let mut input = input.into_iter();
    let directions: Directions = input.next().expect("Check your input").into();
    input.next();
    let lines: HashMap<String, (String, String)> = input
        .into_iter()
        .map(|str| str.replace(' ', "").replace('(', "").replace(')', ""))
        .map(|str| {
            let (key, value) = str.split_at(3);
            let (left, right) = value[1..].split_at(3);
            (key.to_string(), (left.to_string(), right[1..].to_string()))
        })
        .collect();
    // findallmap -> match char[2] {a=>some chars}
    // foreach a -> run find with start of that one (code below)
    let navigation = Nav::new(lines, directions);
    navigation
        .enumerate()
        .find(|(_, key)| key == "ZZZ")
        .unwrap()
        .0
        + 1
}

#[cfg(test)]
mod test {
    use crate::{solve, Direction, Directions, Nav};

    #[test]
    fn run() {
        let iterator = include_str!("input.validate2").split('\n');
        let solution = solve(iterator);
        assert_eq!(solution, 2);
        let iterator = include_str!("input.validate").split('\n');
        let solution = solve(iterator);
        assert_eq!(solution, 6);
        let iterator = include_str!("input").split('\n');
        let solution = solve(iterator);
        println!("solution: {}", solution)
    }
    #[test]
    fn find() {
        let dir = Directions::from("LRL");
        let input = vec![
            ("AAA".to_string(), ("BBB".to_string(), "CCC".to_string())),
            ("BBB".to_string(), ("AAA".to_string(), "AAA".to_string())),
            ("CCC".to_string(), ("CCC".to_string(), "AAA".to_string())),
        ]
        .into_iter()
        .collect();
        let iter = Nav::new(input, dir);
        let ccc = iter.enumerate().find(|(_, x)| x == "CCC");
        assert!(ccc.is_some());
        assert_eq!(ccc.unwrap(), (4, "CCC".to_string()))
    }
    #[test]
    fn nav() {
        let dir = Directions::from("L");
        let input = vec![
            ("AAA".to_string(), ("BBB".to_string(), "CCC".to_string())),
            ("BBB".to_string(), ("CCC".to_string(), "CCC".to_string())),
            ("CCC".to_string(), ("CCC".to_string(), "CCC".to_string())),
        ]
        .into_iter()
        .collect();
        let mut iter = Nav::new(input, dir);
        assert_eq!(iter.next().unwrap(), "BBB");
        assert_eq!(iter.next().unwrap(), "CCC");
    }
    #[test]
    fn directions() {
        let mut iter = Directions::from("LLRLR");
        assert_eq!(iter.next().unwrap(), Direction::Left);
        assert_eq!(iter.next().unwrap(), Direction::Left);
        assert_eq!(iter.next().unwrap(), Direction::Right);
        assert_eq!(iter.next().unwrap(), Direction::Left);
        assert_eq!(iter.next().unwrap(), Direction::Right);
        assert_eq!(iter.next().unwrap(), Direction::Left);
        assert_eq!(iter.next().unwrap(), Direction::Left);
        assert_eq!(iter.next().unwrap(), Direction::Right);
    }
}
