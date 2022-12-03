const { first, sum } = require("lodash");

function sumOfAllPriorities(input) {
  const rucksacks = input.split("\n");
  return sum(rucksacks.map(duplicateItemInRucksack).map(priorityFor));

  function duplicateItemInRucksack(rucksack) {
    const items = rucksack.split("");
    const firstCompartment = items.slice(0, items.length / 2);
    const secondCompartment = items.slice(items.length / 2);
    return first(firstCompartment.filter((i) => secondCompartment.includes(i)));
  }

  function priorityFor(item) {
    const isLowerCase = (c) => c === c.toLowerCase();
    return isLowerCase(item)
      ? item.charCodeAt(0) - 96
      : item.charCodeAt(0) - 64 + 26;
  }
}

test("sum of all priorities", () => {
  const input =
    "vJrwpWtwJgWrhcsFMMfFFhFp\njqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL\nPmmdzqPrVvPwwTWBwg\nwMqvLMZHhHMvwLHjbvcjnnSBnvTQFn\nttgJtRGJQctTZtZT\nCrZsJsPPZsGzwwsLwLmpwMDw";
  const result = sumOfAllPriorities(input);
  expect(result).toBe(157);
});
