const { flatMap, sumBy } = require("lodash");

const TOTAL_DISK_SIZE = 70000000;
const SIZE_OF_UPDATE = 30000000;

function sizeOfDirectoryToDelete(terminalOutput) {
  const rootDir = dir("/");
  parseLines(terminalOutput.split("\n"), rootDir);

  const freeSpace = TOTAL_DISK_SIZE - rootDir.calculateSize();
  const spaceToFree = SIZE_OF_UPDATE - freeSpace;

  const dirToDelete = rootDir
    .getNestedDirs()
    .sort((a, b) => a.calculateSize() - b.calculateSize())
    .find((d) => d.calculateSize() >= spaceToFree);
  return dirToDelete.calculateSize();

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
      files.push(file(name, size));
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

  function file(name, size) {
    return { name, size };
  }
}

test("size of directory to delete", () => {
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
  const result = sizeOfDirectoryToDelete(terminalOutput);
  expect(result).toBe(24933642);
});
