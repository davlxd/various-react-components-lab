export default () => {
  let nodes
  const BOUNDARY_PADDING = 12
  const force = () => {
    nodes.forEach(node => {
      const sectorIndex = node.sectorIndex
      if (sectorIndex === 0 ) {
        node.x = Math.max(BOUNDARY_PADDING, node.x)
        node.y = Math.min(-BOUNDARY_PADDING, node.y)
      } else if (sectorIndex === 1) {
        node.x = Math.max(BOUNDARY_PADDING, node.x)
        node.y = Math.max(BOUNDARY_PADDING, node.y)
      } else if (sectorIndex === 2) {
        node.x = Math.min(-BOUNDARY_PADDING, node.x)
        node.y = Math.max(BOUNDARY_PADDING, node.y)
      } else {
        node.x = Math.min(-BOUNDARY_PADDING, node.x)
        node.y = Math.min(-BOUNDARY_PADDING, node.y)
      }
    })
  }

  force.initialize = (_) => nodes = _

  return force
}
