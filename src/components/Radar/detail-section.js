import React, { Component } from 'react'
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
    // paddingLeft: 10,
  },
  entry: {
  },
  sectorName: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
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
    const { classes, sectorName, entries, radarWidth, } = this.props
    const { open, } = this.state
    return (
      <section className={classes.detailSection}>
        <Typography variant="h6" className={classes.sectorName} gutterBottom> {sectorName} </Typography>
        <div className={classes.entries} style={{width: radarWidth / 4, columnWidth: radarWidth / 4}}>
          {entries.map(entry => (
            <div className={classes.entry} key={entry.key}>
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

export default withStyles(styles)(DetailSection)
