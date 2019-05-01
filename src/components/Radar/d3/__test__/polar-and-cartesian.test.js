import { cartesianToPolar, polarToCartesian, angleToYByX } from '../polar-and-cartesian'

it('cartesianToPolar', () => {
  expect(cartesianToPolar(1, -1).r).toBeCloseTo(Math.sqrt(2), 10)
  expect(cartesianToPolar(1, -1).angle).toEqual(Math.PI * 0.25)
  expect(cartesianToPolar(1, -1).angle).toEqual(Math.PI * 0.25)
  expect(cartesianToPolar(1, 1).angle).toEqual(Math.PI * 0.75 )
  expect(cartesianToPolar(-1, 1).angle).toEqual(Math.PI * 1.25)
  expect(cartesianToPolar(-1, -1).angle).toEqual(Math.PI * 1.75)

  expect(cartesianToPolar(-1, 0).angle).toEqual(Math.PI * 1.5)
  expect(cartesianToPolar(0, -1).angle).toEqual(0)

  expect(cartesianToPolar(0.5, -1).angle).toEqual(Math.atan(1 / 2))
  expect(cartesianToPolar(0.5, 1).angle).toEqual(Math.PI - Math.atan(1 / 2))
})

it('polarToCartesian', () => {
  expect(polarToCartesian(- Math.PI / 8, 1).x).toBeCloseTo(-Math.sin(Math.PI / 8), 10)
  expect(polarToCartesian(- Math.PI / 8, 1).y).toBeCloseTo(-Math.cos(Math.PI / 8), 10)

  expect(polarToCartesian(0, 1).x).toBeCloseTo(0, 10)
  expect(polarToCartesian(0, 1).y).toBeCloseTo(-1, 10)

  expect(polarToCartesian(Math.PI * 0.9, 2).x).toBeCloseTo(Math.cos(Math.PI * 0.4) * 2, 10)
  expect(polarToCartesian(Math.PI * 0.9, 2).y).toBeCloseTo(Math.sin(Math.PI * 0.4) * 2, 10)

  expect(polarToCartesian(Math.PI * 1.25, 2).x).toBeCloseTo(- Math.sin(Math.PI * 0.25) * 2, 10)
  expect(polarToCartesian(Math.PI * 1.25, 2).y).toBeCloseTo(Math.sin(Math.PI * 0.25) * 2, 10)

  expect(polarToCartesian(Math.PI * 1.5, 3).x).toBeCloseTo(-3, 10)
  expect(polarToCartesian(Math.PI * 1.5, 3).y).toBeCloseTo(0, 10)
})

it('angleToYByX', () => {
  expect(angleToYByX(Math.PI)).toEqual('itself')
  expect(angleToYByX(0)).toEqual('itself')
  expect(angleToYByX(Math.PI * 2)).toEqual('itself')

  expect(angleToYByX(Math.PI * 0.5)).toEqual(0)
  expect(angleToYByX(Math.PI * 1.5)).toEqual(0)

  expect(angleToYByX(Math.PI * 0.25)).toBeCloseTo(-1, 10)
  expect(angleToYByX(Math.PI * 1.25)).toBeCloseTo(-1, 10)

  expect(angleToYByX(Math.PI * 0.75)).toBeCloseTo(1, 10)
  expect(angleToYByX(Math.PI * 1.75)).toBeCloseTo(1, 10)

})
