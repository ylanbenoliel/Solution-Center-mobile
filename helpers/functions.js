function removeDuplicates(array, key) {
  const cache = new Set()
  return array.filter(
    (object) => !cache.has(object[key]) && cache.add(object[key])
  )
}

function chunkArray(array, chunkSize) {
  let results = []
  while (array.length) {
    results.push(array.splice(0, chunkSize))
  }
  return results
}

export {
  removeDuplicates, chunkArray
}