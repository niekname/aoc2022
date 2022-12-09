const { repeat, uniqBy, range, last, first, tail } = require("lodash");

function positionsVisitedByTail(headMotionsString) {
  const headMotions = headMotionsString
    .split("\n")
    .map((l) => l.split(" "))
    .flatMap(([direction, times]) => repeat(direction, +times).split(""));

  const knots = range(10).map(() => knot());

  headMotions.forEach((m) => {
    const head = first(knots);
    head.move(m);

    tail(knots).forEach((current, index, arr) => {
      const previous = index === 0 ? head : arr[index - 1];
      current.follow(previous);
    });
  });

  return uniqBy(last(knots).positionsVisited, (p) => p.join(",")).length;

  function knot() {
    const pos = point(0, 0);
    const positionsVisited = [[0, 0]];

    function move(direction) {
      pos.move(direction);
    }

    function follow(previous) {
      if (pos.isCloseTo(previous.getPos())) return;

      const moveTo = [];
      if (previous.getX() !== pos.getX()) {
        if (previous.getX() > pos.getX()) moveTo.push("R");
        else moveTo.push("L");
      }
      if (previous.getY() !== pos.getY()) {
        if (previous.getY() > pos.getY()) moveTo.push("U");
        else moveTo.push("D");
      }
      moveTo.map(pos.move);

      positionsVisited.push([pos.getX(), pos.getY()]);
    }

    function getX() {
      return pos.getX();
    }

    function getY() {
      return pos.getY();
    }

    function getPos() {
      return pos;
    }

    return {
      follow,
      positionsVisited,
      getX,
      getY,
      getPos,
      move,
    };
  }

  function point(x, y) {
    function move(direction) {
      if (direction === "R") x++;
      if (direction === "L") x--;
      if (direction === "U") y++;
      if (direction === "D") y--;
    }

    function getX() {
      return x;
    }

    function getY() {
      return y;
    }

    function isCloseTo(other, maxDistance = 1) {
      return (
        Math.abs(x - other.getX()) <= maxDistance &&
        Math.abs(y - other.getY()) <= maxDistance
      );
    }

    return Object.freeze({
      getX,
      getY,
      move,
      isCloseTo,
    });
  }
}

test("positions visited by tail", () => {
  const headMotions = "R 5\nU 8\nL 8\nD 3\nR 17\nD 10\nL 25\nU 20";
  const result = positionsVisitedByTail(headMotions);
  expect(result).toBe(36);
});
