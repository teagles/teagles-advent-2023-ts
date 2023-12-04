import run from "aocrunner";
import { syncBuiltinESMExports } from "module";

type CoOrdinate = {
  col: number;
  row: number;
};

type PartNumber = {
  number: number;
  coOrds: CoOrdinate;
  length: number;
};

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n");
  const symbols = new Set<string>();
  const numbers = new Array<PartNumber>();
  lines.forEach((line, row) => {
    const lineResults = findNumbers(line, row);
    lineResults.symbols.forEach((s) => symbols.add(s));
    numbers.push(...lineResults.numbers);
    // console.log("numbers = " + numbers);
  });
  const grid = lines.map((str) => [...str]);

  return {
    numbers: numbers,
    symbols: symbols,
    grid: grid,
  };
};

const numerator = /(\d+|[^.\d])/g;
const findNumbers = (line: string, row: number) => {
  const symbols = new Set<string>();
  const numbers = new Array<PartNumber>();
  [...line.matchAll(numerator)].forEach((match) => {
    // console.log(match);
    const parsedNum = Number(match[0]);
    if (isNaN(parsedNum)) {
      symbols.add(match[0]);
    } else {
      // console.log("index: " + match.index)
      const partNumber = {
        number: parsedNum,
        coOrds: {
          row: row,
          col: match.index == null ? -1 : match.index,
        },
        length: match[0].length,
      };
      // console.log(partNumber);
      numbers.push(partNumber);
    }
  });
  // console.log("numbers: " + numbers);
  // console.log("symbols: " + symbols);
  return {
    symbols: symbols,
    numbers: numbers,
  };
};

const adjacentCoOrds = (partNumber: PartNumber) => {
  const result = new Array<CoOrdinate>();
  result.push({
    row: partNumber.coOrds.row,
    col: partNumber.coOrds.col - 1,
  });
  result.push({
    row: partNumber.coOrds.row,
    col: partNumber.coOrds.col + partNumber.length,
  });
  for (
    let index = partNumber.coOrds.col - 1;
    index < partNumber.coOrds.col + partNumber.length + 1;
    index++
  ) {
    result.push({
      row: partNumber.coOrds.row - 1,
      col: index,
    });
    result.push({
      row: partNumber.coOrds.row + 1,
      col: index,
    });
  }
  // console.log(result);
  return result;
};

const validCoOrd = (coOrd: CoOrdinate, grid: any[][]) => {
  return (
    coOrd.row >= 0 &&
    coOrd.col >= 0 &&
    coOrd.row < grid.length &&
    coOrd.col < grid[coOrd.row].length
  );
};

const adjacentSymbol = (
  partNumber: PartNumber,
  grid: string[][],
  symbols: Set<string>,
) => {
  return adjacentCoOrds(partNumber).some((coOrd) => {
    if (validCoOrd(coOrd, grid)) {
      const symbol = grid[coOrd.row][coOrd.col];
      // console.log("checking["+coOrd.row+"]["+coOrd.col+"] found "+ symbol)
      if (symbols.has(symbol)) {
        // console.log("found one");
        return true;
      }
    }
    return false;
  });
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  // console.log(input.grid);
  return input.numbers.reduce((acc, e) => {
    if (adjacentSymbol(e, input.grid, input.symbols)) {
      return acc + e.number;
    }
    return acc;
  }, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`,
        expected: 4361,
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
