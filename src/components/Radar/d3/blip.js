import * as d3 from 'd3'

export const blipShapes = [
  d3.symbol().size(500).type(d3.symbolCircle)(),
  'M 6.34 -7.01 l 5.85 10.92 s 3.38 7.8 -4.732 8.372 l -14.3 0 s -8.528 -.364 -4.524 -8.476 l 5.876 -10.92 s 5.85 -10.4 11.7 0 z',
  'M-5,-13 h10 a8,8 0 0 1 8,8 v10 a8,8 0 0 1 -8,8 h-10 a8,8 0 0 1 -8,-8 v-10 a8,8 0 0 1 8,-8 z',
  'M5.657,-12.728 l7,7 a8,8 0 0 1 0,11.3 l-7,7 a8,8 0 0 1 -11.3,0 l-7,-7 a8,8 0 0 1 0,-11.3 l7,-7 a8,8 0 0 1 11.3,0 z',
]

export const getBlipShape = index => {
  return blipShapes[index % blipShapes.length]
}
