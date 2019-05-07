export default () => {
  let nodes
  const force = () => {
    nodes.forEach(node => {
      if (node.hasOwnProperty('name')){
        return
      }
      const dadX = node.dad.x + node.dad.vx
      const dadY = node.dad.y + node.dad.vy
      const dadRadius = node.dad.radius
      const sectorIndex = node.dad.sectorIndex
      const nodeRadius = node.radius
      if (sectorIndex === 0 ) {
        node.x = dadX + dadRadius + node.nth * nodeRadius * 2 + nodeRadius
        node.y = dadY - nodeRadius / 2
      } else if (sectorIndex === 1) {
        node.x = dadX + dadRadius + node.nth * nodeRadius * 2 + nodeRadius
        node.y = dadY + nodeRadius / 2
      } else if (sectorIndex === 2) {
        node.x = dadX - (dadRadius + node.nth * nodeRadius * 2 + nodeRadius)
        node.y = dadY + nodeRadius / 2
      } else if (sectorIndex === 3) {
        node.x = dadX - (dadRadius + node.nth * nodeRadius * 2 + nodeRadius)
        node.y = dadY - nodeRadius / 2
      }
    })
  }

  force.initialize = (_) => nodes = _

  return force
}
