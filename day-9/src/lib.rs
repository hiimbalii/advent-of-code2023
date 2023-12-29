trait SeqFinder {
    fn find_next_in_seq(self, last: i32) -> i32;
    fn next_sequence(self) -> Self;
}
impl SeqFinder for Vec<i32> {
    fn next_sequence(mut self) -> Self {
        let mut iter = self.clone();
        iter.truncate(self.len() - 1);
        iter.shrink_to_fit();
        let iter = iter.into_iter();
        iter.enumerate()
            .map(|(idx, _)| self[idx + 1] - self[idx])
            .collect()
    }
    fn find_next_in_seq(self, last: i32) -> i32 {
        self[self.len() - 1] + last
    }
}

struct Line(Vec<i32>);
impl Line {
    fn find_next(self) -> i32 {
        let mut stack: Vec<Vec<i32>> = vec![self.0.clone()];
        while !stack.last().unwrap().into_iter().all(|v| *v == 0) {
            stack.push(stack.last().unwrap().clone().next_sequence())
        }
        //walk stack
        // last = find_next(last)
        let mut result = 0;
        for i in stack {
            result = i.find_next_in_seq(result);
        }
        result
    }
}
impl From<&str> for Line {
    fn from(value: &str) -> Self {
        Line(
            value
                .split(' ')
                .map(str::parse::<i32>)
                .map(Result::unwrap)
                .collect(),
        )
    }
}

pub fn solve<'a>(input: impl Iterator<Item = &'a str>) -> i32 {
    let lines = input.into_iter().map(Line::from).map(Line::find_next);

    lines.sum()
}

#[cfg(test)]
mod test {
    use crate::{solve, Line, SeqFinder};

    #[test]
    fn run() {
        let iterator = include_str!("input.validate").split('\n');
        let solution = solve(iterator);
        assert_eq!(solution, 114);
        let iterator = include_str!("input").split('\n');
        let solution = solve(iterator);
        println!("solution: {}", solution)
    }

    #[test]
    fn parse() {
        assert_eq!(Line::from("0 -3 6 12").0, vec![0, -3, 6, 12]);
    }
    #[test]
    fn next_seq() {
        assert_eq!(
            Line::from("0 3 6 9 12 15").0.next_sequence(),
            vec![3, 3, 3, 3, 3]
        );
    }
    #[test]
    fn find_next() {
        assert_eq!(Line::from("0 3 6 9 12 15").find_next(), 18);
        assert_eq!(Line::from("1 3 6 10 15 21").find_next(), 28);
        assert_eq!(Line::from("10 13 16 21 30 45").find_next(), 68);
    }
}
