const {
  filterElements, mapElements, castRBGToInts, getChannelValue, getRelativeLuminance, getContrastRatio
} = require('./colorContrastChecker');

test('filterElements', () => {
  console.log("filterEls")
  expect(filterElements([])).toHaveLength(0);
});

test('mapElements', () => {
  console.log("mapELs")
  expect(mapElements([])).toHaveLength(0);
});