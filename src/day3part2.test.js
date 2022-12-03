const { sum, chunk } = require("lodash");

function sumOfAllBadgePriorities(input) {
  const rucksacks = input.split("\n").map((r) => r.split(""));
  const groups = chunk(rucksacks, 3);
  return sum(groups.map(findBadgeIn).map(priorityFor));

  function findBadgeIn([firstRucksack, secondRucksack, thirdRucksack]) {
    return firstRucksack.find(
      (i) => secondRucksack.includes(i) && thirdRucksack.includes(i)
    );
  }

  function priorityFor(item) {
    const isLowerCase = (c) => c === c.toLowerCase();
    return isLowerCase(item)
      ? item.charCodeAt(0) - 96
      : item.charCodeAt(0) - 64 + 26;
  }
}

test("sum of all badge priorities", () => {
  const input =
    "vJrwpWtwJgWrhcsFMMfFFhFp\njqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL\nPmmdzqPrVvPwwTWBwg\nwMqvLMZHhHMvwLHjbvcjnnSBnvTQFn\nttgJtRGJQctTZtZT\nCrZsJsPPZsGzwwsLwLmpwMDw";
  const result = sumOfAllBadgePriorities(input);
  expect(result).toBe(70);
});
