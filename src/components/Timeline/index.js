import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import { initateSvg, drawAxis, drawDescBackground } from './d3/axis-in-d3'
const moment = require('moment')

const DEFAULT_WIDTH = 800
const styles = theme => ({
  root: {
    backgroundColor: '#f3f9fe',
  }
})

class Timeline extends Component {
  constructor(props) {
    super(props)
    this.divId = 'timeline-svg-div'
    this.svgId = 'timeline-svg'
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

  componentDidMount() {
    const { divId, svgId } = this
    const { ranges } = this.props.data
    const yearSeries = this.extractYearSeries(ranges)

    const svg = initateSvg(divId, svgId, DEFAULT_WIDTH, yearSeries.length)
    const axisRightBoundary = drawAxis(svg, DEFAULT_WIDTH, yearSeries)
    drawDescBackground(svg, axisRightBoundary, DEFAULT_WIDTH, yearSeries, ranges)
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

Timeline.propTypes = {
  data: PropTypes.object.isRequired
}

export default withStyles(styles)(Timeline)
