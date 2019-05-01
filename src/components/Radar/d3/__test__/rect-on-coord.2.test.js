import * as d3 from 'd3'
import { restrictRectWithinArc } from '../rect-on-coord'

it('restrictRectWithinArc for 4 sectors', () => {
  const arcs = d3.pie()([1, 1, 1, 1])
  let arc = arcs[0]
  let offset
  expect(restrictRectWithinArc({ pinPoint: {x: -0.5, y: -0.5}, topLeft: {x: -1, y: -1}, bottomRight: {x: 0, y: 0} }, arc.startAngle, arc.endAngle)).toEqual({ offsetX: 1, offsetY: 0})
  expect(restrictRectWithinArc({ pinPoint: {x: -1, y: -2.5}, topLeft: {x: -1, y: -3}, bottomRight: {x: 2, y: -2} }, arc.startAngle, arc.endAngle)).toEqual({ offsetX: 1, offsetY: -(Math.sqrt(1 + 2.5*2.5) - 2.5) })
  expect(restrictRectWithinArc({ pinPoint: {x: -1.75, y: -0.25}, topLeft: {x: -2, y: -0.5}, bottomRight: {x: -1, y: 0.5} }, arc.startAngle, arc.endAngle)).toEqual({ offsetX: 2, offsetY: -1.5})

  let pinPointX = Math.tan(30 * Math.PI / 180) * (Math.sqrt(8*8 - 4*4) / 2 - 2) - 4, pinPointY = Math.sqrt(8*8 - 4*4) / 2 + 2
  let pinPointYAfter = 2 - Math.sqrt(8*8 - 4*4) / 2, pinPointXAfter = Math.sqrt(pinPointX * pinPointX + pinPointY * pinPointY - pinPointYAfter * pinPointYAfter)
  expect(restrictRectWithinArc({ pinPoint: {x: pinPointX, y: pinPointY }, topLeft: {x: -4, y: 4}, bottomRight: {x: 2, y: Math.sqrt(8*8 - 4*4)} }, arc.startAngle, arc.endAngle)).toEqual({ offsetX: pinPointXAfter - pinPointX, offsetY: pinPointYAfter - pinPointY })


  arc = arcs[1]
  offset = restrictRectWithinArc({ pinPoint: {x: 2, y: -0.25}, topLeft: {x: 1, y: -1}, bottomRight: {x: 4, y: -0.5} }, arc.startAngle, arc.endAngle)
  expect(offset.offsetX).toBeCloseTo(Math.sqrt(4 + 0.25*0.25 - 0.75*0.75) - 2, 10)
  expect(offset.offsetY).toBeCloseTo(1, 10)

  offset = restrictRectWithinArc({ pinPoint: {x: 1.5, y: -0.5}, topLeft: {x: 1, y: -1}, bottomRight: {x: 4, y: 0} }, arc.startAngle, arc.endAngle)
  expect(offset.offsetX).toBeCloseTo(0, 10)
  expect(offset.offsetY).toBeCloseTo(1, 10)


  arc = arcs[3]
  offset = restrictRectWithinArc({ pinPoint: {x: -0.5, y: -0.5}, topLeft: {x: -1, y: -1}, bottomRight: {x: 1, y: 0} }, arc.startAngle, arc.endAngle)
  expect(offset.offsetX).toBeCloseTo(-1, 10)
  expect(offset.offsetY).toBeCloseTo(0, 10)

})

it ('for restrictRectWithinArc, R will increase if rect cannot fit', () => {
  const arcs = d3.pie()([1, 1, 1, 1])
  let arc = arcs[2]
  let offset = restrictRectWithinArc({ pinPoint: {x: 1.5, y: -1.5}, topLeft: {x: 1, y: -2}, bottomRight: {x: 4, y: -1} }, arc.startAngle, arc.endAngle)
  expect(offset.offsetX).toBeCloseTo(-4, 10)
  expect(offset.offsetY).toBeCloseTo(2, 10)

  offset = restrictRectWithinArc({ pinPoint: {x: 1.5, y: -0.5}, topLeft: {x: 1, y: -1}, bottomRight: {x: 4, y: 0} }, arc.startAngle, arc.endAngle)
  expect(offset.offsetX).toBeCloseTo(-4, 10)
  expect(offset.offsetY).toBeCloseTo(1, 10)
})

it ('asdf', () => {
})
