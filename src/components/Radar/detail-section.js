import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import CssBaseline from '@material-ui/core/CssBaseline'

const RADAR_WIDTH = 800

const styles = theme => ({
  root: {
    paddingTop: 40,
    cursor: 'default',
    userSelect: 'none',
    transition: 'width 0.2s ease-out',
    overflow: 'hidden',
    transform: ({ flipped }) => flipped ? 'scale(-1, 1)' : null,
  },
  entries: {
    height: '80%',
    columnGap: 0,
    // paddingLeft: 10,
  },
  entry: {
    transform: ({ flipped }) => flipped ? 'scale(-1, 1)' : null,
  },
  sectorName: {
    textTransform: 'uppercase',
    width: ({ radarWidth }) => radarWidth / 4,
    transform: ({ flipped }) => flipped ? 'scale(-1, 1)' : null,
    fontWeight: 'bold',
  },
  blipName: {
    cursor: 'pointer',
  },
  desc: {
    overflow: 'hidden',
    wordWrap: 'break-word',
    transition: 'max-height 0.3s linear, margin-bottom 0.3s linear',
    fontWeight: 100,
  },
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
    const { classes, sectorName, entries, radarWidth, expand, onClickBlip, clickedBlip, } = this.props
    const flipIfNecessary = flipped => ({ transform: flipped? 'scale(-1, 1)' : null })

    const expandDesc = entry => clickedBlip && clickedBlip.sectorIndex === entry.sectorIndex && clickedBlip.name === entry.name
    const blipDescDynamicStyle = entry => ({
      maxHeight: expandDesc(entry) ? (10 + 24 * Math.ceil(entry.desc.length / 20.0)) : 0,
      marginBottom: expandDesc(entry) ? 10 : 0,
    })

    return (
      <section className={classes.root} style={{width: expand ? RADAR_WIDTH / 4 : 0}}>
        <CssBaseline/>
        <Typography variant="h5" className={classes.sectorName} gutterBottom> {sectorName} </Typography>
        <div className={classes.entries} style={{width: radarWidth / 4, columnWidth: radarWidth / 4}}>
          {entries.map(entry => (
            <div className={classes.entry} key={entry.key}>
              <Typography variant="subtitle1" className={classes.blipName} inline={true} onClick={() => onClickBlip(entry.sector, entry.name)}> {entry.name} </Typography>
              {entry.desc &&
                <p className={classes.desc} style={blipDescDynamicStyle(entry)}> {entry.desc} </p>
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
  expand: PropTypes.bool.isRequired,
  onClickBlip: PropTypes.func,
  clickedBlip: PropTypes.object,
  flipped: PropTypes.bool,
}

export default withStyles(styles)(DetailSection)
