import { quadratic } from '../equation'

it('quadratic', () => {
  expect(quadratic(1, -3, 2)[0]).toBeCloseTo(1, 10)
  expect(quadratic(1, -3, 2)[1]).toBeCloseTo(2, 10)

  expect(quadratic(3, -7, 4)[0]).toBeCloseTo(1, 10)
  expect(quadratic(3, -7, 4)[1]).toBeCloseTo(4/3, 10)
})
