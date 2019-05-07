import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'

import * as d3 from 'd3'

import { groupBy } from '../../utils/array'

import forceWithinQuandrant from './d3/force-within-quadrant'
import forcePlaceholdingCirclesTailingDad from './d3/force-placeholding-circles-tailing-dad'

const styles = theme => ({
  root: {
    backgroundColor: '#f3f9fe',
    position: 'absolute',
    top: '100px',
    left: '100px',
  },
})

let count = 0

class Radar extends Component {
  constructor(props) {
    super(props)
    const { width, height } = this.props.ui

    this.divId = `radar-chart-div-${count++}`
    this.svgId = `radar-chart-${count++}`
    this.radius = Math.min(width/2, height/2) * 0.95
    this.state = {
    }
  }

  placeHolder() {
    const { svgId } = this
    const { ui, data } = this.props
    const { width, height } = ui

    const chart = d3.select(`#${svgId}`)
                    .attr('width', width)
                    .attr('height', height)

    const bar = chart.selectAll('g')
                     .data(data)
                     .enter().append('g')
                       .attr('transform', (d, i) => `translate(0, ${i * 4})`);
    bar.append('rect')
       .attr('width', d => d)
       .attr('height', 4 - 1);
  }

  initateSvg() {
    const { divId, svgId } = this
    const { width, height } = this.props.ui
    const _divId = `#${divId}`
    const _svgId = `#${svgId}`

    d3.select(_divId).select(_svgId).remove()

    const svg = d3.select(_divId).append('svg')
                                 .attr('id', svgId)
                                 .attr('width', width)
                                 .attr('height', height)
    const g = svg.append('g')
                 .attr('transform', `translate(${width/2}, ${height/2})`)
    return { svg, g }
  }

  drawBackgroundCirclesAndAxis(svg, g) {
    const { radius } = this
    const { misc, blips } = this.props.data

    const sectorNames = Object.keys(groupBy(blips, 'sector'))
    const sectorCount = sectorNames.length

    const arcs = d3.pie()(new Array(sectorCount).fill(1))

    const arcConfig = (annulusIndex, focus = false) => { // Relationship between padAngle and radius see: https://github.com/d3/d3-shape#arc_padAngle
      const cornerRadiusValue = annulusIndex === 2 ? 4 : 0
      let padAngleValue = (1.0 / (annulusIndex + 1)) * 0.01
      let outerRadiusValue = radius / 3 * (annulusIndex + 1)
      let innerRadiusValue = 3

      if (focus) {
        innerRadiusValue = innerRadiusValue  + 14
        padAngleValue = padAngleValue * 14
        outerRadiusValue = outerRadiusValue + 14
      }
      return d3.arc().padAngle(padAngleValue).innerRadius(innerRadiusValue).cornerRadius(cornerRadiusValue).outerRadius(outerRadiusValue)
    }
    //TODO split mouseover out of this function

    const newBlipCoordinatesOnFocus = (x, y) => {
      const r = Math.sqrt(x * x + y * y)
      const sin = y / r
      const cos = x / r
      const newR = r + 14
      return { x: sin * newR, y: cos * newR}
    }
    const sectorG = g.append('g').attr('class', 'background-circle')
                                   .selectAll('path')
                                   .data(arcs)
                                   .enter()
                                     .append('g')
                                     .attr('class', (d, i) => `sector-${i}`)

    sectorG.selectAll('path')
             .data((d, i) => [{d, i}, {d, i}, {d, i}])
             .enter().append('path')
             .attr('class', ({ d }, i) => `annulus-${i}`)
             .style('fill', '#DBDBDB')
             .attr('d', ({ d }, i) => arcConfig(i)(d) )
             .style('fill-opacity', (d, i) => (0.7 - 0.2 * i))
             .on('mouseover', ({ d, i }, j) => {  // i is sector index, j is annulusIndex
               sectorG.selectAll(`.sector-${i} path`)
                        .transition().duration('200')
                        .attr('d', ({ d }, i) => arcConfig(i, true)(d) )
                        .style('fill-opacity', (d, i) => (1 - 0.2 * i))
               // g.selectAll(`.blips-in-sector-${i} .blip-symbol`)
               //   .transition().duration('200')
               //   .attr('cx', function(){ return newBlipCoordinatesOnFocus(d3.select(this).attr('cx'), d3.select(this).attr('cy')).x })
               //   .attr('cy', function(){ return newBlipCoordinatesOnFocus(d3.select(this).attr('cx'), d3.select(this).attr('cy')).y })
               // g.selectAll(`.blips-in-sector-${i} .blip-text`)
               //   .transition().duration('200')
               //   .attr('x', d => d.initialX(d.radius + 14))
               //   .attr('y', d => d.initialY(d.radius + 14))
             })
             .on('mouseout', ({ d, i }, j) => {
               sectorG.selectAll(`.sector-${i} path`)
                        .transition().duration('200')
                        .attr('d', ({ d }, i) => arcConfig(i, false)(d) )
                        .style('fill-opacity', (d, i) => (0.7 - 0.2 * i))
               // g.selectAll(`.blips-in-sector-${i} .blip-symbol`)
               //   .transition().duration('200')
               //   .attr('cx', d => d.initialX(d.radius))
               //   .attr('cy', d => d.initialY(d.radius))
               // g.selectAll(`.blips-in-sector-${i} .blip-text`)
               //   .transition().duration('200')
               //   .attr('x', d => d.initialX(d.radius))
               //   .attr('y', d => d.initialY(d.radius))
             })
    return { arcs }
  }

  enhanceBlipsData(blips) {
    const { radius } = this

    const blipShapes = [ { shapeName: 'rect', }, { shapeName: 'circle', } ]

    const uniqueSectorNames = [...new Set(blips.map(blip => blip.sector))]
    const minAndMaxOfBlipScore = blips.map(blip => blip.score).reduce((acc, cur) => [Math.min(acc[0], cur), Math.max(acc[1], cur)], [Infinity, -Infinity])
    const scoreToRadiusScale = d3.scaleLinear().domain(minAndMaxOfBlipScore).range([radius, 50])

    return blips.map(blip => {
      const sectorIndex = uniqueSectorNames.indexOf(blip.sector)
      const r = scoreToRadiusScale(blip.score)
      return {
        ...blip,
        r,
        sectorIndex,
        ...blipShapes[sectorIndex % blipShapes.length],
        x: 0,
        y: 0,
      }
    })
  }

  drawBlips(svg, g, arcs) {
    const { misc, blips } = this.props.data

    const color = d3.scaleOrdinal(d3.schemeCategory10)

    console.log(this.enhanceBlipsData(blips))
    const enhancedBlips = this.enhanceBlipsData(blips)

    const eachBlip = g.append('g')
                      .attr('class', 'blips')
                      .selectAll('g.blip')
                      .data(enhancedBlips)
                      .enter()
                        .append('g')
                        .attr('class', 'blip')
                        .attr('sector-name', d => d.sector)
                        .attr('sector-index', d => d.sectorIndex)

    const eachBlipSymbol = eachBlip.append(d => document.createElementNS(d3.namespaces.svg, d.shapeName))
                                   .attr('class', 'blip-element blip-symbol')
                                   .style('fill', d => color(d.sectorIndex))
                                   .attr('width', 22)
                                   .attr('height', 22)
                                   .attr('r', 12)
                                   .attr('rx', '0.4em')
                                   .attr('ry', '0.4em')

    const eachBlipText = eachBlip.append('text')
                                 .attr('class', 'blip-element blip-text')
                                 .text(d => d.name)

    const blipSymbolBBox = index => eachBlipSymbol.nodes()[index].getBBox()
    const blipTextBBox = index => eachBlipText.nodes()[index].getBBox()

    const positionSymbolAndText = () => {
      eachBlipSymbol.attr('x', ({ x }, i) => x - blipSymbolBBox(i).width / 2)
                    .attr('y', ({ y }, i) => y - blipSymbolBBox(i).height / 2)
                    .attr('cx', ({ x }) => x)
                    .attr('cy', ({ y }) => y)

      eachBlipText.attr('x', ({ sectorIndex, x }, i) => (sectorIndex === 0 || sectorIndex === 1) ? (x + blipSymbolBBox(i).width / 2) : (x - blipTextBBox(i).width - blipSymbolBBox(i).width / 2))
                  .attr('y', ({ sectorIndex, y }, i) => (sectorIndex === 1 || sectorIndex === 2) ? (y + blipTextBBox(i).height / 2) : y)

      eachPlaceholdingCircle.attr('cx', ({ x }) => x)
                            .attr('cy', ({ y }) => y)
    }

    const simulation = d3.forceSimulation(enhancedBlips)
                         .force('radial', d3.forceRadial(d => d.r))
                         .force('in-quandrant', forceWithinQuandrant())
                         .on('tick', positionSymbolAndText)
                         .alphaDecay(0.01)

    const BLIP_COLLIDE_RADIUS_MARGIN = 10
    const addPlaceholdingCircleForRadialCollideForce = blips => blips.flatMap((blip, index) => {
      blip.radius = Math.max(blipSymbolBBox(index).width, blipSymbolBBox(index).height) / 2 + BLIP_COLLIDE_RADIUS_MARGIN
      return [
        blip,
        ...[...Array(Math.floor(blipTextBBox(index).width / blipTextBBox(index).height)).keys()].map(nthForBlip => ({
          dad: blip,
          isPlaceholder: true,
          nth: nthForBlip,
          radius: blipTextBBox(index).height / 2 ,
          x: 0,
          y: 0,
        }))
      ]
    })
    const withPlaceholdingCircles = addPlaceholdingCircleForRadialCollideForce(enhancedBlips)

    const eachPlaceholdingCircle = g.select('g.blips').selectAll('g.fake-circle')
                                                      .data(withPlaceholdingCircles.filter(d => d.isPlaceholder))
                                                      .enter()
                                                        .append('g')
                                                        .attr('class', 'fake-circle')
                                                        .append('circle')
                                                        .attr('r', d => d.radius)
                                                        .attr('cx', d => d.x)
                                                        .attr('cy', d => d.x)
                                                        .attr('fill-opacity', 0)
                                                        .attr('stroke', '#000000')
                                                        .attr('stroke-opacity', 0.1)
                                                        .attr('dad-name', d => d.dad.name)

    const simulation2 = d3.forceSimulation(withPlaceholdingCircles)
                         .force('collide', d3.forceCollide(d => d.radius).strength(0.9))
                         .force('position-placeholding-circles', forcePlaceholdingCirclesTailingDad())
                         .on('tick', positionSymbolAndText)
                         .alphaDecay(0.01)
  }


  componentDidMount() {
    const { svg, g } = this.initateSvg()
    const { arcs } = this.drawBackgroundCirclesAndAxis(svg, g)
    this.drawBlips(svg, g, arcs)
  }

  componentWillMount() {
  }

  render() {
    const { classes } = this.props
    const { divId, svgId } = this
    return (
      <div id={divId} className={classes.root}>
        <svg id={svgId}></svg>
      </div>
    )
  }
}


export default withStyles(styles)(Radar)
