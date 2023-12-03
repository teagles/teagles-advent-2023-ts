import run from "aocrunner";

const gameRegex = /Game (\d+):(.*)/g;
const drawRegex = /\s*(\d+) (\w+),*/g;
const parseInput = (rawInput: string) => {
  return rawInput.split("\n").map((line) => {
    const gameMatches = [...line.matchAll(gameRegex)];
    const draws = gameMatches[0][2].split(";").map((draws) =>
      [...draws.matchAll(drawRegex)].reduce(
        (o, draw) => {
          // console.log("color: " + draw[2]);
          // console.log("n: " + draw[1]);
          (o as { [index: string]: number })[draw[2]] = Number(draw[1]);
          // console.log(o);
          return o;
        },
        { red: 0, blue: 0, green: 0 },
      ),
    );
    // console.log(gameMatches)
    return {
      gameId: Number(gameMatches[0][1]),
      draws: draws,
      minimumDraw: draws.reduce(
        (o, draw) => {
          Object.keys(o).forEach((color) => {
            (o as { [index: string]: number })[color] = Math.max(
              (o as { [index: string]: number })[color],
              (draw as { [index: string]: number })[color],
            );
          });
          return o;
        },
        { red: 0, blue: 0, green: 0 },
      ),
    };
  });
};

const part1 = (rawInput: string) => {
  const referenceMap = {
    red: 12,
    green: 13,
    blue: 14,
  };
  const input = parseInput(rawInput);
  const validIds = input.map((game) => {
    if (
      Object.keys(referenceMap).reduce((b, color) => {
        return (
          b &&
          (game.minimumDraw as { [index: string]: number })[color] <=
            (referenceMap as { [index: string]: number })[color]
        );
      }, true)
    ) {
      return game.gameId;
    } else {
      return 0;
    }
  });

  return validIds.reduce((acc, e) => acc + e, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const powers = input.map((game) => {
    return Object.keys(game.minimumDraw).reduce((acc, color) => {
      return (game.minimumDraw as { [index: string]: number })[color] * acc;
    }, 1);
  });
  return powers.reduce((acc, e) => acc + e, 0);
};

const PROVIDED_INPUT = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`;

run({
  part1: {
    tests: [
      {
        input: PROVIDED_INPUT,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: PROVIDED_INPUT,
        expected: 2286,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
