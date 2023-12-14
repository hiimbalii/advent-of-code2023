use std::{cmp::Ordering, collections::HashMap};

#[derive(PartialEq, Eq, Ord, Debug, Hash, Clone, Copy)]
enum Card {
    Two,
    Three,
    Four,
    Five,
    Six,
    Seven,
    Eight,
    Nine,
    T,
    Jumbo,
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
impl From<&Card> for usize {
    fn from(value: &Card) -> Self {
        match value {
            Card::Two => 2,
            Card::Three => 3,
            Card::Four => 4,
            Card::Five => 5,
            Card::Six => 6,
            Card::Seven => 7,
            Card::Eight => 8,
            Card::Nine => 9,
            Card::T => 10,
            Card::Jumbo => 10,
            Card::Queen => 11,
            Card::King => 12,
            Card::Ace => 13,
        }
    }
}
impl From<char> for Card {
    fn from(value: char) -> Self {
        match value {
            '2' => Card::Two,
            '3' => Card::Three,
            '4' => Card::Four,
            '5' => Card::Five,
            '6' => Card::Six,
            '7' => Card::Seven,
            '8' => Card::Eight,
            '9' => Card::Nine,
            'T' => Card::T,
            'J' => Card::Jumbo,
            'Q' => Card::Queen,
            'K' => Card::King,
            'A' => Card::Ace,
            c => panic!("Unexpected character: {}. Check your input", c),
        }
    }
}
#[derive(Debug, PartialEq, Eq)]
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
        for card in cards {
            if cards_map.contains_key(&card) {
                let card = cards_map.get_mut(&card).unwrap();
                *card += 1;
            } else {
                cards_map.insert(card, 1);
            }
        }
        let mut cards_map: Vec<(Card, usize)> = cards_map.into_iter().collect();
        cards_map.sort_by(|a, b| b.1.cmp(&a.1));
        return match (cards_map.len(), cards_map.first().unwrap()) {
            (1, (card, 5)) => Hand::FiveOfAKind(cards),
            (2, (card, 3)) => Hand::FullHouse(cards),
            (2, (card, 4)) => Hand::FourOfAKind(cards),
            (3, (card, 3)) => {
                if cards_map[2].0 > cards_map[1].0 {
                    return Hand::ThreeOfAKind(cards);
                }
                Hand::ThreeOfAKind(cards)
            }
            (3, (card, 2)) => {
                if card.to_owned() > cards_map[1].0 {
                    return Hand::TwoPairs(cards);
                }
                Hand::TwoPairs(cards)
            }
            (4, (card, 2)) => Hand::OnePair(cards),
            (5, _) => Hand::HighHand(cards),
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
            return self.get_hand().into_iter().enumerate().map(|x|x.cmp(other));
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
        let hand = &value[0..5];
        let winnings = &value[6..];
        Line(hand.into(), winnings.to_string().parse::<usize>().unwrap())
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
    dbg!(&lines);
    lines.into_iter().sum()
}

#[cfg(test)]
mod test {
    use crate::{solve, Card, Hand};

    #[test]
    fn run() {
        let iterator = include_str!("input.validate").split('\n');
        let solution = solve(iterator);
        assert_eq!(solution, 6440);
        let iterator = include_str!("input").split('\n');
        let solution = solve(iterator);
        println!("solution: {}", solution)
    }

    #[test]
    fn parse_hands() {
        assert_eq!(Hand::from("23456"), Hand::HighHand);
        //Five of a kind, where all five cards have the same label:
        assert_eq!(Hand::from("AAAAA"), Hand::FiveOfAKind(Card::Ace));
        //Four of a kind, where four cards have the same label and one card has a different label:
        assert_eq!(
            Hand::from("AA8AA"),
            Hand::FourOfAKind(Card::Ace, Card::Eight)
        );
        //Full house, where three cards have the same label, and the remaining two cards share a different label:
        assert_eq!(Hand::from("32323"), Hand::FullHouse(Card::Three, Card::Two));
        //Three of a kind, where three cards have the same label, and the remaining two cards are each different from any other card in the hand:
        assert_eq!(
            Hand::from("T9T8T"),
            Hand::ThreeOfAKind(Card::T, Card::Nine, Card::Eight)
        );
        //Two pair, where two cards share one label, two other cards share a second label, and the remaining card has a third label:
        assert_eq!(Hand::from("33242"), Hand::TwoPairs(Card::Three, Card::Two));
        //One pair, where two cards share one label, and the other three cards have a different label from the pair and each other:
        assert_eq!(Hand::from("A234A"), Hand::OnePair(Card::Ace));

        //High card, where all cards' labels are distinct:
    }
}
