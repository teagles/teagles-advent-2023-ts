import run from "aocrunner";

type Card = {
  number: number;
  winningNumbers: Set<number>;
  playingNumbers: Set<number>;
};

const LineMatcher = /Card\s+(\d+):([^\|]+)\|(.*)$/;
const NumberMatcher = /(\d+)/g;
const parseInput = (rawInput: string) => {
  const cards = new Array<Card>();
  rawInput.split("\n").forEach((line) => {
    const match = line.match(LineMatcher);
    // console.log(match);
    if (match != null) {
      const card: Card = {
        number: Number(match[1]),
        winningNumbers: new Set(
          [...match[2].matchAll(NumberMatcher)].map((n) => Number(n[0])),
        ),
        playingNumbers: new Set(
          [...match[3].matchAll(NumberMatcher)].map((n) => Number(n[0])),
        ),
      };
      // if (card.winningNumbers.size != 10 || card.playingNumbers.size != 25) {
      //   console.log("card: " + card.number);
      //   console.log("winningNumbers: " + card.winningNumbers.size);
      //   console.log("playingNumbers: " + card.playingNumbers.size);
      // }
      cards.push(card);
    }
  });
  return {
    cards: cards,
  };
};

const score = (card: Card) => {
  const winners = [...card.winningNumbers].filter((x) =>
    card.playingNumbers.has(x),
  );
  if (winners.length > 0) {
    return Math.pow(2, winners.length - 1);
  }
  return 0;
};
const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return input.cards.map((c) => score(c)).reduce((acc, e) => acc + e, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
