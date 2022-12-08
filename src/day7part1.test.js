const { flatMap, sumBy } = require("lodash");

function sumOfDirectorySize(terminalOutput) {
  const rootDir = dir("/");
  parseLines(terminalOutput.split("\n"), rootDir);
  return sumBy(
    rootDir.getNestedDirs().filter((d) => d.calculateSize() <= 100000),
    (d) => d.calculateSize()
  );

  function parseLines(lines, currentDir) {
    const line = lines.shift();
    if (!line) return;
    if (isUselessCommand(line)) return parseLines(lines, currentDir);

    if (isCommand(line)) {
      const destDir = line.split(" ")[2];
      parseLines(lines, currentDir.getDir(destDir));
    } else {
      if (isDir(line)) {
        currentDir.addDir(line.replace("dir ", ""));
      } else {
        const [size, name] = line.split(" ");
        currentDir.addFile(name, +size);
      }

      parseLines(lines, currentDir);
    }

    function isUselessCommand(line) {
      return line === "$ cd /" || line === "$ ls";
    }

    function isCommand(line) {
      return line.startsWith("$");
    }

    function isDir(line) {
      return line.startsWith("dir");
    }
  }

  function dir(name, parent) {
    const dirs = [];
    const files = [];

    function calculateSize() {
      return (
        sumBy(files, (f) => f.size) + sumBy(dirs, (d) => d.calculateSize())
      );
    }

    function getNestedDirs() {
      return [...dirs, ...flatMap(dirs, (d) => d.getNestedDirs())];
    }

    function getDir(name) {
      return name === ".." ? parent : dirs.find((d) => d.name === name);
    }

    function addDir(name) {
      dirs.push(dir(name, this));
    }

    function addFile(name, size) {
      files.push({ name, size });
    }

    return {
      name,
      parent,
      dirs,
      files,
      addDir,
      addFile,
      getDir,
      getNestedDirs,
      calculateSize,
    };
  }
}

test("sum of directory size", () => {
  const terminalOutput =
    "$ cd /\n" +
    "$ ls\n" +
    "dir a\n" +
    "14848514 b.txt\n" +
    "8504156 c.dat\n" +
    "dir d\n" +
    "$ cd a\n" +
    "$ ls\n" +
    "dir e\n" +
    "29116 f\n" +
    "2557 g\n" +
    "62596 h.lst\n" +
    "$ cd e\n" +
    "$ ls\n" +
    "584 i\n" +
    "$ cd ..\n" +
    "$ cd ..\n" +
    "$ cd d\n" +
    "$ ls\n" +
    "4060174 j\n" +
    "8033020 d.log\n" +
    "5626152 d.ext\n" +
    "7214296 k";
  const result = sumOfDirectorySize(terminalOutput);
  expect(result).toBe(95437);
});
