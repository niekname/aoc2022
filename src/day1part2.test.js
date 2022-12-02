const { sum } = require("lodash");

function caloriesCarriedByTop3Elfs(input) {
  return sum(
    input
      .split("\n\n")
      .map((cpe) => sumOfGroup(cpe))
      .sort((a, b) => b - a)
      .slice(0, 3)
  );

  function sumOfGroup(cpe) {
    return sum(cpe.split("\n").map((c) => +c));
  }
}

test("calories carried by top 3 elfs", () => {
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
  const result = caloriesCarriedByTop3Elfs(input);
  expect(result).toBe(45000);
});
