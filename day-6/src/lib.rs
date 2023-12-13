#[derive(Debug, PartialEq, Eq)]
struct Pair(usize, usize);
impl Pair {
    fn find_area_over_curve(&self, cutoff: Distance) -> usize {
        let time = self.0;
        let middle = time / 2;
        let half_block: usize = middle - cutoff.index + 1;
        if time % 2 == 0 {
            half_block * 2 - 1
        } else {
            half_block * 2
        }
    }
}
impl From<(usize, usize)> for Pair {
    fn from(value: (usize, usize)) -> Self {
        Pair(value.0, value.1)
    }
}

#[derive(Debug, PartialEq, Eq, PartialOrd, Ord)]
struct Distance {
    index: usize,
    distance: usize,
}
impl From<&DistanceIterator> for Distance {
    fn from(value: &DistanceIterator) -> Self {
        Distance {
            index: value.curr,
            distance: value.current_distance(),
        }
    }
}
impl PartialEq<usize> for Distance {
    fn eq(&self, other: &usize) -> bool {
        self.distance == *other
    }
}
impl PartialOrd<usize> for Distance {
    fn partial_cmp(&self, other: &usize) -> Option<std::cmp::Ordering> {
        Some(self.distance.cmp(other))
    }
}

#[derive(Debug, PartialEq, Eq, PartialOrd, Ord)]
struct DistanceIterator {
    max: usize,
    curr: usize,
}
impl DistanceIterator {
    pub fn new(to: usize) -> Self {
        DistanceIterator { curr: 0, max: to }
    }
    fn current_distance(&self) -> usize {
        (self.max - self.curr) * self.curr
    }
}
impl Iterator for DistanceIterator {
    type Item = Distance;

    fn next(&mut self) -> Option<Self::Item> {
        let curr: Distance = (&*self).into();
        self.curr += 1;
        Some(curr)
    }
}

pub fn solve<'a>(times: &'a str, max_distances: &'a str) -> usize {
    let input = parse_lines(times, max_distances);
    input.map(find_number_of_ways).product()
}

fn find_number_of_ways(pair: Pair) -> usize {
    let (time, max_dist) = (pair.0, pair.1);
    let first_larger_distance: Distance = DistanceIterator::new(time)
        .find(|dist| dist >= &max_dist)
        .expect("to be able top break the record at least once")
        .into();

    pair.find_area_over_curve(first_larger_distance)
}

fn parse_lines<'a>(times: &'a str, max_distances: &'a str) -> impl Iterator<Item = Pair> + 'a {
    let times = chop_line(times);
    let max_distances = chop_line(max_distances);
    let pairs = times.zip(max_distances);
    pairs.map(Pair::from)
}
fn chop_line(line: &str) -> impl Iterator<Item = usize> + '_ {
    let times = line.split_once(':').map(|part| part.1).unwrap();
    times
        .split_whitespace()
        .map(|time| time.parse::<usize>().unwrap())
}

#[cfg(test)]
mod test {
    use std::sync::Arc;

    use crate::{find_number_of_ways, parse_lines, solve, DistanceIterator, Pair};

    #[test]
    fn should_parse_lines() {
        let result: Arc<[Pair]> = parse_lines(
            "Time:        40     70     98     79",
            "Distance:   215   1051   2147   1005",
        )
        .collect();
        let expected: Arc<[Pair]> = vec![(40, 215), (70, 1051), (98, 2147), (79, 1005)]
            .into_iter()
            .map(Pair::from)
            .collect();
        assert_eq!(result, expected)
    }
    #[test]
    fn should_calc_dist() {
        assert_eq!(DistanceIterator { max: 7, curr: 0 }.current_distance(), 0);
        assert_eq!(DistanceIterator { max: 7, curr: 1 }.current_distance(), 6);
        assert_eq!(DistanceIterator { max: 7, curr: 2 }.current_distance(), 10);
        assert_eq!(DistanceIterator { max: 7, curr: 3 }.current_distance(), 12);
        assert_eq!(DistanceIterator { max: 7, curr: 4 }.current_distance(), 12);
        assert_eq!(DistanceIterator { max: 7, curr: 5 }.current_distance(), 10);
        assert_eq!(DistanceIterator { max: 7, curr: 6 }.current_distance(), 6);
        assert_eq!(DistanceIterator { max: 7, curr: 7 }.current_distance(), 0);
    }

    #[test]
    fn should_calc_dist2() {
        assert_eq!(DistanceIterator { max: 8, curr: 0 }.current_distance(), 0);
        assert_eq!(DistanceIterator { max: 8, curr: 1 }.current_distance(), 7);
        assert_eq!(DistanceIterator { max: 8, curr: 2 }.current_distance(), 12);
        assert_eq!(DistanceIterator { max: 8, curr: 3 }.current_distance(), 15);
        assert_eq!(DistanceIterator { max: 8, curr: 4 }.current_distance(), 16);
        assert_eq!(DistanceIterator { max: 8, curr: 5 }.current_distance(), 15);
        assert_eq!(DistanceIterator { max: 8, curr: 6 }.current_distance(), 12);
        assert_eq!(DistanceIterator { max: 8, curr: 7 }.current_distance(), 7);
        assert_eq!(DistanceIterator { max: 8, curr: 8 }.current_distance(), 0);
    }

    #[test]
    fn should_find_number_of_ways() {
        assert_eq!(find_number_of_ways((7, 9).into()), 4)
    }

    #[test]
    fn run() {
        let mut iterator = include_str!("input.validate").split('\n');
        let line1 = iterator.next().unwrap();
        let line2 = iterator.next().unwrap();
        let solution = solve(line1, line2);
        assert_eq!(solution, 71503);
        let mut iterator = include_str!("input").split('\n');
        let line1 = iterator.next().unwrap();
        let line2 = iterator.next().unwrap();
        let solution = solve(line1, line2);
        println!("solution: {}", solution)
    }
}
