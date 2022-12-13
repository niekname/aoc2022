const { flatten, chunk, unzip, takeRight } = require("lodash");

function fewestStepsToDestination(heightmapString) {
  const rows = heightmapString.split("\n").map((row) => row.split(""));
  const cols = unzip(rows);
  const GRID_SIZE = rows[0].length;
  const heightmap = flatten(rows);

  const currentPosition = heightmap.indexOf("S");
  const destinationIndex = heightmap.indexOf("E");

  let paths = [[currentPosition]];
  while (!destinationReached(paths)) {
    let newPaths = [];
    for (const path of paths) {
      newPaths = [...newPaths, ...nextPaths(path)];
    }
    paths = newPaths;
  }

  return destinationReached(paths).length - 1;

  function destinationReached(paths) {
    for (const path of paths) {
      const [last] = takeRight(path);
      if (last === destinationIndex) return path;
    }
  }

  function nextPaths(path) {
    const currentPosition = takeRight(path);
    const currentElevation = heightmap[currentPosition];

    const rowIdx = Math.floor(currentPosition / GRID_SIZE);
    const colIdx = currentPosition % GRID_SIZE;
    const row = rows[rowIdx];
    const col = cols[colIdx];

    const idxInRow = currentPosition - rowIdx * GRID_SIZE;
    const idxInCol = Math.floor(currentPosition / GRID_SIZE);

    let rightIdx = idxInRow + 1;
    let leftIdx = idxInRow - 1;
    let upIdx = idxInCol - 1;
    let downIdx = idxInCol + 1;

    const right = row[rightIdx];
    const left = row[leftIdx];
    const up = col[upIdx];
    const down = col[downIdx];

    const newPaths = [];
    if (right && !path.includes(rightIdx + rowIdx * GRID_SIZE)) {
      if (elevationFor(right) <= elevationFor(currentElevation) + 1) {
        newPaths.push([...path, rightIdx + rowIdx * GRID_SIZE]);
      }
    }
    if (left && !path.includes(leftIdx + rowIdx * GRID_SIZE)) {
      if (elevationFor(left) <= elevationFor(currentElevation) + 1) {
        newPaths.push([...path, leftIdx + rowIdx * GRID_SIZE]);
      }
    }
    if (up && !path.includes(colIdx + upIdx * GRID_SIZE)) {
      if (elevationFor(up) <= elevationFor(currentElevation) + 1) {
        newPaths.push([...path, colIdx + upIdx * GRID_SIZE]);
      }
    }
    if (down && !path.includes(colIdx + downIdx * GRID_SIZE)) {
      if (elevationFor(down) <= elevationFor(currentElevation) + 1) {
        newPaths.push([...path, colIdx + downIdx * GRID_SIZE]);
      }
    }

    return newPaths;

    function elevationFor(squareInGrid) {
      if (squareInGrid === "S") return "a".charCodeAt(0);
      if (squareInGrid === "E") return "z".charCodeAt(0);
      return squareInGrid.charCodeAt(0);
    }
  }
}

test("fewest steps to destination", () => {
  const heightmap = "Sabqponm\nabcryxxl\naccszExk\nacctuvwj\nabdefghi";
  const result = fewestStepsToDestination(heightmap);
  expect(result).toStrictEqual(31);
});
