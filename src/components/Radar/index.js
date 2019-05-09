import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'

import DetailSection from './detail-section'
import { initateSvg, drawBackgroundCirclesAndAxis, drawBlips } from './d3/radar-in-d3'

const RADAR_WIDTH = 800
const RADAR_HEIGHT = 600

const styles = theme => ({
  root: {
    // backgroundColor: '#f3f9fe',
    position: 'absolute',
    display: 'flex',
    flexWrap: 'nowrap',
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
      clickedBlip: { sector: '', name: '' },
      hoveredSectorIndex: 0,
    }
  }


  clickOnBlip(sector, name){
    const { sector: prevSector, name: prevName } = this.state.clickedBlip
    if (prevSector === sector && prevName === name) {
      this.setState({ clickedBlip: { sector: '', name: '' } })
      return
    }
    this.setState({ clickedBlip: { sector, name } })
  }

  componentDidMount() {
    const { divId, svgId, radius } = this
    const { blips } = this.props.data

    const hoverOnSector = sectorIndex => this.setState({ hoveredSectorIndex: sectorIndex })


    const { svg, g } = initateSvg(divId, svgId, RADAR_WIDTH, RADAR_HEIGHT)
    drawBackgroundCirclesAndAxis(svg, g, RADAR_WIDTH, RADAR_HEIGHT, radius, blips, hoverOnSector)
    drawBlips(svg, g, radius, blips, hoverOnSector, (sector, name) => this.clickOnBlip(sector, name))
  }

  componentWillMount() {
  }

  render() {
    const { classes } = this.props
    const { hoveredSectorIndex, clickedBlip } = this.state
    const { divId, svgId } = this
    const { blips } = this.props.data
    const blipsGroupBySector = blips.reduce((acc, cur, idx) => {
      acc[cur.sector] = acc[cur.sector] || []
      acc[cur.sector].push({
        key: idx,
        sector: cur.sector,
        name: cur.name,
        desc: cur.desc || ''
      })
      return acc
    }, {})
    const sectors = Object.keys(blipsGroupBySector)

    return (
      <div className={classes.root}>
        <DetailSection radarWidth={RADAR_WIDTH} expand={hoveredSectorIndex === 3} sectorName={sectors[3]} onClickBlip={(sector, name) => this.clickOnBlip(sector, name)} entries={blipsGroupBySector[sectors[3]]} clickedBlip={clickedBlip} flipped={true}/>
        <DetailSection radarWidth={RADAR_WIDTH} expand={hoveredSectorIndex === 2} sectorName={sectors[2]} onClickBlip={(sector, name) => this.clickOnBlip(sector, name)} entries={blipsGroupBySector[sectors[2]]} clickedBlip={clickedBlip} flipped={true}/>
        <div id={divId}>
          <svg id={svgId}></svg>
        </div>
        <DetailSection radarWidth={RADAR_WIDTH} expand={hoveredSectorIndex === 0} sectorName={sectors[0]} onClickBlip={(sector, name) => this.clickOnBlip(sector, name)} clickedBlip={clickedBlip} entries={blipsGroupBySector[sectors[0]]}/>
        <DetailSection radarWidth={RADAR_WIDTH} expand={hoveredSectorIndex === 1} sectorName={sectors[1]} onClickBlip={(sector, name) => this.clickOnBlip(sector, name)} clickedBlip={clickedBlip} entries={blipsGroupBySector[sectors[1]]}/>
      </div>
    )
  }
}


export default withStyles(styles)(Radar)
