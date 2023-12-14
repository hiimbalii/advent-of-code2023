use std::{
    cmp::Ordering,
    collections::HashMap,
    ops::{Index, IndexMut},
};

#[derive(PartialEq, Eq, Ord, Debug, Hash, Clone, Copy)]
enum Card {
    Joker,
    Two,
    Three,
    Four,
    Five,
    Six,
    Seven,
    Eight,
    Nine,
    Ten,
    Queen,
    King,
    Ace,
}
impl PartialOrd for Card {
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        self.partial_cmp(&usize::from(other))
    }
}
impl PartialEq<usize> for Card {
    fn eq(&self, other: &usize) -> bool {
        usize::from(self) == *other
    }
}
impl PartialOrd<usize> for Card {
    fn partial_cmp(&self, other: &usize) -> Option<std::cmp::Ordering> {
        Some(usize::from(self).cmp(other))
    }
}
impl From<char> for Card {
    fn from(value: char) -> Self {
        match value {
            'J' => Card::Joker,
            '2' => Card::Two,
            '3' => Card::Three,
            '4' => Card::Four,
            '5' => Card::Five,
            '6' => Card::Six,
            '7' => Card::Seven,
            '8' => Card::Eight,
            '9' => Card::Nine,
            'T' => Card::Ten,
            'Q' => Card::Queen,
            'K' => Card::King,
            'A' => Card::Ace,
            c => panic!("Unexpected character: {}. Check your input", c),
        }
    }
}
impl From<&Card> for usize {
    fn from(value: &Card) -> Self {
        match value {
            Card::Joker => 1,
            Card::Two => 2,
            Card::Three => 3,
            Card::Four => 4,
            Card::Five => 5,
            Card::Six => 6,
            Card::Seven => 7,
            Card::Eight => 8,
            Card::Nine => 9,
            Card::Ten => 10,
            Card::Queen => 11,
            Card::King => 12,
            Card::Ace => 13,
        }
    }
}

#[derive(Debug, PartialEq, Eq)]
//Probably not the best way but im not refactoring
enum Hand {
    FiveOfAKind(Vec<Card>),
    FourOfAKind(Vec<Card>),
    FullHouse(Vec<Card>),
    ThreeOfAKind(Vec<Card>),
    TwoPairs(Vec<Card>),
    OnePair(Vec<Card>),
    HighHand(Vec<Card>),
}

impl Hand {
    // This is why not lol
    fn get_hand(&self) -> Vec<Card> {
        match self {
            Hand::FiveOfAKind(c) => c.clone(),
            Hand::FourOfAKind(c) => c.clone(),
            Hand::FullHouse(c) => c.clone(),
            Hand::ThreeOfAKind(c) => c.clone(),
            Hand::TwoPairs(c) => c.clone(),
            Hand::OnePair(c) => c.clone(),
            Hand::HighHand(c) => c.clone(),
        }
    }
}

impl From<&str> for Hand {
    fn from(value: &str) -> Self {
        let cards: Vec<Card> = value.chars().map(Card::from).collect();
        let mut cards_map: HashMap<Card, usize> = HashMap::new();
        for card in &cards {
            if cards_map.contains_key(&card) {
                let card = cards_map.get_mut(&card).unwrap();
                *card += 1;
            } else {
                cards_map.insert(card.clone(), 1);
            }
        }
        let mut cards_map: Vec<(Card, usize)> = cards_map.into_iter().collect();
        let mut offset = 0;
        let mut joker_map = cards_map
            .clone()
            .into_iter()
            .enumerate()
            .map(|(idx, (card, nr))| match card {
                Card::Joker => Some((idx, nr)),
                _ => None,
            });

        if joker_map.clone().any(|o| o.is_none()) {
            if let Some(Some((idx, number))) = joker_map.find(|o| o.is_some()) {
                offset = number;
                cards_map.remove(idx);
            }
        }
        cards_map.sort_by(|a, b| b.1.cmp(&a.1));
        return match (cards_map.len(), cards_map.first().unwrap().1 + offset) {
            (1, 5) => Hand::FiveOfAKind(cards),
            (2, 3) => Hand::FullHouse(cards),
            (2, 4) => Hand::FourOfAKind(cards),
            (3, 2) => Hand::TwoPairs(cards),
            (3, 3) => Hand::ThreeOfAKind(cards),
            (4, 2) => Hand::OnePair(cards),
            (5, 1) => Hand::HighHand(cards),
            _ => panic!(),
        };
    }
}
impl From<&Hand> for usize {
    fn from(value: &Hand) -> Self {
        match value {
            Hand::FiveOfAKind(_) => 7,
            Hand::FourOfAKind(_) => 6,
            Hand::FullHouse(_) => 5,
            Hand::ThreeOfAKind(_) => 4,
            Hand::TwoPairs(_) => 3,
            Hand::OnePair(_) => 2,
            Hand::HighHand(_) => 1,
        }
    }
}

impl PartialOrd for Hand {
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        let result = usize::from(self).cmp(&usize::from(other));
        if let Ordering::Equal = result {
            return self
                .get_hand()
                .into_iter()
                .zip(other.get_hand())
                .map(|(left, right)| left.cmp(&right))
                .find(|x| x.ne(&Ordering::Equal));
        } else {
            return Some(result);
        };
    }
}
impl Ord for Hand {
    fn cmp(&self, other: &Self) -> Ordering {
        self.partial_cmp(other).unwrap()
    }
}
#[derive(Debug)]
struct Line(Hand, usize);
impl From<&str> for Line {
    fn from(value: &str) -> Self {
        let hand = dbg!(&value[0..5]);
        let winnings = &value[6..];
        Line(dbg!(hand.into()), winnings.parse::<usize>().unwrap())
    }
}

pub fn solve<'a>(input: impl Iterator<Item = &'a str>) -> usize {
    let mut lines: Vec<Line> = input.map(Line::from).collect();

    lines.sort_by(|a, b| a.0.cmp(&b.0));
    let lines: Vec<usize> = lines
        .into_iter()
        .enumerate()
        .map(|(rank, line)| (rank + 1) * line.1)
        .collect();
    lines.into_iter().sum()
}

#[cfg(test)]
mod test {
    use crate::{solve, Card, Hand};

    #[test]
    fn run() {
        let iterator = include_str!("input.validate").split('\n');
        let solution = solve(iterator);
        assert_eq!(solution, 5905);
        let iterator = include_str!("input").split('\n');
        let solution = solve(iterator);
        println!("solution: {}", solution)
    }

    #[test]
    fn parse_hands() {
        assert_eq!(
            Hand::from("23456"),
            Hand::HighHand(vec![
                Card::Two,
                Card::Three,
                Card::Four,
                Card::Five,
                Card::Six
            ])
        );
        //Five of a kind, where all five cards have the same label:
        assert_eq!(
            Hand::from("AAAAA"),
            Hand::FiveOfAKind(vec![Card::Ace, Card::Ace, Card::Ace, Card::Ace, Card::Ace])
        );
        //Four of a kind, where four cards have the same label and one card has a different label:
        assert_eq!(
            Hand::from("AA8AA"),
            Hand::FourOfAKind(vec![
                Card::Ace,
                Card::Ace,
                Card::Eight,
                Card::Ace,
                Card::Ace
            ])
        );
        //Full house, where three cards have the same label, and the remaining two cards share a different label:
        assert_eq!(
            Hand::from("32323"),
            Hand::FullHouse(vec![
                Card::Three,
                Card::Two,
                Card::Three,
                Card::Two,
                Card::Three
            ])
        );
        //Three of a kind, where three cards have the same label, and the remaining two cards are each different from any other card in the hand:
        assert_eq!(
            Hand::from("T9T8T"),
            Hand::ThreeOfAKind(vec![
                Card::Ten,
                Card::Nine,
                Card::Ten,
                Card::Eight,
                Card::Ten
            ])
        );
        //Two pair, where two cards share one label, two other cards share a second label, and the remaining card has a third label:
        assert_eq!(
            Hand::from("33242"),
            Hand::TwoPairs(vec![
                Card::Three,
                Card::Three,
                Card::Two,
                Card::Four,
                Card::Two
            ])
        );
        //One pair, where two cards share one label, and the other three cards have a different label from the pair and each other:
        assert_eq!(
            Hand::from("A234A"),
            Hand::OnePair(vec![
                Card::Ace,
                Card::Two,
                Card::Three,
                Card::Four,
                Card::Ace
            ])
        );

        //High card, where all cards' labels are distinct:
    }
    #[test]
    fn joker() {
        let hand = Hand::from("32T3J");
        assert_eq!(
            hand,
            Hand::ThreeOfAKind(vec![
                Card::Three,
                Card::Two,
                Card::Ten,
                Card::Three,
                Card::Joker
            ])
        )
    }
}
