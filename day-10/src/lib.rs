pub fn solve<'a>(input: impl Iterator<Item = &'a str>) -> usize {
1}

#[cfg(test)]
mod test {
    use crate::solve;

    #[test]
    fn run() {
        let iterator = include_str!("input.validate").split('\n');
        let solution = solve(iterator);
        assert_eq!(solution, 6);
        let iterator = include_str!("input").split('\n');
        let solution = solve(iterator);
        println!("solution: {}", solution)
    }
}
