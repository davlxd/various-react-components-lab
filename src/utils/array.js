export const groupBy = (array, key) => array.reduce((acc, cur) => {
  acc[cur[key]] = acc[cur[key]] || []
  acc[cur[key]].push(cur)
  return acc
}, {})
