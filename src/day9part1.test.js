const { repeat, uniqBy } = require("lodash");

function positionsVisitedByTail(headMotionsString) {
  const headMotions = headMotionsString
    .split("\n")
    .map((l) => l.split(" "))
    .flatMap(([direction, times]) => repeat(direction, +times).split(""));

  const h = head();
  const t = tail();

  headMotions.forEach((m) => {
    h.move(m);
    t.follow(h);
  });

  return uniqBy(t.positionsVisited, (p) => p.join(",")).length;

  function head() {
    const pos = point(0, 0);
    let lastDirection;

    function move(direction) {
      lastDirection = direction;
      pos.move(direction);
    }

    function getX() {
      return pos.getX();
    }

    function getY() {
      return pos.getY();
    }

    function getLastDirection() {
      return lastDirection;
    }

    function getPos() {
      return pos;
    }

    return Object.freeze({
      getX,
      getY,
      getPos,
      getLastDirection,
      move,
    });
  }

  function tail() {
    const pos = point(0, 0);
    const positionsVisited = [[0, 0]];

    function follow(head) {
      if (pos.isCloseTo(head.getPos())) return;

      const moveTo = [];
      if (head.getX() !== pos.getX()) {
        if (head.getX() > pos.getX()) moveTo.push("R");
        else moveTo.push("L");
      }
      if (head.getY() !== pos.getY()) {
        if (head.getY() > pos.getY()) moveTo.push("U");
        else moveTo.push("D");
      }
      moveTo.map(pos.move);

      positionsVisited.push([pos.getX(), pos.getY()]);
    }

    return { follow, positionsVisited };
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

    function isInDifferentRowAndColumnThan(other) {
      return x !== other.getX() && y !== other.getY();
    }

    return Object.freeze({
      getX,
      getY,
      move,
      isCloseTo,
      isInDifferentRowAndColumnThan,
    });
  }
}

test("positions visited by tail", () => {
  const headMotions = "R 4\nU 4\nL 3\nD 1\nR 4\nD 1\nL 5\nR 2";
  const result = positionsVisitedByTail(headMotions);
  expect(result).toBe(13);
});
