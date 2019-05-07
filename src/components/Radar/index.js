import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'

import { initateSvg, drawBackgroundCirclesAndAxis, drawBlips } from './d3/radar-in-d3'

const styles = theme => ({
  root: {
    backgroundColor: '#f3f9fe',
    position: 'absolute',
    top: '100px',
    left: '100px',
    display: 'flex',
    flexWrap: 'nowrap',
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


  componentDidMount() {
    const { divId, svgId, radius } = this
    const { width, height, } = this.props.ui
    const { blips } = this.props.data

    const { svg, g } = initateSvg(divId, svgId, width, height)
    drawBackgroundCirclesAndAxis(svg, g, radius, blips)
    drawBlips(svg, g, radius, blips)
  }

  componentWillMount() {
  }

  render() {
    const { classes } = this.props
    const { divId, svgId } = this
    return (
      <div className={classes.root}>
        <div>detail</div>
        <div id={divId}>
          <svg id={svgId}></svg>
        </div>
        <div>detail</div>
      </div>
    )
  }
}


export default withStyles(styles)(Radar)
