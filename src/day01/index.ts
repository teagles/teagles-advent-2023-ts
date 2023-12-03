import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  var runningSum = 0;
  input.split("\n").forEach((line) => {
    var firstDigit: number | null = null;
    var lastDigit = null;
    [...line].forEach((charAt) => {
      var charNumber = Number(charAt);
      // console.log("Decoded " + charNumber);
      if (!isNaN(charNumber)) {
        if (firstDigit == null) {
          firstDigit = charNumber;
          // console.log("Frist Assigned " + charNumber);
        }
        lastDigit = charNumber;
        // console.log("Last Assigned " + charNumber);
      }
    });
    if (firstDigit != null && lastDigit != null) {
      var lineSum = firstDigit * 10 + lastDigit;
      // console.log("Linesum " + lineSum);
      runningSum += lineSum;
    }
  });
  return runningSum;
};

const numerator = /([\d]|one|two|three|four|five|six|seven|eight|nine)/g;
const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  var runningSum = 0;
  input.split("\n").forEach((line) => {
    const matches = line.matchAll(numerator);

    for (const match of matches) {
      console.log(match);
      console.log(match.index);
    }
  });
  return runningSum;
};

run({
  part1: {
    tests: [
      {
        input: `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`,
        expected: 142,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`,
        expected: 281,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
