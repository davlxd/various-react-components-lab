import * as d3 from 'd3'
import { combineBBoxIntoRect, rectOverlapped, pullOverlappedRectApart, isRectOutOfArc } from '../rect-on-coord'

it('combine of 2 adjcent rects works', () => {
  expect(combineBBoxIntoRect({ x: -2, y: -1, width: 2, height: 1}, { x: 0, y: 0, width: 1, height: 1 })).toEqual({ topLeft: { x: -2, y: -1 }, bottomRight: { x: 1, y: 1 } })
})

it('combine of 2 nesting rects works', () => {
  expect(combineBBoxIntoRect({ x: -5, y: 1, width: 4, height: 3, }, { x: -3, y: 2, width: 1, height: 1, })).toEqual({ topLeft: { x: -5, y: 1 }, bottomRight: { x: -1, y: 4 } })
})

it('judgement of rectOverlapped for 2 adjcent work', () => {
  expect(rectOverlapped({ topLeft: {x1: -2, y1: -1}, bottomRight: {x: 2, y: 1} }, { topLeft: {x: -1, y: 1}, bottomRight: {x: 1, y: 2} })).toBeFalsy()
})

it('judgement of rectOverlapped for 2 adjcent work', () => {
  expect(rectOverlapped({ topLeft: { x: -2, y: -1} , bottomRight: { x: 2, y: 1 } }, { topLeft: { x: -1, y: -1.9 }, bottomRight: { x: 1, y: -0.9 } })).toBeTruthy()
  expect(rectOverlapped({ topLeft: { x: -2, y: -1} , bottomRight: { x: 2, y: 1 } }, { topLeft: { x: -1, y: -2 }, bottomRight: { x: 1, y: -1 } })).toBeFalsy()
})



it('isRectOutOfArc for 2 sectors', () => {
  const arcs = d3.pie()([1, 1])

  let arc = arcs[0]
  expect(isRectOutOfArc({ topLeft: { x: -1, y: -3 }, bottomRight: { x: 2, y: -1 } }, arc.startAngle, arc.endAngle)).toBeTruthy()
  expect(isRectOutOfArc({ topLeft: { x: 0, y: -3 }, bottomRight: { x: 1, y: -1 } }, arc.startAngle, arc.endAngle)).toBeFalsy()
  expect(isRectOutOfArc({ topLeft: { x: 1, y: -4 }, bottomRight: { x: 4, y: -1 } }, arc.startAngle, arc.endAngle)).toBeFalsy()
  expect(isRectOutOfArc({ topLeft: { x: 1, y: 5 }, bottomRight: { x: 4, y: 6 } }, arc.startAngle, arc.endAngle)).toBeFalsy()
  expect(isRectOutOfArc({ topLeft: { x: 0, y: 5 }, bottomRight: { x: 4, y: 6 } }, arc.startAngle, arc.endAngle)).toBeFalsy()
  expect(isRectOutOfArc({ topLeft: { x: -5, y: 4 }, bottomRight: { x: -1, y: 5 } }, arc.startAngle, arc.endAngle)).toBeTruthy()
  expect(isRectOutOfArc({ topLeft: { x: -5, y: -4 }, bottomRight: { x: -1, y: -2 } }, arc.startAngle, arc.endAngle)).toBeTruthy()
  expect(isRectOutOfArc({ topLeft: { x: -5, y: -4 }, bottomRight: { x: 0, y: -2 } }, arc.startAngle, arc.endAngle)).toBeTruthy()

  arc = arcs[1]
  expect(isRectOutOfArc({ topLeft: { x: -1, y: -3 }, bottomRight: { x: 2, y: -1 } }, arc.startAngle, arc.endAngle)).toBeTruthy()
  expect(isRectOutOfArc({ topLeft: { x: 0, y: -3 }, bottomRight: { x: 1, y: -1 } }, arc.startAngle, arc.endAngle)).toBeTruthy()
  expect(isRectOutOfArc({ topLeft: { x: 1, y: -4 }, bottomRight: { x: 4, y: -1 } }, arc.startAngle, arc.endAngle)).toBeTruthy()
  expect(isRectOutOfArc({ topLeft: { x: 1, y: 5 }, bottomRight: { x: 4, y: 6 } }, arc.startAngle, arc.endAngle)).toBeTruthy()
  expect(isRectOutOfArc({ topLeft: { x: 0, y: 5 }, bottomRight: { x: 4, y: 6 } }, arc.startAngle, arc.endAngle)).toBeTruthy()
  expect(isRectOutOfArc({ topLeft: { x: -5, y: 4 }, bottomRight: { x: -1, y: 5 } }, arc.startAngle, arc.endAngle)).toBeFalsy()
  expect(isRectOutOfArc({ topLeft: { x: -5, y: -4 }, bottomRight: { x: -1, y: -2 } }, arc.startAngle, arc.endAngle)).toBeFalsy()
  expect(isRectOutOfArc({ topLeft: { x: -5, y: -4 }, bottomRight: { x: 0, y: -2 } }, arc.startAngle, arc.endAngle)).toBeFalsy()
})

it('isRectOutOfArc for 3 sectors', () => {
  const arcs = d3.pie()([1, 1, 1])
  const rects = [
    { topLeft: { x: -1, y: -3 }, bottomRight: { x: 2, y: -1 } },
    { topLeft: { x: 0, y: -3 }, bottomRight: { x: 1, y: -1 } },
    { topLeft: { x: 1, y: -4 }, bottomRight: { x: 4, y: -1 } },
    { topLeft: { x: 2, y: -2 }, bottomRight: { x: 4, y: 0 } },
    { topLeft: { x: 4, y: 0.1 }, bottomRight: { x: 5, y: Math.tan( ((Math.PI * 2) / 3) - Math.PI / 2 ) * 4 } },
    { topLeft: { x: 2, y: 0 }, bottomRight: { x: 4, y: 2} },
    { topLeft: { x: 2, y: 2 }, bottomRight: { x: 2 / Math.tan( ((Math.PI * 2) / 3) - Math.PI / 2 ), y: 4 } },
    { topLeft: { x: -1, y: 4 }, bottomRight: { x: 1, y: 5 } },
    { topLeft: { x: -4, y: 4 / Math.tan( ((Math.PI * 2) * (2 / 3)) - Math.PI ) }, bottomRight: { x: -2, y: 4 } },
    { topLeft: { x: -4, y: 0 }, bottomRight: { x: -2, y: 2 } },
    { topLeft: { x: -4, y: 0 }, bottomRight: { x: -2, y: 2 / Math.tan( ((Math.PI * 2) * (2 / 3)) - Math.PI ) } },
    { topLeft: { x: -4, y: -2 }, bottomRight: { x: -2, y: -1 } },
    { topLeft: { x: -5, y: -4 }, bottomRight: { x: 0, y: -2 } },
  ]


  const forArc0Expect = arc => ([
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeFalsy(),
    expect => expect(arc).toBeFalsy(),
    expect => expect(arc).toBeFalsy(),
    expect => expect(arc).toBeFalsy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
  ])
  rects.forEach((rect, index) => forArc0Expect(arcs[0])[index](arc => expect(isRectOutOfArc(rect, arc.startAngle, arc.endAngle))))


  const forArc1Expect = arc => ([
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeFalsy(),
    expect => expect(arc).toBeFalsy(),
    expect => expect(arc).toBeFalsy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
  ])
  rects.forEach((rect, index) => forArc1Expect(arcs[1])[index](arc => expect(isRectOutOfArc(rect, arc.startAngle, arc.endAngle))))

  const forArc2Expect = arc => ([
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeFalsy(),
    expect => expect(arc).toBeFalsy(),
    expect => expect(arc).toBeFalsy(),
  ])
  rects.forEach((rect, index) => forArc2Expect(arcs[2])[index](arc => expect(isRectOutOfArc(rect, arc.startAngle, arc.endAngle))))
})


it('isRectOutOfArc for 4 sectors', () => {
  const arcs = d3.pie()([1, 1, 1, 1])
  const rects = [
    { topLeft: {x: -1, y: -3,},  bottomRight: { x: 2,  y: -1 } },
    { topLeft: {x: 0,  y: -3,},  bottomRight: { x: 1,  y: -1 } },
    { topLeft: {x: 1,  y: -2,},  bottomRight: { x: 2,  y: -1 } },
    { topLeft: {x: 1,  y: -1,},  bottomRight: { x: 2,  y: 0  } },
    { topLeft: {x: 1,  y: -1,},  bottomRight: { x: 2,  y: 1  } },
    { topLeft: {x: 1,  y: 0, },  bottomRight: { x: 2,  y: 4  } },
    { topLeft: {x: 1,  y: 2, },  bottomRight: { x: 2,  y: 4  } },
    { topLeft: {x: 0,  y: 2, },  bottomRight: { x: 2,  y: 4  } },
    { topLeft: {x: -2, y: 2, },  bottomRight: { x: 2,  y: 4  } },
    { topLeft: {x: -2, y: 2, },  bottomRight: { x: 0,  y: 4  } },
    { topLeft: {x: -4, y: 2, },  bottomRight: { x: -1, y: 4  } },
    { topLeft: {x: -4, y: 0, },  bottomRight: { x: -2, y: 4  } },
    { topLeft: {x: -4, y: -2,},  bottomRight: { x: -2, y: 4  } },
    { topLeft: {x: -4, y: -2,},  bottomRight: { x: -2, y: 0  } },
    { topLeft: {x: -4, y: -4,},  bottomRight: { x: -2, y: -2 } },
    { topLeft: {x: -1, y: -4,},  bottomRight: { x: 0,  y: -2 } },
  ]

  const forArc0Expect = arc => ([
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeFalsy(),
    expect => expect(arc).toBeFalsy(),
    expect => expect(arc).toBeFalsy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
  ])
  rects.forEach((rect, index) => forArc0Expect(arcs[0])[index](arc => expect(isRectOutOfArc(rect, arc.startAngle, arc.endAngle))))

  const forArc1Expect = arc => ([
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeFalsy(),
    expect => expect(arc).toBeFalsy(),
    expect => expect(arc).toBeFalsy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
  ])
  rects.forEach((rect, index) => forArc1Expect(arcs[1])[index](arc => expect(isRectOutOfArc(rect, arc.startAngle, arc.endAngle))))

  const forArc2Expect = arc => ([
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeFalsy(),
    expect => expect(arc).toBeFalsy(),
    expect => expect(arc).toBeFalsy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
  ])
  rects.forEach((rect, index) => forArc2Expect(arcs[2])[index](arc => expect(isRectOutOfArc(rect, arc.startAngle, arc.endAngle))))

  const forArc3Expect = arc => ([
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeTruthy(),
    expect => expect(arc).toBeFalsy(),
    expect => expect(arc).toBeFalsy(),
    expect => expect(arc).toBeFalsy(),
  ])
  rects.forEach((rect, index) => forArc3Expect(arcs[3])[index](arc => expect(isRectOutOfArc(rect, arc.startAngle, arc.endAngle))))
})
