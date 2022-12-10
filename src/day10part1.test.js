const { sum } = require("lodash");

function valueAtCycle(cycles, cyclesToRegister) {
  const cpu = CPU(cyclesToRegister);
  const instructions = cycles.split("\n");
  for (const instruction of instructions) {
    if (instruction === "noop") {
      cpu.noop();
    } else {
      const value = +instruction.split(" ")[1];
      cpu.addx(value);
    }
  }

  cpu.noop();
  return sum(cpu.registeredCycles);

  function CPU(cyclesToRegister) {
    let registerX = 1;
    let currentCycle = 1;
    const signalStrengths = [];

    function noop() {
      doCycle();
    }

    function addx(value) {
      doCycle();
      doCycle();
      registerX += value;
    }

    function maybeRegisterCycle() {
      if (cyclesToRegister.includes(currentCycle))
        signalStrengths.push(registerX * currentCycle);
    }

    function doCycle() {
      maybeRegisterCycle();
      currentCycle++;
    }

    return Object.freeze({ noop, addx, registeredCycles: signalStrengths });
  }
}

test("signal strength during cycles [20, 60, 100, 140, 180, 220]", () => {
  const cycles =
    "addx 15\naddx -11\naddx 6\naddx -3\naddx 5\naddx -1\naddx -8\naddx 13\naddx 4\nnoop\naddx -1\naddx 5\naddx -1\naddx 5\naddx -1\naddx 5\naddx -1\naddx 5\naddx -1\naddx -35\naddx 1\naddx 24\naddx -19\naddx 1\naddx 16\naddx -11\nnoop\nnoop\naddx 21\naddx -15\nnoop\nnoop\naddx -3\naddx 9\naddx 1\naddx -3\naddx 8\naddx 1\naddx 5\nnoop\nnoop\nnoop\nnoop\nnoop\naddx -36\nnoop\naddx 1\naddx 7\nnoop\nnoop\nnoop\naddx 2\naddx 6\nnoop\nnoop\nnoop\nnoop\nnoop\naddx 1\nnoop\nnoop\naddx 7\naddx 1\nnoop\naddx -13\naddx 13\naddx 7\nnoop\naddx 1\naddx -33\nnoop\nnoop\nnoop\naddx 2\nnoop\nnoop\nnoop\naddx 8\nnoop\naddx -1\naddx 2\naddx 1\nnoop\naddx 17\naddx -9\naddx 1\naddx 1\naddx -3\naddx 11\nnoop\nnoop\naddx 1\nnoop\naddx 1\nnoop\nnoop\naddx -13\naddx -19\naddx 1\naddx 3\naddx 26\naddx -30\naddx 12\naddx -1\naddx 3\naddx 1\nnoop\nnoop\nnoop\naddx -9\naddx 18\naddx 1\naddx 2\nnoop\nnoop\naddx 9\nnoop\nnoop\nnoop\naddx -1\naddx 2\naddx -37\naddx 1\naddx 3\nnoop\naddx 15\naddx -21\naddx 22\naddx -6\naddx 1\nnoop\naddx 2\naddx 1\nnoop\naddx -10\nnoop\nnoop\naddx 20\naddx 1\naddx 2\naddx 2\naddx -6\naddx -11\nnoop\nnoop\nnoop";
  const result = valueAtCycle(cycles, [20, 60, 100, 140, 180, 220]);
  expect(result).toStrictEqual(13140);
});
