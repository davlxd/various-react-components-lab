import * as d3 from 'd3'
const moment = require('moment')


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

const drawAxis = (svg, width, yearSeries) => {
  const ARROW_HEAD_WIDTH = 8
  const ARROW_HEAD_HEIGHT = 8
  const AXIS_WIDTH = 4
  const SCALE_MARKER_WIDTH = 15

  svg.append('defs')
       .append('marker')
         .attr('id', 'arrow-head')
         .attr('markerWidth', ARROW_HEAD_WIDTH)
         .attr('markerHeight', ARROW_HEAD_HEIGHT)
         .attr('refX', ARROW_HEAD_WIDTH / 2)
         .attr('refY', ARROW_HEAD_HEIGHT / 2)
           .append('path')
             .attr('d', 'M0,8 L4,0 L8,8 L4,5 Z')

  const g = svg.append('g')
                 .attr('class', 'axis')

  const axisLine = g.append('line')
                    .attr('class', 'axis')
                    .attr('x1', AXIS_WIDTH / 2)
                    .attr('y1', height(yearSeries.length))
                    .attr('x2', AXIS_WIDTH / 2)
                    .attr('y2', ARROW_HEAD_HEIGHT * 2)
                    .attr('stroke', 'black')
                    .attr('stroke-width', AXIS_WIDTH)
                    .attr('marker-end', 'url(#arrow-head)')

  const eachScale = g.selectAll('line.scale')
                     .data(yearSeries.reverse())
                     .enter()
                       .append('g')
                       .attr('class', 'scale')

  const eachScaleMarker = eachScale.append('line')
                                   .attr('x1', 0)
                                   .attr('y1', (d, i) => (i + 1) * PER_YEAR_HEIGHT)
                                   .attr('x2', SCALE_MARKER_WIDTH)
                                   .attr('y2', (d, i) => (i + 1) * PER_YEAR_HEIGHT)
                                   .attr('stroke-width', 1)
                                   .attr('stroke', 'black')

  const eachScaleText = eachScale.append('text')
                                 .attr('x', 0)
                                 .attr('y', (d, i) => (i + 1) * PER_YEAR_HEIGHT)
                                 .text(d => d)
  const scaleTextBBox = index => eachScaleText.nodes()[index].getBBox()

  eachScaleText.attr('dy', (d, i) => scaleTextBBox(i).height / 4)
  axisLine.attr('x1', AXIS_WIDTH / 2 + scaleTextBBox(0).width + SCALE_MARKER_WIDTH / 2)
          .attr('x2', AXIS_WIDTH / 2 + scaleTextBBox(0).width + SCALE_MARKER_WIDTH / 2)
  eachScaleMarker.attr('x1', AXIS_WIDTH / 2 + scaleTextBBox(0).width)
                 .attr('x2', AXIS_WIDTH / 2 + scaleTextBBox(0).width + SCALE_MARKER_WIDTH)

  return AXIS_WIDTH + scaleTextBBox(0).width + SCALE_MARKER_WIDTH / 2
}


const rangesToMonthDiff = (ranges, maxYear) => ranges.map(({ from, to }) => ({
  monthDiffWithMaxYear: moment('' + maxYear + '-01').diff(moment(to), 'months'),
  monthDiffWithEachOther: moment(to).diff(moment(from), 'months')
}))

const drawDescBackground = (svg, axisRightBoundary, width, yearSeries, ranges) => {
  const maxYear = Math.max(...yearSeries)
  const maxYearY = PER_YEAR_HEIGHT
  const PER_MOMTH_HEIGHT = PER_YEAR_HEIGHT / 12

  const g = svg.append('g').attr('class', 'desc')

  const eachLinearGradient = svg.select('defs')
                                .selectAll('linearGradient.desc-rect')
                                .data(ranges)
                                .enter()
                                  .append('linearGradient')
                                  .attr('class', 'desc-rect')
                                  .attr('id', (d, i) => `lineargradient-desc-rect-${i}`)

  eachLinearGradient.append('stop')
                    .attr('offset', '10%')
                    .attr('stop-color', (d, i) => d3.schemePastel1[i])
                    .attr('stop-opacity', 0)
  eachLinearGradient.append('stop')
                    .attr('offset', '70%')
                    .attr('stop-color', (d, i) => d3.schemePastel1[i])
                    .attr('stop-opacity', 0.6)
  eachLinearGradient.append('stop')
                    .attr('offset', '100%')
                    .attr('stop-color', (d, i) => d3.schemePastel1[i])
                    .attr('stop-opacity', 0.6)


  const eachDesc = g.selectAll('rect.range')
                    .data(rangesToMonthDiff(ranges, maxYear))
                    .enter()
                      .append('g')
                      .attr('class', 'range')

  const COLOR_PADDING_RIGHT = 10
  eachDesc.append('rect')
          .attr('id', (d, i) => `desc-rect-${i}`)
          .attr('x', axisRightBoundary)
          .attr('y', d => maxYearY + d.monthDiffWithMaxYear * PER_MOMTH_HEIGHT)
          .attr('width', width - axisRightBoundary - COLOR_PADDING_RIGHT)
          .attr('height', d => d.monthDiffWithEachOther * PER_MOMTH_HEIGHT)
          .style('fill',  (d, i) => `url(#lineargradient-desc-rect-${i})`)
  eachDesc.append('line')
          .attr('class', 'ceiling')
          .attr('x1', axisRightBoundary)
          .attr('y1', d => maxYearY + d.monthDiffWithMaxYear * PER_MOMTH_HEIGHT)
          .attr('x2', width)
          .attr('y2', d => maxYearY + d.monthDiffWithMaxYear * PER_MOMTH_HEIGHT)
          .attr('stroke-width', 0.5)
          .attr('stroke', 'black')
  eachDesc.append('line')
          .attr('class', 'floor')
          .attr('x1', axisRightBoundary)
          .attr('y1', d => maxYearY + (d.monthDiffWithMaxYear + d.monthDiffWithEachOther) * PER_MOMTH_HEIGHT)
          .attr('x2', width)
          .attr('y2', d => maxYearY + (d.monthDiffWithMaxYear + d.monthDiffWithEachOther) * PER_MOMTH_HEIGHT)
          .attr('stroke-width', 0.5)
          .attr('stroke', 'black')

}


export { initateSvg, rangesToMonthDiff, drawAxis, drawDescBackground }
