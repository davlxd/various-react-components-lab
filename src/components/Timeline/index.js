import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

const moment = require('moment')

const styles = theme => ({

})

class Timeline extends Component {
  extractYearSeries(ranges) {
    const boundariesInMomentObject = ranges.map(range => range.from).concat(ranges.map(range => range.to))
                                           .map(boundary => moment(boundary))
                                           .sort((a, b) => a.valueOf() - b.valueOf())
    const startingYear = boundariesInMomentObject[0].year()
    const endingYear = boundariesInMomentObject[boundariesInMomentObject.length - 1].year()

    const yearSeries = []
    for (let year = startingYear; year < endingYear; year++) { yearSeries.push(year) }

    return yearSeries
  }
  componentDidMount() {
    const { ranges } = this.props.data
  }

  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <svg id='timeline-svg'>
        </svg>
      </div>
    )
  }
}

Timeline.propTypes = {
  data: PropTypes.object.isRequired
}

export default withStyles(styles)(Timeline)
