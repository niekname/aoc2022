const { chunk, unzip, zipObject, without } = require("lodash");

function crateOnTopOfEachStack(
  numberOfStacks,
  stacksString,
  rearangementProcedureString
) {
  const stacks = parseStacks(stacksString, numberOfStacks);
  const rearangementProcedure = parseRearangementProcedure(
    rearangementProcedureString
  );

  for (step of rearangementProcedure) {
    const fromStack = stacks[step.from - 1];
    const toStack = stacks[step.to - 1];

    const cratesToMove = fromStack.splice(0, step.amount);
    toStack.unshift(...cratesToMove.reverse());
  }

  return stacks.map((s) => s.shift()).join("");
}

function parseStacks(stacks, numberOfStacks) {
  const crates = stacks.split("").filter((_, i) => i % 4 === 1);
  const stackedCrates = unzip(chunk(crates, numberOfStacks));
  return stackedCrates.map((sc) => without(sc, " "));
}

function parseRearangementProcedure(rearangementProcedure) {
  return rearangementProcedure.split("\n").map((l) =>
    zipObject(
      ["amount", "from", "to"],
      l.match(/\d+/g).map((d) => +d)
    )
  );
}

test("parse stacks", () => {
  const stacks = "    [D]    \n[N] [C]    \n[Z] [M] [P]";
  const result = parseStacks(stacks, 3);
  expect(result).toEqual([["N", "Z"], ["D", "C", "M"], ["P"]]);
});

test("parse rearangement procedure", () => {
  const rearangementProcedure =
    "move 1 from 2 to 1\n" +
    "move 3 from 1 to 3\n" +
    "move 2 from 2 to 1\n" +
    "move 1 from 1 to 2";

  const result = parseRearangementProcedure(rearangementProcedure);
  expect(result).toEqual([
    { amount: 1, from: 2, to: 1 },
    { amount: 3, from: 1, to: 3 },
    { amount: 2, from: 2, to: 1 },
    { amount: 1, from: 1, to: 2 },
  ]);
});

test("crate on top of each stack", () => {
  const stacks = "    [D]    \n[N] [C]    \n[Z] [M] [P]";

  const rearangementProcedure =
    "move 1 from 2 to 1\n" +
    "move 3 from 1 to 3\n" +
    "move 2 from 2 to 1\n" +
    "move 1 from 1 to 2";

  const result = crateOnTopOfEachStack(3, stacks, rearangementProcedure);
  expect(result).toBe("CMZ");
});
