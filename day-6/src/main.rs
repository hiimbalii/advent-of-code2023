use std::{
    io::{self, BufRead},
    ops::Index,
};

fn parse_lines(time: &str, distance: &str) -> Vec<(usize, usize)> {
    let time = time.split_once(':').map(|part| part.1).unwrap();
    let times = time
        .split_whitespace()
        .map(|time| time.parse::<usize>().unwrap());
    let distance = distance.split_once(':').map(|part| part.1).unwrap();
    let distances: Vec<usize> = distance
        .split_whitespace()
        .map(|time| time.parse::<usize>().unwrap())
        .collect();
    times
        .enumerate()
        .map(|(idx, time)| (time, distances.index(idx).to_owned()))
        .collect()
}
fn main() {
    let mut iterator = include_str!("input.validate").split('\n');
    let line1 = iterator.next().unwrap();
    let line2 = iterator.next().unwrap();
    let input = parse_lines(line1, line2);

    let solutions_for_inputs: usize = input.into_iter().map(|x| find_number_of_ways(x)).product();
    assert_eq!(solutions_for_inputs, 288);
    let mut iterator = include_str!("input").split('\n');
    let line1 = iterator.next().unwrap();
    let line2 = iterator.next().unwrap();
    let input = parse_lines(line1, line2);

    let solutions_for_inputs: usize = input.into_iter().map(|x| find_number_of_ways(x)).product();
    print!("Solution:\t{}", solutions_for_inputs)
}

fn calc_dist(total_time: usize, rewind_time: usize) -> usize {
    (total_time - rewind_time) * rewind_time
}
fn find_number_of_ways((time, max_dist): (usize, usize)) -> usize {
    let mut ways = 0;
    for distance in (0..time).into_iter().map(|i| calc_dist(time, i)) {
        if distance > max_dist {
            ways += 1
        }
    }
    ways
}

#[cfg(test)]
mod test {
    use crate::{calc_dist, find_number_of_ways, parse_lines};

    #[test]
    fn should_parse_lines() {
        let result = parse_lines(
            "Time:        40     70     98     79".into(),
            "Distance:   215   1051   2147   1005".into(),
        );
        let expected = vec![(40, 215), (70, 1051), (98, 2147), (79, 1005)];
        assert_eq!(result, expected)
    }
    #[test]
    fn should_calc_dist() {
        assert_eq!(calc_dist(7, 0), 0);
        assert_eq!(calc_dist(7, 1), 6);
        assert_eq!(calc_dist(7, 2), 10);
        assert_eq!(calc_dist(7, 3), 12);
        assert_eq!(calc_dist(7, 4), 12);
        assert_eq!(calc_dist(7, 5), 10);
        assert_eq!(calc_dist(7, 6), 6);
        assert_eq!(calc_dist(7, 7), 0);
    }

    #[test]
    fn should_find_number_of_ways() {
        assert_eq!(find_number_of_ways((7, 9)), 4)
    }
}
