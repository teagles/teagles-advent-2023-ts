import run from "aocrunner";

const InputParser = /(?<instructions>[RL]+)\n(?<nodes>(\n[^\n]+)+)/g;
const NodeParser = /(?<node>\w{3}) = \((?<left>\w{3}), (?<right>\w{3})\)/g;
enum Direction {
  LEFT = "LEFT",
  RIGHT = "RIGHT",
}
const { LEFT, RIGHT } = Direction;
type Node = {
  [key in Direction]: string;
};
class Instructionator {
  instructions: Direction[];
  index: number;
  constructor(inputDirections: string) {
    this.instructions = [...inputDirections].map((c) => {
      if (c == "R") {
        return RIGHT;
      } else {
        return LEFT;
      }
    });
    this.index = 0;
  }
  next() {
    const result = this.instructions[this.index];
    this.index = (this.index + 1) % this.instructions.length;
    return result;
  }
}
const parseInput = (rawInput: string) => {
  const groups = [...rawInput.matchAll(InputParser)][0].groups;
  const instructions = groups!["instructions"];
  const unParsedNodes = groups!["nodes"];
  // console.log(instructions);
  // console.log(unParsedNodes.trim().split("\n"));
  const nodes = new Map<string, Node>();
  const startingPoints = [] as string[];
  unParsedNodes
    .trim()
    .split("\n")
    .forEach((n) => {
      const nodeGroups = n.matchAll(NodeParser).next().value.groups;
      const nodeName = nodeGroups["node"];
      nodes.set(nodeName, {
        LEFT: nodeGroups["left"],
        RIGHT: nodeGroups["right"],
      } as Node);
      if (nodeName[2] == "A") {
        startingPoints.push(nodeName);
      }
    });
  return {
    instructions: new Instructionator(instructions),
    nodes: nodes,
    startingPoints: startingPoints,
  };
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  // console.log(input);
  var cNode = "AAA";
  var steps = 0;
  while (cNode != "ZZZ") {
    cNode = input.nodes.get(cNode)![input.instructions.next()];
    steps++;
  }
  return steps;
};

const leastCommonMultiple = (factors: number[]) => {
  function gcd(a: number, b: number): number {
    return !b ? a : gcd(b, a % b);
  }

  const lcm = (a: number, b: number) => {
    return (a * b) / gcd(a, b);
  };

  var multiple = Math.min(...factors);
  factors.forEach((n) => {
    multiple = lcm(multiple, n);
  });

  return multiple;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  // console.log(input);
  const allSteps = input.startingPoints.map((p) => {
    var cNode = p;
    var steps = 0;
    while (cNode[2] != "Z") {
      cNode = input.nodes.get(cNode)![input.instructions.next()];
      steps++;
    }
    return steps;
  });
  return leastCommonMultiple(allSteps);
};

run({
  part1: {
    tests: [
      {
        input: `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`,
        expected: 2,
      },
      {
        input: `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`,
        expected: 6,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
