import { doubleEq } from '../../../utils/number'

export const cartesianToPolar = (x, y) => {
  const r = Math.sqrt(x * x + y * y)
  if (x >= 0 && y < 0) {
    return { r, angle: Math.atan( Math.abs(x) / Math.abs(y)) }
  }
  if (x >= 0 && y >= 0) {
    return { r, angle: Math.PI / 2 + Math.atan( Math.abs(y) / Math.abs(x)) }
  }
  if (x < 0 && y >= 0) {
    return { r, angle: Math.PI +  Math.atan( Math.abs(x) / Math.abs(y)) }
  }
  if (x < 0 && y < 0) {
    return { r, angle: Math.PI * 1.5 + Math.atan( Math.abs(y) / Math.abs(x)) }
  }
}

export const polarToCartesian = (angle, r) => {
  if (angle < 0) {
    angle = angle + Math.PI * 2
  }

  if (angle >=0 && angle <= Math.PI * 0.5) {
    return { x: Math.sin(angle) * r,  y: - Math.cos(angle) * r }
  }

  if (angle > Math.PI * 0.5 && angle <= Math.PI) {
    angle = angle - Math.PI * 0.5
    return { x: Math.cos(angle) * r,  y: Math.sin(angle) * r }
  }

  if (angle > Math.PI  && angle <= Math.PI * 1.5) {
    angle = angle - Math.PI
    return { x: - Math.sin(angle) * r,  y: Math.cos(angle) * r }
  }

  if (angle > Math.PI * 1.5  && angle <= Math.PI * 2) {
    angle = angle - Math.PI * 1.5
    return { x: - Math.cos(angle) * r,  y: - Math.sin(angle) * r }
  }
}

export const angleToYByX = angle => {
  if (angle < 0) {
    angle = angle + Math.PI * 2
  }

  if (doubleEq(angle, 0) || doubleEq(angle, Math.PI) || doubleEq(angle, Math.PI * 2)) {
    return 'itself'
  }

  if (doubleEq(angle, Math.PI * 0.5) || doubleEq(angle, Math.PI * 1.5)) {
    return 0
  }

  if (angle > 0 && angle < Math.PI * 0.5) {
    return -1 / Math.tan(angle)
  }

  if (angle > Math.PI * 0.5 && angle <= Math.PI) {
    angle = angle - Math.PI * 0.5
    return Math.tan(angle)
  }

  if (angle > Math.PI  && angle <= Math.PI * 1.5) {
    angle = angle - Math.PI
    return -1 / Math.tan(angle)
  }

  if (angle > Math.PI * 1.5  && angle <= Math.PI * 2) {
    angle = angle - Math.PI * 1.5
    return Math.tan(angle)
  }
}
