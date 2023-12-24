import run from "aocrunner";

const InputParser =
  /Time:(?<times>(\s+\d+)+)\nDistance:(?<distances>(\s+\d+)+)/g;
const NumberParser = /\d+/g;

const parseNumbers = (unParsedNumbers: string) => {
  return [...unParsedNumbers.matchAll(NumberParser)].map((t) => Number(t[0]));
};

type Race = {
  time: number;
  distance: number;
};

const parseInput = (rawInput: string) => {
  const groups = [...(rawInput + "\n").matchAll(InputParser)][0].groups;
  const times = parseNumbers(groups!["times"]);
  const distances = parseNumbers(groups!["distances"]);
  return times.map((t, i) => {
    return { time: t, distance: distances[i] } as Race;
  });
};

const parseInput2 = (rawInput: string) => {
  const groups = [...(rawInput + "\n").matchAll(InputParser)][0].groups;
  const time = Number(groups!["times"].replace(/\s/g, ""));
  const distance = Number(groups!["distances"].replace(/\s/g, ""));
  return { time: time, distance: distance } as Race;
};

const nWins = (race: Race) => {
  const maxT = Math.floor(race.time / 2);
  const dT = race.time % 2;
  // Yeah there's almost certainly an O(1) way of doing this but O(n) (or is it O(logn)?) is still fast enough.
  var i = 0;
  var wins = 0;
  while ((maxT - i) * (maxT + i + dT) > race.distance) {
    i++;
    wins++;
  }
  wins = wins * 2;
  if (dT == 0) {
    wins--;
  }
  return wins;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  // console.log(input);
  const winsA = input.map(nWins);
  // console.log(winsA);
  return input.reduce((p, c) => p * nWins(c), 1);
};

const part2 = (rawInput: string) => {
  const input = parseInput2(rawInput);

  return nWins(input);
};

const TEST_DATA = `Time:      7  15   30
Distance:  9  40  200`;
run({
  part1: {
    tests: [
      {
        input: TEST_DATA,
        expected: 288,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: TEST_DATA,
        expected: 71503,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
