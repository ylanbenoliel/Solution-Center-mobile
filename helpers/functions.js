function removeDuplicates(array, key) {
  const cache = new Set();
  return array.filter(
    (object) => !cache.has(object[key]) && cache.add(object[key]),
  );
}

function chunkArray(array, chunkSize) {
  const results = [];
  while (array.length) {
    results.push(array.splice(0, chunkSize));
  }
  return results;
}
function sanitazeString(string) {
  const sanitazedString = string.trim()
    .toLowerCase()
    .replace(' ', '')
    .replace(new RegExp(/[àáâãäå]/g), 'a')
    .replace(new RegExp(/æ/g), 'ae')
    .replace(new RegExp(/ç/g), 'c')
    .replace(new RegExp(/[èéêë]/g), 'e')
    .replace(new RegExp(/[ìíîï]/g), 'i')
    .replace(new RegExp(/ñ/g), 'n')
    .replace(new RegExp(/[òóôõö]/g), 'o')
    .replace(new RegExp(/œ/g), 'oe')
    .replace(new RegExp(/[ùúûü]/g), 'u')
    .replace(new RegExp(/[ýÿ]/g), 'y')
    .replace(new RegExp(/\W/g), '')
    .split(',')[0];
  return sanitazedString;
}

export {
  removeDuplicates, chunkArray, sanitazeString,
};
