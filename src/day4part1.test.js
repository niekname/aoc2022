function numberOfFullyOverlappingAssignmentsInPairs(input) {
  const pairs = input.split("\n").map((p) => p.split(","));
  return pairs.filter(isFullyOverlapping).length;

  function isFullyOverlapping([assignmentElf1, assignmentElf2]) {
    const [startAssignmentElf1, endAssignmentElf1] = assignmentElf1
      .split("-")
      .map((a) => +a);
    const [startAssignmentElf2, endAssignmentElf2] = assignmentElf2
      .split("-")
      .map((a) => +a);

    return (
      (startAssignmentElf1 >= startAssignmentElf2 &&
        endAssignmentElf1 <= endAssignmentElf2) ||
      (startAssignmentElf2 >= startAssignmentElf1 &&
        endAssignmentElf2 <= endAssignmentElf1)
    );
  }
}

test("number of fully overlapping assignments in pairs", () => {
  const input = "2-4,6-8\n2-3,4-5\n5-7,7-9\n2-8,3-7\n6-6,4-6\n2-6,4-8";
  const result = numberOfFullyOverlappingAssignmentsInPairs(input);
  expect(result).toBe(2);
});
