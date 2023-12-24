import run from "aocrunner";

enum Card {
  A = 14,
  K = 13,
  Q = 12,
  J = 11,
  T = 10,
  Nine = 9,
  Eight = 8,
  Seven = 7,
  Six = 6,
  Five = 5,
  Four = 4,
  Three = 3,
  Two = 2,
}

type CardStrings = keyof typeof Card;

const compareFn = (a: Hand, b: Hand) => {
  var result = 0;
  if (a.type > b.type) {
    return -1;
  } else if (a.type < b.type) {
    return 1;
  } else {
    a.cards.some((c, i) => {
      if (c < b.cards[i]) {
        result = -1;
        return true;
      } else if (c > b.cards[i]) {
        result = 1;
        return true;
      }
    });
    // a.cards.forEach((c, i) => {
    //   console.log("a:" + c + " b:" + b.cards[i]);
    //   if (c < b.cards[i]) {
    //     return -1;
    //   } else if (c > b.cards[i]) {
    //     return 1;
    //   }
    // });
  }
  return result;
};

enum HandType {
  FiveOfAKind = 0,
  FourOfAKind = 1,
  FullHouse = 2,
  ThreeOfAKind = 3,
  TwoPair = 4,
  OnePair = 5,
  HighCard = 6,
}

const typeFor = (cards: Card[]) => {
  const cardCounts = new Map();
  cards.forEach((card) => {
    cardCounts.set(card, cardCounts.get(card) ? cardCounts.get(card) + 1 : 1);
  });
  // console.log(cardCounts);
  const countCounts = new Map();
  cardCounts.forEach((v) => {
    countCounts.set(v, countCounts.get(v) ? countCounts.get(v) + 1 : 1);
  });
  // console.log(countCounts);
  if (countCounts.get(5)) {
    return HandType.FiveOfAKind;
  } else if (countCounts.get(4)) {
    return HandType.FourOfAKind;
  } else if (countCounts.get(3)) {
    if (countCounts.get(2)) {
      return HandType.FullHouse;
    } else {
      return HandType.ThreeOfAKind;
    }
  } else if (countCounts.get(2)) {
    if (countCounts.get(2) == 2) {
      return HandType.TwoPair;
    } else {
      return HandType.OnePair;
    }
  } else {
    return HandType.HighCard;
  }
};

class Hand {
  cards: Card[];
  bid: number;
  type: HandType;
  constructor(cards: Card[], bid: number) {
    this.cards = cards;
    this.bid = bid;
    this.type = typeFor(cards);
  }
}

const handMatcher = /([AKQJT98765432]{5})\s+(\d+)/;
const decard = (cards: string) => {
  return [...cards].map((c) => {
    var charNumber = Number(c);
    if (!Number.isNaN(charNumber)) {
      return Card[Card[charNumber] as CardStrings];
    } else {
      return Card[c as CardStrings];
    }
  });
};
const parseInput = (rawInput: string) => {
  return rawInput.split("\n").map((line) => {
    // console.log(line.match(handMatcher));
    const matches = line.match(handMatcher);
    return new Hand(decard(matches![1]), Number(matches![2]));
  });
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  // console.log(input);
  input.sort(compareFn);
  // console.log(input);
  return input.reduce((p, c, i) => p + c.bid * (i + 1), 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

const TEST_DATA = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;
run({
  part1: {
    tests: [
      {
        input: TEST_DATA,
        expected: 6440,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: TEST_DATA,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
