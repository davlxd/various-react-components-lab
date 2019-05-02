import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'

import Radar from '../Radar'

const styles = theme => ({
  root: {
    // backgroundColor: '#f3f9fe',
  },
})

class Test extends Component {
  constructor(props) {
    super(props)
    this.state = {
      radarData:  {
        ui: { width: 800, height: 600 },
        data: {
          misc: {},
          blips: [
            { sector: 'UnderWit', name: 'Unmistakeable', score: 8, detail: '' },
            { sector: 'UnderWit', name: 'Unmistak0', score: 8, detail: '' },
            { sector: 'UnderWit', name: 'Unmistak1', score: 8, detail: '' },
            { sector: 'UnderWit', name: 'Unmistak2', score: 8, detail: '' },
            { sector: 'UnderWit', name: 'Unequivocal', score: 8 },
            { sector: 'UnderWit', name: 'Telegramph1', score: 7 },
            { sector: 'UnderWit', name: 'Telegramph2', score: 7 },
            { sector: 'UnderWit', name: 'Telegramph3', score: 7 },
            { sector: 'UnderWit', name: 'Telegramph4', score: 7 },
            { sector: 'UnderWit', name: 'Telegramph5', score: 7 },
            { sector: 'UnderWit', name: 'Block', score: 6 },
            { sector: 'UnderWit', name: 'Showing', score: 8 },

            { sector: 'Sightworthy', name: 'Illustration', score: 8 },
            { sector: 'Sightworthy', name: 'Silkworms', score: 8 },
            // { sector: 'Sightworthy', name: 'Raising', score: 7 },
            { sector: 'Sightworthy', name: 'Organisms', score: 5 },
            { sector: 'Sightworthy', name: 'Swimming', score: 8 },
            { sector: 'Sightworthy', name: 'Reference', score: 8 },

            { sector: 'whicker', name: 'planet ', score: 7 },
            { sector: 'whicker', name: 'Docker', score: 8 },
            { sector: 'whicker', name: 'Planet Earth Lambda', score: 8 },
            { sector: 'whicker', name: 'Planet Mars', score: 8 },

            { sector: 'UPAS', name: 'XO', score: 8 },
            { sector: 'UPAS', name: 'Measured', score: 7 },
            { sector: 'UPAS', name: 'With', score: 6 },
          ]
        }
      }
    }
  }

  render() {
    const { classes } = this.props
    const { radarData } = this.state
    return (
      <div className={classes.root}>
        <Radar {...radarData} />
      </div>
    )
  }
}


export default withStyles(styles)(Test)
