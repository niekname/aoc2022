const { unzip, chunk, every } = require("lodash");

function treesVisibleFromOutside(treeMap) {
  const GRID_SIZE = treeMap.split("\n")[0].length;
  const trees = treeMap
    .split("")
    .filter((t) => t !== "\n")
    .map((t) => +t);
  return trees.filter(isVisible).length;

  function isVisible(currentTree, idx, trees) {
    const rowIdx = Math.floor(idx / GRID_SIZE);
    const colIdx = idx % GRID_SIZE;
    const row = chunk(trees, GRID_SIZE)[rowIdx];
    const col = unzip(chunk(trees, GRID_SIZE))[colIdx];

    return isVisibleIn(row, colIdx) || isVisibleIn(col, rowIdx);

    function isVisibleIn(someTrees, treeIdx) {
      const allBefore = someTrees.slice(0, treeIdx);
      const allAfter = someTrees.slice(treeIdx + 1, someTrees.length);
      return allSmaller(allBefore) || allSmaller(allAfter);

      function allSmaller(otherTrees) {
        return every(otherTrees, (ot) => ot < currentTree);
      }
    }
  }
}

test("trees visible from outside", () => {
  const treeMap = "30373\n25512\n65332\n33549\n35390";
  const result = treesVisibleFromOutside(treeMap);
  expect(result).toBe(21);
});
