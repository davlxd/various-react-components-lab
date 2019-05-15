import * as d3 from 'd3'


const PER_YEAR_HEIGHT = 100
const height = howManyYears => (howManyYears + 1) * PER_YEAR_HEIGHT

const initateSvg = (divId, svgId, width, howManyYears) => {
  const _divId = `#${divId}`
  const _svgId = `#${svgId}`

  d3.select(_divId).select(_svgId).remove()

  const svg = d3.select(_divId).append('svg')
                               .attr('id', svgId)
                               .attr('width', width)
                               .attr('height', height(howManyYears))
  return svg
}

const drawAxis = (svg, yearSeries, width) => {
  const MARGIN = 50
  svg.append('defs')
       .append('marker')
         .attr('id', 'arrow-head')
         .attr('markerWidth', 10)
         .attr('markerHeight', 8)
         .attr('refX', 5)
         .attr('refY', 4)
           .append('path')
             .attr('d', 'M1,8 L5,0 L9,8 L5,5 Z')
  const g = svg.append('g')
                 .attr('class', 'axis')
  g.append('line')
     .attr('class', 'axis')
     .attr('x1', MARGIN)
     .attr('y1', height(yearSeries.length) - MARGIN)
     .attr('x2', MARGIN)
     .attr('y2', MARGIN)
     .attr('stroke', 'black')
     .attr('stroke-width', 4)
     .attr('marker-end', 'url(#arrow-head)')

  const eachScale = g.selectAll('line.scale')
                     .data(yearSeries.reverse())
                     .enter()
                       .append('g')
                       .attr('class', 'scale')

  eachScale.append('line')
          .attr('x1', MARGIN - 10)
          .attr('y1', (d, i) => MARGIN + (i + 0.5) * PER_YEAR_HEIGHT)
          .attr('x2', MARGIN + 10)
          .attr('y2', (d, i) => MARGIN + (i + 0.5) * PER_YEAR_HEIGHT)
          .attr('stroke-width', 1)
          .attr('stroke', 'black')

  const eachScaleText = eachScale.append('text')
                                 .attr('x', 0)
                                 .attr('y', (d, i) => MARGIN + (i + 0.5) * PER_YEAR_HEIGHT)
                                 .text(d => d)
  const scaleTextBBox = index => eachScaleText.nodes()[index].getBBox()

  eachScaleText.attr('dy', (d, i) => scaleTextBBox(i).height / 4)
}


export { initateSvg, drawAxis }
