const { unzip, chunk, every, first, takeWhile } = require("lodash");

function highestScenicScore(treeMap) {
  const GRID_SIZE = treeMap.split("\n")[0].length;
  const trees = treeMap
    .split("")
    .filter((t) => t !== "\n")
    .map((t) => +t);

  return first(trees.map(scenicScore).sort((a, b) => b - a));

  function scenicScore(currentTree, idx, trees) {
    const rowIdx = Math.floor(idx / GRID_SIZE);
    const colIdx = idx % GRID_SIZE;
    const row = chunk(trees, GRID_SIZE)[rowIdx];
    const col = unzip(chunk(trees, GRID_SIZE))[colIdx];

    const left = row.slice(0, colIdx).reverse();
    const right = row.slice(colIdx + 1, GRID_SIZE);
    const up = col.slice(0, rowIdx).reverse();
    const down = col.slice(rowIdx + 1, GRID_SIZE);

    return (
      treesVisible(left) *
      treesVisible(right) *
      treesVisible(up) *
      treesVisible(down)
    );

    function treesVisible(someTrees) {
      let count = 0;
      for (const someTree of someTrees) {
        count++;
        if (someTree >= currentTree) return count;
      }
      return count;
    }
  }
}

test("highest scenic score", () => {
  const treeMap = "30373\n25512\n65332\n33549\n35390";
  const result = highestScenicScore(treeMap);
  expect(result).toBe(8);
});
