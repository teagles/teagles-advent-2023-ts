import run from "aocrunner";

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
  const potentialGears = new Array<CoOrdinate>();
  const numbers = new Array<PartNumber>();
  const numberLookups = new Map<number, PartNumber>();
  lines.forEach((line, row) => {
    const lineResults = findNumbers(line, row, numberLookups);
    lineResults.symbols.forEach((s) => symbols.add(s));
    numbers.push(...lineResults.numbers);
    potentialGears.push(...lineResults.potentialGears);
    // console.log("numbers = " + numbers);
  });
  const grid = lines.map((str) => [...str]);
  // console.log(JSON.stringify(numberLookups));
  return {
    numbers: numbers,
    symbols: symbols,
    grid: grid,
    potentialGears: potentialGears,
    numberLookups: numberLookups,
  };
};

const numerator = /(\d+|[^.\d])/g;
const toIndex = (x: number, y: number, xMax: number) => x + y * xMax;
const findNumbers = (
  line: string,
  row: number,
  numberLookups: Map<number, PartNumber>,
) => {
  const symbols = new Set<string>();
  const numbers = new Array<PartNumber>();
  const potentialGears = new Array<CoOrdinate>();
  [...line.matchAll(numerator)].forEach((match) => {
    // console.log(match);
    const coOrds = {
      row: row,
      col: match.index == null ? -1 : match.index,
    };
    const parsedNum = Number(match[0]);
    if (isNaN(parsedNum)) {
      symbols.add(match[0]);
      if (match[0] == "*") {
        potentialGears.push(coOrds);
      }
    } else {
      // console.log("index: " + match.index)
      const partNumber = {
        number: parsedNum,
        coOrds: coOrds,
        length: match[0].length,
      };
      // console.log(partNumber);
      for (
        let index = coOrds.col;
        index < coOrds.col + partNumber.length;
        index++
      ) {
        numberLookups.set(toIndex(index, row, line.length), partNumber);
      }
      // console.log(JSON.stringify(numberLookups));
      numbers.push(partNumber);
    }
  });
  // console.log("numbers: " + numbers);
  // console.log("symbols: " + symbols);
  return {
    symbols: symbols,
    numbers: numbers,
    potentialGears: potentialGears,
  };
};

const adjacentCoOrds = (coOrds: CoOrdinate, length: number, grid: any[][]) => {
  const result = new Array<CoOrdinate>();
  result.push({
    row: coOrds.row,
    col: coOrds.col - 1,
  });
  result.push({
    row: coOrds.row,
    col: coOrds.col + length,
  });
  for (let index = coOrds.col - 1; index < coOrds.col + length + 1; index++) {
    result.push({
      row: coOrds.row - 1,
      col: index,
    });
    result.push({
      row: coOrds.row + 1,
      col: index,
    });
  }
  // console.log(result);
  return result.filter((c) => validCoOrd(c, grid));
};

const adjacentPartNumberCoOrds = (partNumber: PartNumber, grid: any[][]) => {
  const coOrds = partNumber.coOrds;
  const length = partNumber.length;
  return adjacentCoOrds(coOrds, length, grid);
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
  return adjacentPartNumberCoOrds(partNumber, grid).some((coOrd) => {
    const symbol = grid[coOrd.row][coOrd.col];
    // console.log("checking["+coOrd.row+"]["+coOrd.col+"] found "+ symbol)
    if (symbols.has(symbol)) {
      // console.log("found one");
      return true;
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
  const actualGears = input.potentialGears
    .map((p) => {
      return new Set(
        adjacentCoOrds(p, 1, input.grid)
          .map((gNum) => {
            // console.log("searching: " + JSON.stringify(gNum));
            const foundGearNumber = input.numberLookups.get(
              toIndex(gNum.col, gNum.row, input.grid[gNum.row].length),
            );
            // console.log("found: " + foundGearNumber);
            return foundGearNumber;
          })
          .flatMap((f) => (f ? [f] : [])),
      );
    })
    .filter((gearPartSet) => gearPartSet.size == 2);

  // console.log(actualGears);
  return actualGears.reduce((acc, e) => {
    return (
      acc +
      [...e]
        .flatMap((f) => (f ? [f] : []))
        .reduce((iAcc, n) => iAcc * n.number, 1)
    );
  }, 0);
};

const SAMPLE_INPUT = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;
run({
  part1: {
    tests: [
      {
        input: SAMPLE_INPUT,
        expected: 4361,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: SAMPLE_INPUT,
        expected: 467835,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
