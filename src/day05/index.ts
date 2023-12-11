import run from "aocrunner";

const Categories = [
  "seed-to-soil",
  "soil-to-fertilizer",
  "fertilizer-to-water",
  "water-to-light",
  "light-to-temperature",
  "temperature-to-humidity",
  "humidity-to-location",
] as const;
type Mapping = {
  fromType: string;
  toType: string;
  mappings: MappingLine[];
};
type MappingLine = {
  destinationStart: number;
  sourceStart: number;
  rangeLength: number;
};
const mappingLineContains = (element: number, mappingLine: MappingLine) => {
  return (
    element >= mappingLine.sourceStart &&
    element < mappingLine.sourceStart + mappingLine.rangeLength
  );
};
const mapElement = (element: number, mapping: Mapping) => {
  const foundMappings = mapping.mappings.filter((ml) =>
    mappingLineContains(element, ml),
  );
  if (foundMappings.length == 1) {
    return (
      element - foundMappings[0].sourceStart + foundMappings[0].destinationStart
    );
  } else if (foundMappings.length == 0) {
    return element;
  } else {
    throw new RangeError("Well this is embarrassing.");
  }
};
const CategoriesToShorts = Object.freeze(
  new Map<string, string>(Categories.map((c) => [c, c.replace(/(-)/g, "")])),
);
type Input = {
  seeds: number[];
  mappings: Map<string, Mapping>;
};
const InputParser = new RegExp(
  [
    ["seeds:(?<seeds>( \\d+)+)\\n"],
    Categories.map(
      (c) =>
        c +
        " map:\\n(?<" +
        CategoriesToShorts.get(c) +
        ">(\\d+ \\d+ \\d+\\n)+)",
    ),
  ]
    .reduce((acc, e) => acc.concat(e), [] as string[])
    .join("\\n"),
  "g",
);
const mappingsForGroup = (keyStr: string, valuesStr: string) => {
  // console.log("key" + keyStr);
  // console.log("value" + valuesStr);
  const keys = keyStr.split("to");
  // console.log(keys);
  const mappingLines = valuesStr
    .trim()
    .split("\n")
    .map((s) => {
      const entries = s.split(" ").map((n) => Number(n));
      return {
        destinationStart: entries[0],
        sourceStart: entries[1],
        rangeLength: entries[2],
      } as MappingLine;
    });
  const mapping = {
    fromType: keys[0],
    toType: keys[1],
    mappings: mappingLines,
  } as Mapping;
  // console.log(mapping);
  return mapping;
};
const parseInput = (rawInput: string) => {
  const matchedInput = [...(rawInput + "\n").matchAll(InputParser)][0];
  // console.log(Object.keys(matchedInput.groups as Object));
  if (matchedInput.groups) {
    const groups = matchedInput.groups;
    const mappings = new Map<string, Mapping>();
    [...CategoriesToShorts].forEach((e) => {
      const mapping = mappingsForGroup(e[1], groups[e[1]]);
      // console.log(JSON.stringify(mapping));
      mappings.set(mapping.fromType, mapping);
    });

    // console.log(mappings);
    return {
      seeds: groups["seeds"]
        .trim()
        .split(" ")
        .map((s) => Number(s)),
      mappings: mappings,
    } as Input;
  }
};

const solve = (seeds: number[], input: Input) => {
  return seeds
    .map((s) => {
      var current = "seed";
      var entity = s;
      while (current != "location") {
        // console.log(current + ":"  + entity)
        const next: Mapping = input.mappings.get(current)!;
        // console.log(input.mappings);
        // console.log(next);
        entity = mapElement(entity, next);
        current = next.toType;
      }
      // console.log(current + ":"  + entity);
      return {
        location: entity,
        seed: s,
      };
    })
    .reduce((acc, loc) => (acc.location < loc.location ? acc : loc)).location;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)!;
  const seeds = input?.seeds!;
  // console.log(input);
  return solve(seeds, input);
};

const expandSeeds = (seeds: number[]) => {
  return seeds
    .reduce((result, _, index, array) => {
      if (index % 2 === 0) result.push(array.slice(index, index + 2));
      return result;
    }, [] as number[][])
    .flatMap((range) =>
      Array.from({ length: range[1] }, (_, i) => i + range[0]),
    );
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)!;
  const seeds = expandSeeds(input.seeds);
  return solve(seeds, input);
};

const TEST_DATA = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;
run({
  part1: {
    tests: [
      {
        input: TEST_DATA,
        expected: 35,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: TEST_DATA,
        expected: 46,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
