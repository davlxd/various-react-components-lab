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
    this.state = {
      open: false
    }
  }

  toggleDesc() {
    this.setState({
      open: !this.state.open
    })
  }

  componentDidMount() {

  }

  render() {
    const { classes, sectorName, entries, radarWidth, flipped, } = this.props
    const { open, } = this.state
    return (
      <section className={classes.detailSection}>
        <Typography variant="h5" className={classes.sectorName} style={{ width: radarWidth / 4, transform: flipped ? 'scale(-1, 1)': null }} gutterBottom> {sectorName} </Typography>
        <div className={classes.entries} style={{width: radarWidth / 4, columnWidth: radarWidth / 4}}>
          {entries.map(entry => (
            <div className={classes.entry} key={entry.key} style={{transform: flipped ? 'scale(-1, 1)': null}}>
              <Typography variant="subtitle1" className={classes.blipName} inline={true} onClick={() => this.toggleDesc()}> {entry.name} </Typography>
              {entry.desc &&
                <Typography variant="body2" className={open ? classes.descExpand : classes.desc} style={{width: radarWidth / 4}}> {entry.desc} </Typography>
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
  flipped: PropTypes.bool,
}

export default withStyles(styles)(DetailSection)
