import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const partOneNumerator = /([\d])/g;
const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  var runningSum = 0;
  input.split("\n").forEach((line) => {
    // console.log("line: " + line);
    const matches = Array.from(line.matchAll(partOneNumerator)).map(
      (match) => match[0],
    );
    // console.log("tokens: " + matches);
    // console.log("first " + matches[0]);
    // console.log("last " + matches[matches.length - 1]);
    var lineSum = Number(matches[0]) * 10 + Number(matches[matches.length - 1]);
    // console.log("Linesum " + lineSum);
    runningSum += lineSum;
  });
  return runningSum;
};

// const numerator = /([\d]|one|two|three|four|five|six|seven|eight|nine)/g;
const NumberWords = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};
// console.log(NumberWords);
const ReverseNumberWords = Object.keys(NumberWords).reduce(
  (o, key, value) => ({ ...o, [[...key].reverse().join("")]: value + 1 }),
  {},
);
// console.log(ReverseNumberWords);
const numerator = new RegExp(
  "([\\d]|" + Object.keys(NumberWords).join("|") + ")",
  "g",
);
const reverseNumerator = new RegExp(
  "([\\d]|" + Object.keys(ReverseNumberWords).join("|") + ")",
  "g",
);
const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  var runningSum = 0;
  const lookUp = (str: string, reverse: boolean) => {
    var charNumber = Number(str);
    // console.log("Decoded " + charNumber);
    if (isNaN(charNumber)) {
      if (reverse) {
        charNumber = (ReverseNumberWords as { [index: string]: number })[str];
      } else {
        charNumber = (NumberWords as { [index: string]: number })[str];
      }
      // console.log("StrDecoded " + charNumber);
    }
    return charNumber;
  };
  input.split("\n").forEach((line) => {
    // console.log("line: " + line);
    const forwardMatches = Array.from(line.matchAll(numerator)).map(
      (match) => match[0],
    );
    // console.log("forward-tokens: " + forwardMatches);
    // console.log("first " + forwardMatches[0]);
    const rLine = [...line].reverse().join("");
    // console.log("rline: " + rLine);
    const reverseMatches = Array.from(rLine.matchAll(reverseNumerator)).map(
      (match) => match[0],
    );
    // console.log("reverse-tokens: " + reverseMatches);
    // console.log("last " + reverseMatches[0]);
    var lineSum =
      lookUp(forwardMatches[0], false) * 10 + lookUp(reverseMatches[0], true);
    // console.log("Linesum " + lineSum);
    runningSum += lineSum;
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
  onlyTests: false,
});
