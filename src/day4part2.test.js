const { inRange, range, intersection, isEmpty } = require("lodash");

function numberOfPairsWithOverlappingAssignments(input) {
  const pairs = input.split("\n").map((p) => p.split(","));
  return pairs.filter(hasAnOverlap).length;

  function hasAnOverlap([assignmentElf1, assignmentElf2]) {
    const [startAssignmentElf1, endAssignmentElf1] = assignmentElf1
      .split("-")
      .map((a) => +a);
    const [startAssignmentElf2, endAssignmentElf2] = assignmentElf2
      .split("-")
      .map((a) => +a);

    const allAssignmentsElf1 = range(
      startAssignmentElf1,
      endAssignmentElf1 + 1
    );
    const allAssignmentsElf2 = range(
      startAssignmentElf2,
      endAssignmentElf2 + 1
    );

    return !isEmpty(intersection(allAssignmentsElf1, allAssignmentsElf2));
  }
}

test("number of pairs with overlapping assignments", () => {
  const input = "2-4,6-8\n2-3,4-5\n5-7,7-9\n2-8,3-7\n6-6,4-6\n2-6,4-8";
  const result = numberOfPairsWithOverlappingAssignments(input);
  expect(result).toBe(4);
});
