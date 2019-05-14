import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'


const styles = theme => ({

})

class TimeDiffIndicator extends Component {
  constructor(props) {
    super(props)

    this.currentTS = Date.now()
  }

  twoDaysHourRange() {
    return Array.from(Array(24).keys()).slice(1).map(x => -x).reverse().concat([0]).concat(Array.from(Array(24).keys()).slice(1))
                .map(hourDiff => this.currentTS + hourDiff * 60 * 60 & 1000)
  }

  drawIndicator() {

  }

  componentDidMount() {
    //draft:
    console.log(this.twoDaysHourRange().map(ts => new Date(ts)))
  }

  render() {
    const { classes } = this.props

    return (
      <div id='time-diff-indicator-div' className={classes.root}>
        <svg id='time-diff-indicator-svg'></svg>
      </div>
    )
  }
}

TimeDiffIndicator.propTypes = {
}


export default withStyles(styles)(TimeDiffIndicator)
