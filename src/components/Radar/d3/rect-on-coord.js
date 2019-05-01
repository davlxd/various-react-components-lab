import { cartesianToPolar, polarToCartesian, angleToYByX } from './polar-and-cartesian'
import { doubleEq } from '../../../utils/number'
import { quadratic } from './equation'

export const combineBBoxIntoRect = (a, b, pinPoint) => ({
  topLeft: { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y) },
  bottomRight: { x: Math.max(a.x + a.width, b.x + b.width), y: Math.max(a.y + a.height, b.y + b.height) },
  pinPoint,
})

export const rectOverlapped = (rect1, rect2) => rect1.topLeft.x < rect2.bottomRight.x && rect1.bottomRight.x > rect2.topLeft.x && rect1.topLeft.y < rect2.bottomRight.y && rect1.bottomRight.y > rect2.topLeft.y


export const pullOverlappedRectApart = (thisRect, moveThisRect, thatRect, moveThatRect) => {
  const offsetXForThisGoesToLeft = thisRect.x2 - thatRect.x1
  const offsetXForThisGoesToRight = thatRect.x2 - thisRect.x1
  const offsetYForThisGoesUp = thisRect.y2 - thatRect.y1
  const offsetYForThisGoesDown = thatRect.y2 - thisRect.y1

  return [
    {
      offset: offsetXForThisGoesToLeft,
      action: () => {
        moveThisRect(- offsetXForThisGoesToLeft/2, 0)
        moveThatRect(offsetXForThisGoesToLeft/2, 0)
      }
    },
    {
      offset: offsetXForThisGoesToRight,
      action: () => {
        moveThisRect(offsetXForThisGoesToRight/2, 0)
        moveThatRect(-offsetXForThisGoesToRight/2, 0)
      }
    },
    {
      offset: offsetYForThisGoesUp,
      action: () => {
        moveThisRect(0, -offsetYForThisGoesUp/2)
        moveThatRect(0, offsetYForThisGoesUp/2)
      }
    },
    {
      offset: offsetYForThisGoesDown,
      action: () => {
        moveThisRect(0, offsetYForThisGoesDown/2)
        moveThatRect(0, -offsetYForThisGoesDown/2)
      }
    },
  ].sort((firstEl, secondEl) => firstEl.offset - secondEl.offset)[0].action
}

export const isRectOutOfArc = (rect, startAngle, endAngle) => {
  const apexes = [rect.topLeft, { x: rect.bottomRight.x, y: rect.topLeft.y }, rect.bottomRight, { x: rect.topLeft.x, y: rect.bottomRight.y }]
  return apexes.map(({ x, y }) => cartesianToPolar(x, y).angle)
               .map(angle => doubleEq(endAngle, 2 * Math.PI) && doubleEq(angle, 0) ? 2 * Math.PI : angle)
               .some(angle => angle < startAngle || angle > endAngle)
}

export const isPointOutOfArc = (point, startAngle, endAngle) => isRectOutOfArc({ topLeft: point, bottomRight: point }, startAngle, endAngle)

const adjustPinPointR = (rect, theApexCloserToOrigin, delta) => {
  return Math.max(
    Math.sqrt(Math.pow(rect.pinPoint.x - theApexCloserToOrigin.x, 2) + Math.pow(rect.pinPoint.y - theApexCloserToOrigin.y, 2)),
    Math.sqrt(Math.pow(rect.pinPoint.x, 2) + Math.pow(rect.pinPoint.y, 2)) + delta
  )
}

export const restrictRectWithinArc = (rect, startAngle, endAngle, delta = 0) => { // TODO this function is not well tested
  const rectPinPointAngle = cartesianToPolar(rect.pinPoint.x, rect.pinPoint.y).angle

  const angleDistance = distance => Math.abs(distance) > Math.PI ? Math.abs(Math.abs(distance) - Math.PI * 2) : Math.abs(distance)
  const closerBoundary = angleDistance(rectPinPointAngle - startAngle) < angleDistance(rectPinPointAngle - endAngle) ? startAngle : endAngle

  const apexes = [rect.topLeft, { x: rect.bottomRight.x, y: rect.topLeft.y }, rect.bottomRight, { x: rect.topLeft.x, y: rect.bottomRight.y }]
  let theApexShouldAlignBoundary = apexes[0], theApexCloserToOrigin = apexes[0]
  // TODO the following theApexCloserToOrigin selection is buggy
  if (closerBoundary >= 0 && closerBoundary <= Math.PI * 0.5) {
    theApexShouldAlignBoundary = closerBoundary === startAngle ? apexes[0] : apexes[2]
    theApexCloserToOrigin = apexes[3]
  } else if (closerBoundary >= Math.PI * 0.5 && closerBoundary < Math.PI) {
    theApexShouldAlignBoundary = closerBoundary === startAngle ? apexes[1] : apexes[3]
    theApexCloserToOrigin = apexes[0]
  } else if (closerBoundary >= Math.PI && closerBoundary < Math.PI * 1.5) {
    theApexShouldAlignBoundary = closerBoundary === startAngle ? apexes[2] : apexes[0]
    theApexCloserToOrigin = apexes[1]
  } else if (closerBoundary >= Math.PI * 1.5 && closerBoundary <= Math.PI * 2) {
    theApexShouldAlignBoundary = closerBoundary === startAngle ? apexes[3] : apexes[1]
    theApexCloserToOrigin = apexes[2]
  }
  console.log('theApexShouldAlignBoundary', theApexShouldAlignBoundary)
  console.log('theApexCloserToOrigin', theApexCloserToOrigin)

  const theApexOffsetX = rect.pinPoint.x - theApexShouldAlignBoundary.x,
        theApexOffsetY = rect.pinPoint.y - theApexShouldAlignBoundary.y
  const rectPinPointR = adjustPinPointR(rect, theApexCloserToOrigin, delta)
  const yInXCoefficient = angleToYByX(closerBoundary)

  console.log(closerBoundary, yInXCoefficient, rectPinPointR)
  const theApexAlignedWithBoundary = { x: 0, y: 0 }
  if (yInXCoefficient === 'itself') {
    const [y1, y2] = quadratic(
      1,
      2 * theApexOffsetY,
      theApexOffsetX * theApexOffsetX + theApexOffsetY * theApexOffsetY - rectPinPointR * rectPinPointR
    )
    theApexAlignedWithBoundary.x = 0
    theApexAlignedWithBoundary.y = doubleEq(closerBoundary, 0) || doubleEq(closerBoundary, Math.PI * 2) ? y1 : y2
  } else {
    const [x1, x2] = quadratic(
      yInXCoefficient * yInXCoefficient + 1,
      2 * theApexOffsetX + 2 * theApexOffsetY * yInXCoefficient,
      theApexOffsetX * theApexOffsetX + theApexOffsetY * theApexOffsetY - rectPinPointR * rectPinPointR
    )

    if (closerBoundary >= 0 && closerBoundary <= Math.PI) {
      theApexAlignedWithBoundary.x = x2 >= 0 ? x2 : NaN
    } else {
      theApexAlignedWithBoundary.x = x1 <= 0 ? x1 : NaN
    }
    theApexAlignedWithBoundary.y = theApexAlignedWithBoundary.x * yInXCoefficient
  }

  console.log('theApexAlignedWithBoundary', theApexAlignedWithBoundary)
  return { offsetX: theApexAlignedWithBoundary.x - theApexShouldAlignBoundary.x, offsetY: theApexAlignedWithBoundary.y - theApexShouldAlignBoundary.y }
}



export const restrictRectWithinArc2 = (rect, startAngle, endAngle, delta = 0) => {
  const pinPointPolar = cartesianToPolar(rect.pinPoint.x, rect.pinPoint.y)
  const pinPointNewCartesian = polarToCartesian(( startAngle + endAngle) / 2, pinPointPolar.r + delta)
  return { offsetX: pinPointNewCartesian.x - rect.pinPoint.x, offsetY: pinPointNewCartesian.y - rect.pinPoint.y }
}
