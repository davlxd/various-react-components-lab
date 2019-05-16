import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import marked from 'marked';

import { initateSvg, drawAxis, drawDescBackground } from './d3/axis-in-d3'
const moment = require('moment')

const DEFAULT_WIDTH = 800
const styles = theme => ({
  root: {
    // backgroundColor: '#f3f9fe',
  },
  descDiv: {
    position: 'absolute',
    padding: 20,
    paddingLeft: 50,
  }
})

class Timeline extends Component {
  constructor(props) {
    super(props)
    this.divId = 'timeline-svg-div'
    this.svgId = 'timeline-svg'
    this.state = {
      descRectLocations: [
      ]
    }
  }

  extractYearSeries(ranges) {
    const boundariesInMomentObject = ranges.map(range => range.from).concat(ranges.map(range => range.to))
                                           .map(boundary => moment(boundary))
                                           .sort((a, b) => a.valueOf() - b.valueOf())
    const startingYear = boundariesInMomentObject[0].year()
    const endingYear = boundariesInMomentObject[boundariesInMomentObject.length - 1].year() + 1

    const yearSeries = []
    for (let year = startingYear; year <= endingYear; year++) { yearSeries.push(year) }
    return yearSeries
  }

  positionDescDiv(ranges) {
    this.setState({
      descRectLocations: ranges.map((_, index) => document.getElementById(`desc-rect-${index}`).getBoundingClientRect())
                               .map(({ top, left, height, width }) => ({
                                  top: top + window.pageYOffset || document.documentElement.scrollTop,
                                  left: left + window.pageXOffset || document.documentElement.scrollLeft,
                                  height,
                                  width
                                }))
    })
  }

  componentDidMount() {
    const { divId, svgId } = this
    const { ranges } = this.props.data
    const yearSeries = this.extractYearSeries(ranges)

    const svg = initateSvg(divId, svgId, DEFAULT_WIDTH, yearSeries.length)
    const axisRightBoundary = drawAxis(svg, DEFAULT_WIDTH, yearSeries)
    drawDescBackground(svg, axisRightBoundary, DEFAULT_WIDTH, yearSeries, ranges)

    this.positionDescDiv(ranges)
    window.onresize = () => this.positionDescDiv(ranges)
  }

  render() {
    const { classes } = this.props
    const { ranges } = this.props.data
    const { descRectLocations } = this.state
    const { divId, svgId } = this

    return (
      <div id={divId} className={classes.root}>
        <svg id={svgId}></svg>
        {ranges.map((range, index) => (
          <div key={index} className={classes.descDiv} id={`desc-div-${index}`}
               style={{  ...descRectLocations[index]  }}
               dangerouslySetInnerHTML={{ __html: marked(range.desc)}} />
        ))}
      </div>
    )
  }
}

Timeline.propTypes = {
  data: PropTypes.object.isRequired
}

export default withStyles(styles)(Timeline)
