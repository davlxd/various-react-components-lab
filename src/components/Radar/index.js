import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'

import * as d3 from 'd3'

import { groupBy } from '../../utils/array'

import { getBlipShape, } from './d3/blip'
import { combineBBoxIntoRect, rectOverlapped, isRectOutOfArc, restrictRectWithinArc, restrictRectWithinArc2 } from './d3/rect-on-coord'
import { cartesianToPolar, polarToCartesian, } from './d3/polar-and-cartesian'

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

  // blips: [
  //   { sector: 'UnderWit', name: 'Unmistakeable', score: 8, detail: '' },
  //   { sector: 'UnderWit', name: 'Unequivocal', score: 8 },
  //   { sector: 'UnderWit', name: 'Showing', score: 8 },
  //   { sector: 'Sightworthy', name: 'Illustration', score: 8 },
  //   { sector: 'Sightworthy', name: 'Silkworms', score: 8 },
  //   { sector: 'UPAS', name: 'With', score: 6 },
  // ]
  drawBlips(svg, g, arcs) {
    const { misc, blips } = this.props.data
    const { radius } = this

    const minAndMax = blips.map(blip => blip.score).reduce((acc, cur) => [Math.min(acc[0], cur), Math.max(acc[1], cur)], [Infinity, -Infinity])
    const scoreScale = d3.scaleLinear().domain(minAndMax).range([radius, 10])

    let blipsInGroups = Object.values(groupBy(blips, 'sector'))
    blipsInGroups = blipsInGroups.map((sectorBlips, sectorIndex) => sectorBlips.map((blip, index) => {
      const r = scoreScale(blip.score)
      return {
        ...blip,
        sectorIndex,
        r,
        x: Math.sin(Math.PI/4) * r * (sectorIndex < 2 ? 1 : -1),
        y: Math.sin(Math.PI/4) * r * (sectorIndex > 0 && sectorIndex < 3 ? 1 : -1),
      }
    }))

    const color = d3.scaleOrdinal(d3.schemeCategory10)

    const blipsInsector = g.selectAll('g.blips-in-sector')
                           .data(blipsInGroups)
                           .enter()
                             .append('g')
                             .attr('class', (d, i) => `blips-in-sector-${i}`)

    const eachBlip = blipsInsector.selectAll('g.blip')
                                  .data(d => d)
                                  .enter()
                                    .append('g')
                                    .attr('class', 'blip')


    const eachBlipSymbol = eachBlip.append('path')
                                    .attr('class', 'blip-element blip-symbol')
                                    .attr('d', d => getBlipShape(d.sectorIndex))
                                    .style('fill', d => color(d.sectorIndex))
                                    .attr('x', d => d.x)
                                    .attr('y', d => d.y)
                                    .attr('transform', d => `translate(${d.x}, ${d.y}) scale(1)`)

    const eachBlipText = eachBlip.append('text')
                                 .attr('class', 'blip-element blip-text')
                                 .attr('x', d => d.x)
                                 .attr('y', d => d.y)
                                 .text(d => d.name)

    return { eachBlipSymbol, eachBlipText }
  }


  distributeBlips(eachBlipSymbol, eachBlipText, arcs) {
    const simulation = d3.forceSimulation().alphaDecay(0.1)

    const positionTextNextToSymbol = () => {
      eachBlipText.nodes().forEach((node, index) => {
        const symboleNode = eachBlipSymbol.nodes()[index]
        const d3node = d3.select(node)
        const data = d3node.data()[0]
        if (data.sectorIndex === 0 || data.sectorIndex === 1) { //TODO not necessarily 4 sectors
          d3node.attr('x', Number(d3node.attr('x')) + symboleNode.getBBox().width / 2)
        } else {
          d3node.attr('x', Number(d3node.attr('x')) - node.getBBox().width - symboleNode.getBBox().width / 2 - 2)
        }
        if (data.sectorIndex === 1 || data.sectorIndex === 2) {
          d3node.attr('y', Number(d3node.attr('y')) + node.getBBox().height / 2)
        }
      })
    }

    const blipRect = (symbolNode, textNode) => {
      const d3SymbolNode = d3.select(symbolNode)

      const textBBox = textNode.getBBox()
      const symbolBBox = symbolNode.getBBox()
      symbolBBox.x = symbolBBox.x + Number(d3SymbolNode.attr('x'))
      symbolBBox.y = symbolBBox.y + Number(d3SymbolNode.attr('y'))
      return combineBBoxIntoRect(textBBox, symbolBBox, { x: Number(d3SymbolNode.attr('x')) , y: Number(d3SymbolNode.attr('y')) })
    }

    const rotateAngle = (polar, towrad) => {
      const SPREAD_ARC_LENGTH = 30

      let newAngle
      if (towrad === 'decrease') {
        newAngle = polar.angle - (SPREAD_ARC_LENGTH / polar.r)
        if (newAngle < 0) {
          newAngle = newAngle + Math.PI * 2
        }
      }
      if (towrad === 'increase') {
        newAngle = polar.angle + (SPREAD_ARC_LENGTH / polar.r)
        if (newAngle >= Math.PI) {
          newAngle = newAngle - Math.PI * 2
        }
      }
      return newAngle
    }

    const spreadBlips = () => {
      const symbolsAndTexts = eachBlipSymbol.nodes().map((symbolNode, index) => ({ symbolNode, textNode: eachBlipText.nodes()[index] }))

      symbolsAndTexts.forEach(({ symbolNode, textNode }) => {
        const data = d3.select(symbolNode).data()[0]
        symbolsAndTexts.filter(({ symbolNode: symbolNode1, }) => {
          const data1 = d3.select(symbolNode1).data()[0]
          return data.sector === data1.sector && data.name !== data1.name
        }).forEach(({ symbolNode: symbolNode1, textNode: textNode1 }) => {
          const data1 = d3.select(symbolNode1).data()[0]


          // if (data.sectorIndex !== 1) return


          const rect = blipRect(symbolNode, textNode)
          const rect1 = blipRect(symbolNode1, textNode1)
          if (!rectOverlapped(rect, rect1)) {
            return
          }
          const polar = cartesianToPolar(rect.pinPoint.x, rect.pinPoint.y)
          const polar1 = cartesianToPolar(rect1.pinPoint.x, rect1.pinPoint.y)
          // console.log('polar', data.name, polar, data1.name, polar1)
          const rectShouldDecrease = (polar.angle <= polar1.angle && (polar1.angle - polar.angle < Math.PI)) ||  (polar.angle > polar1.angle && (polar.angle - polar1.angle > Math.PI))
          // console.log('rectShouldDecrease', data.name, rectShouldDecrease)

          const newCartesian = polarToCartesian( rotateAngle(polar, rectShouldDecrease ? 'decrease' : 'increase'), polar.r )
          const newCartesian1 = polarToCartesian( rotateAngle(polar1, rectShouldDecrease ? 'increase' : 'decrease'), polar1.r )
          const offset = { x: newCartesian.x - rect.pinPoint.x, y: newCartesian.y - rect.pinPoint.y}
          const offset1 = { x: newCartesian1.x - rect1.pinPoint.x, y: newCartesian1.y - rect1.pinPoint.y}

          // console.log('offset for', data.name, offset, 'offset for', data1.name, offset1)
          d3.select(symbolNode).attr('x', Number(d3.select(symbolNode).attr('x')) + offset.x)
                               .attr('y', Number(d3.select(symbolNode).attr('y')) + offset.y)
                               .attr('transform', `translate(${Number(d3.select(symbolNode).attr('x'))}, ${ Number(d3.select(symbolNode).attr('y'))})`)
          d3.select(textNode).attr('x', Number(d3.select(textNode).attr('x')) + offset.x)
                             .attr('y', Number(d3.select(textNode).attr('y')) + offset.y)

          d3.select(symbolNode1).attr('x', Number(d3.select(symbolNode1).attr('x')) + offset1.x)
                                .attr('y', Number(d3.select(symbolNode1).attr('y')) + offset1.y)
                                .attr('transform', `translate(${Number(d3.select(symbolNode1).attr('x'))}, ${ Number(d3.select(symbolNode1).attr('y'))})`)
          d3.select(textNode1).attr('x', Number(d3.select(textNode1).attr('x')) + offset1.x)
                              .attr('y', Number(d3.select(textNode1).attr('y')) + offset1.y)

        })
      })

    }

    const pullRectBackInArcAndIncreaseR = () => {
      const INCREASE_R_DELTA = 30

      const symbolsAndTexts = eachBlipSymbol.nodes().map((symbolNode, index) => ({ symbolNode, textNode: eachBlipText.nodes()[index] }))

      symbolsAndTexts.forEach(({ symbolNode, textNode }) => {
        const rect = blipRect(symbolNode, textNode)
        const data = d3.select(symbolNode).data()[0]
        const arc = arcs[data.sectorIndex]
        if (!isRectOutOfArc(rect, arc.startAngle, arc.endAngle)) {
          return
        }


        // if (data.sectorIndex !== 1) return


        // d3.select(symbolNode).attr('x', Number(d3.select(symbolNode).attr('x')) + offsetX)
        //                      .attr('y', Number(d3.select(symbolNode).attr('y')) + offsetY)
        //                      .attr('transform', `translate(${Number(d3.select(symbolNode).attr('x'))}, ${ Number(d3.select(symbolNode).attr('y'))})`)
        // d3.select(textNode).attr('x', Number(d3.select(textNode).attr('x')) + offsetX)
        //                    .attr('y', Number(d3.select(textNode).attr('y')) + offsetY)

      })

    }


    let tickCount = 0
    simulation.on('tick',  e => {
      console.log('--- tick', tickCount)
      if (tickCount === 0) {
        positionTextNextToSymbol()
      } else {

        if(tickCount < 1) {
          spreadBlips()
          pullRectBackInArcAndIncreaseR()
        }

      }
      tickCount++
    })

  }


  componentDidMount() {
    const { svg, g } = this.initateSvg()
    const { arcs } = this.drawBackgroundCirclesAndAxis(svg, g)
    const { eachBlipSymbol, eachBlipText } = this.drawBlips(svg, g, arcs)
    this.distributeBlips(eachBlipSymbol, eachBlipText, arcs)
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
