const { findIndex, uniq } = require("lodash");

const MARKER_LENGTH = 4;

function findFirstMarker(buffer) {
  return findIndex(buffer.split(""), isMarker, MARKER_LENGTH - 1) + 1;

  function isMarker(value, index, collection) {
    const last4chars = collection.slice(index - (MARKER_LENGTH - 1), index + 1);
    return uniq(last4chars).length === 4;
  }
}

test("first marker", () => {
  const buffer = "mjqjpqmgbljsphdztnvjfqwrcgsmlb";
  const result = findFirstMarker(buffer);
  expect(result).toBe(7);
});
