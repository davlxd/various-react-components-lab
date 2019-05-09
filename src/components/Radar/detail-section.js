import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  detailSection: {
    height: '50%',
    cursor: 'default',
    userSelect: 'none',
  },
  entries: {
    height: '80%',
    columnGap: 0,
    // paddingLeft: 10,
  },
  entry: {
  },
  sectorName: {
    textTransform: 'uppercase',
    fontWeight: 500,
  },
  blipName: {
    cursor: 'pointer',
  },
  desc: {
    maxHeight: 0,
    marginBottom: 0,
    overflow: 'hidden',
    transition: 'max-height 0.3s linear, margin-bottom 0.3s linear',
  },
  descExpand: {
    transition: 'max-height 0.3s linear, margin-bottom 0.3s linear',
    overflow: 'hidden',
    maxHeight: '100px', //TODO calca
    marginBottom: 8,
  }
})

class DetailSection extends Component {
  constructor(props) {
    super(props)
  }

  toggleDesc() {
    this.setState({
      open: !this.state.open
    })
  }

  componentDidMount() {
  }

  render() {
    const { classes, sectorName, entries, radarWidth, flipped, onClickBlip, clickedBlip, } = this.props
    const flipIfNecessary = flipped => ({ transform: flipped? 'scale(-1, 1)' : null })
    const expandDescIfNecessary = entry => clickedBlip &&
                                           clickedBlip.sectorIndex === entry.sectorIndex &&
                                           clickedBlip.name === entry.name
                                           ? classes.descExpand : classes.desc

    return (
      <section className={classes.detailSection}>
        <Typography variant="h5" className={classes.sectorName} style={{ width: radarWidth / 4, ...flipIfNecessary(flipped) }} gutterBottom> {sectorName} </Typography>
        <div className={classes.entries} style={{width: radarWidth / 4, columnWidth: radarWidth / 4}}>
          {entries.map(entry => (
            <div className={classes.entry} key={entry.key} style={flipIfNecessary(flipped)}>
              <Typography variant="subtitle1" className={classes.blipName} inline={true} onClick={() => onClickBlip(entry.sector, entry.name)}> {entry.name} </Typography>
              {entry.desc &&
                <Typography variant="body2" className={expandDescIfNecessary(entry)} style={{width: radarWidth / 4}}> {entry.desc} </Typography>
              }
            </div>
          ))}
        </div>

      </section>
    )
  }
}

DetailSection.defaultProps = {
  flipped: false
}

DetailSection.propTypes = {
  radarWidth: PropTypes.number.isRequired,
  sectorName: PropTypes.string.isRequired,
  entries: PropTypes.array.isRequired,
  onClickBlip: PropTypes.func,
  clickedBlip: PropTypes.object,
  flipped: PropTypes.bool,
}

export default withStyles(styles)(DetailSection)
