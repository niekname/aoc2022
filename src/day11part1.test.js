const { range } = require("lodash");

function monkeyBusiness(monkeysString) {
  const monkeys = monkeysString.split("\n\n").map(parseMonkey);

  range(20).forEach(() => {
    monkeys.forEach((m) => m.playRound(monkeys));
  });

  const [mostActive, secondMostActive] = monkeys
    .map((m) => m.getItemsInspected())
    .sort((a, b) => b - a);

  return mostActive * secondMostActive;

  function parseMonkey(monkeyString) {
    const [
      idString,
      itemsString,
      operationString,
      testString,
      testTrueString,
      testFalseString,
    ] = monkeyString.split("\n");

    const id = +idString.replace("Monkey ", "").replace(":", "");
    const items = itemsString
      .replace("Starting items:", "")
      .replaceAll(" ", "")
      .split(",")
      .map((i) => +i);
    const operation = operationString.replace("Operation: new = ", "").trim();
    const divisibleBy = +testString.replace("Test: divisible by ", "").trim();
    const destMonkeyTrue = +testTrueString
      .replace("If true: throw to monkey ", "")
      .trim();
    const destMonkeyFalse = +testFalseString
      .replace("If false: throw to monkey", "")
      .trim();

    const test = Test(divisibleBy, destMonkeyTrue, destMonkeyFalse);
    return Monkey(id, items, operation, test);
  }
}

function Monkey(id, items, operation, test) {
  let itemsInspected = 0;

  function playRound(monkeys) {
    for (const item of getItems()) {
      itemsInspected++;
      const newWorryLevel = Math.floor(
        eval(operation.replaceAll("old", item)) / 3
      );
      if (newWorryLevel % test.divisibleBy === 0) {
        const destMonkey = monkeys.find((m) => m.id === test.destMonkeyTrue);
        destMonkey.getItems().push(newWorryLevel);
      } else {
        const destMonkey = monkeys.find((m) => m.id === test.destMonkeyFalse);
        destMonkey.getItems().push(newWorryLevel);
      }
    }
    items = [];
  }

  function getItems() {
    return items;
  }

  function getItemsInspected() {
    return itemsInspected;
  }

  return { id, getItems, playRound, getItemsInspected };
}

function Test(divisibleBy, destMonkeyTrue, destMonkeyFalse) {
  return Object.freeze({ divisibleBy, destMonkeyTrue, destMonkeyFalse });
}

test("monkey business", () => {
  const monkeys =
    "Monkey 0:\n" +
    "  Starting items: 79, 98\n" +
    "  Operation: new = old * 19\n" +
    "  Test: divisible by 23\n" +
    "    If true: throw to monkey 2\n" +
    "    If false: throw to monkey 3\n" +
    "\n" +
    "Monkey 1:\n" +
    "  Starting items: 54, 65, 75, 74\n" +
    "  Operation: new = old + 6\n" +
    "  Test: divisible by 19\n" +
    "    If true: throw to monkey 2\n" +
    "    If false: throw to monkey 0\n" +
    "\n" +
    "Monkey 2:\n" +
    "  Starting items: 79, 60, 97\n" +
    "  Operation: new = old * old\n" +
    "  Test: divisible by 13\n" +
    "    If true: throw to monkey 1\n" +
    "    If false: throw to monkey 3\n" +
    "\n" +
    "Monkey 3:\n" +
    "  Starting items: 74\n" +
    "  Operation: new = old + 3\n" +
    "  Test: divisible by 17\n" +
    "    If true: throw to monkey 0\n" +
    "    If false: throw to monkey 1";
  const result = monkeyBusiness(monkeys);
  expect(result).toStrictEqual(10605);
});
