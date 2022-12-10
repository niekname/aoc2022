const { chunk } = require("lodash");

function crtImage(cycles) {
  const cpu = CPU();
  const instructions = cycles.split("\n");
  for (const instruction of instructions) {
    if (instruction === "noop") {
      cpu.noop();
    } else {
      const value = +instruction.split(" ")[1];
      cpu.addx(value);
    }
  }

  return chunk(cpu.crt, 40)
    .map((r) => r.join(""))
    .join("\n");

  function CPU() {
    let registerX = 1;
    let currentCycle = 1;
    const crt = [];

    function noop() {
      doCycle();
    }

    function addx(value) {
      doCycle();
      doCycle();
      registerX += value;
    }

    function doCycle() {
      crt.push(isLit() ? "#" : ".");
      currentCycle++;
    }

    function isLit() {
      const sprite = [registerX - 1, registerX, registerX + 1];
      const currentCrtPos = crt.length % 40;
      return sprite.includes(currentCrtPos);
    }

    return Object.freeze({ noop, addx, crt });
  }
}

test("crt image", () => {
  const cycles =
    "addx 15\naddx -11\naddx 6\naddx -3\naddx 5\naddx -1\naddx -8\naddx 13\naddx 4\nnoop\naddx -1\naddx 5\naddx -1\naddx 5\naddx -1\naddx 5\naddx -1\naddx 5\naddx -1\naddx -35\naddx 1\naddx 24\naddx -19\naddx 1\naddx 16\naddx -11\nnoop\nnoop\naddx 21\naddx -15\nnoop\nnoop\naddx -3\naddx 9\naddx 1\naddx -3\naddx 8\naddx 1\naddx 5\nnoop\nnoop\nnoop\nnoop\nnoop\naddx -36\nnoop\naddx 1\naddx 7\nnoop\nnoop\nnoop\naddx 2\naddx 6\nnoop\nnoop\nnoop\nnoop\nnoop\naddx 1\nnoop\nnoop\naddx 7\naddx 1\nnoop\naddx -13\naddx 13\naddx 7\nnoop\naddx 1\naddx -33\nnoop\nnoop\nnoop\naddx 2\nnoop\nnoop\nnoop\naddx 8\nnoop\naddx -1\naddx 2\naddx 1\nnoop\naddx 17\naddx -9\naddx 1\naddx 1\naddx -3\naddx 11\nnoop\nnoop\naddx 1\nnoop\naddx 1\nnoop\nnoop\naddx -13\naddx -19\naddx 1\naddx 3\naddx 26\naddx -30\naddx 12\naddx -1\naddx 3\naddx 1\nnoop\nnoop\nnoop\naddx -9\naddx 18\naddx 1\naddx 2\nnoop\nnoop\naddx 9\nnoop\nnoop\nnoop\naddx -1\naddx 2\naddx -37\naddx 1\naddx 3\nnoop\naddx 15\naddx -21\naddx 22\naddx -6\naddx 1\nnoop\naddx 2\naddx 1\nnoop\naddx -10\nnoop\nnoop\naddx 20\naddx 1\naddx 2\naddx 2\naddx -6\naddx -11\nnoop\nnoop\nnoop";
  const expectedCrt =
    "##..##..##..##..##..##..##..##..##..##..\n###...###...###...###...###...###...###.\n####....####....####....####....####....\n#####.....#####.....#####.....#####.....\n######......######......######......####\n#######.......#######.......#######.....";
  expect(crtImage(cycles)).toBe(expectedCrt);
});
