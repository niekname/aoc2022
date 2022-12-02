const { sum, first } = require("lodash");

function mostCaloriesCarriedByElf(input) {
  return first(
    input
      .split("\n\n")
      .map((cpe) => sumOfGroup(cpe))
      .sort((a, b) => b - a)
  );

  function sumOfGroup(cpe) {
    return sum(cpe.split("\n").map((c) => +c));
  }
}

test("most calories carried by elf", () => {
  const input =
    "1000\n" +
    "2000\n" +
    "3000\n" +
    "\n" +
    "4000\n" +
    "\n" +
    "5000\n" +
    "6000\n" +
    "\n" +
    "7000\n" +
    "8000\n" +
    "9000\n" +
    "\n" +
    "10000";
  const result = mostCaloriesCarriedByElf(input);
  expect(result).toBe(24000);
});
