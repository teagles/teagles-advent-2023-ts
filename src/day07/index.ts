import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
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
  onlyTests: false,
});
