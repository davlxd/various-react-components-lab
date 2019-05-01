import { blipShapes, getBlipShape, getBlipAngle, angleToCoord } from '../blip'

it('rotate of 4 works', () => {
  expect(getBlipShape(0)).toEqual(blipShapes[0])
  expect(getBlipShape(3)).toEqual(blipShapes[3])
  expect(getBlipShape(4)).toEqual(blipShapes[0])
  expect(getBlipShape(9)).toEqual(blipShapes[1])
})
