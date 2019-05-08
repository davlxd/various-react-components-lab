import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'

import DetailSection from './detail-section'
import { initateSvg, drawBackgroundCirclesAndAxis, drawBlips } from './d3/radar-in-d3'

const RADAR_WIDTH = 800
const RADAR_HEIGHT = 600

const styles = theme => ({
  root: {
    backgroundColor: '#f3f9fe',
    position: 'absolute',
    display: 'flex',
    flexWrap: 'nowrap',
  },
  detailColumn: {
    display: 'flex',
    flexDirection: 'column',
    height: RADAR_HEIGHT,
    transition: 'width 0.2s ease-out',
    width: RADAR_WIDTH / 2, // this guarantees left one doesn't overflow into svg
  },
  detailColumnCollapsed: {
    display: 'flex',
    flexDirection: 'column',
    height: RADAR_HEIGHT,
    transition: 'width 0.2s ease-out',
    overflow: 'hidden',
    width: 0,
  },
})

let count = 0

class Radar extends Component {
  constructor(props) {
    super(props)

    this.divId = `radar-chart-div-${count++}`
    this.svgId = `radar-chart-${count++}`
    this.radius = Math.min(RADAR_WIDTH/2, RADAR_HEIGHT/2) * 0.95

    this.state = {
      clickedBlip: null,
      hoveredHalf: 'right',
    }
  }


  componentDidMount() {
    const { divId, svgId, radius } = this
    const { blips } = this.props.data

    const { svg, g } = initateSvg(divId, svgId, RADAR_WIDTH, RADAR_HEIGHT)
    drawBackgroundCirclesAndAxis(svg, g, radius, blips, half => this.setState({ hoveredHalf: half }))
    drawBlips(svg, g, radius, blips, half => this.setState({ hoveredHalf: half }))
  }

  componentWillMount() {
  }

  render() {
    const { classes } = this.props
    const { hoveredHalf } = this.state
    const { divId, svgId } = this
    const { blips } = this.props.data
    const blipsGroupBySector = blips.reduce((acc, cur, idx) => {
      acc[cur.sector] = acc[cur.sector] || []
      acc[cur.sector].push({
        key: idx,
        name: cur.name,
        desc: cur.desc || ''
      })
      return acc
    }, {})
    const sectors = Object.keys(blipsGroupBySector)

    return (
      <div className={classes.root}>
        <div className={ hoveredHalf === 'left' ? classes.detailColumn : classes.detailColumnCollapsed } style={{transform: 'scale(-1,1)'}}>
          <DetailSection radarWidth={RADAR_WIDTH} sectorName={sectors[3]} entries={blipsGroupBySector[sectors[3]]} flipped={true}/>
          <DetailSection radarWidth={RADAR_WIDTH} sectorName={sectors[2]} entries={blipsGroupBySector[sectors[2]]} flipped={true}/>
        </div>
        <div id={divId}>
          <svg id={svgId}></svg>
        </div>
        <div className={ hoveredHalf === 'right' ? classes.detailColumn : classes.detailColumnCollapsed }>
          <DetailSection radarWidth={RADAR_WIDTH} sectorName={sectors[0]} entries={blipsGroupBySector[sectors[0]]}/>
          <DetailSection radarWidth={RADAR_WIDTH} sectorName={sectors[1]} entries={blipsGroupBySector[sectors[1]]}/>
        </div>
      </div>
    )
  }
}


export default withStyles(styles)(Radar)
