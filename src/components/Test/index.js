import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'

import Timeline from '../Timeline'

const styles = theme => ({
  root: {
    backgroundColor: '#f3f9fe',
    padding: '100px',
  },
})

class Test extends Component {
  constructor(props) {
    super(props)
    this.state = {
      radarData:  {
        data: {
          misc: {},
          blips: [
            { sector: 'UnderWit', name: 'Unmistakeable', score: 8, desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur' },
            { sector: 'UnderWit', name: 'Unmistak0', score: 8, desc: '' },
            { sector: 'UnderWit', name: 'Unmistak1', score: 8, desc: '' },
            { sector: 'UnderWit', name: 'Unmistak2', score: 8, desc: '' },
            { sector: 'UnderWit', name: 'Unequivocal', score: 8 },
            { sector: 'UnderWit', name: 'Telegramph1', score: 7 },
            { sector: 'UnderWit', name: 'Telegramph2', score: 7 },
            { sector: 'UnderWit', name: 'Telegramph3', score: 7 },
            { sector: 'UnderWit', name: 'Telegramph4', score: 7 },
            { sector: 'UnderWit', name: 'Telegramph5', score: 7, desc: 'Is Conference Room Air Making Us Dumber'},
            { sector: 'UnderWit', name: 'Block', score: 6 },
            { sector: 'UnderWit', name: 'Showing', score: 8 },
            { sector: 'UnderWit', name: 'Showing', score: 8 },

            { sector: 'Sightworthy', name: 'Illustration', score: 8, desc: 'aIllustration' },
            { sector: 'Sightworthy', name: 'Silkworms', score: 8 },
            { sector: 'Sightworthy', name: 'Raising', score: 7 },
            { sector: 'Sightworthy', name: 'Organisms', score: 7 },
            { sector: 'Sightworthy', name: 'Swimming', score: 8 },
            { sector: 'Sightworthy', name: 'Reference', score: 8 },

            { sector: 'whicker', name: 'planet ', score: 7, desc: 'aaaaaaaaaaaaaaaaaaaaaa, consectetur ad' },
            { sector: 'whicker', name: 'Docker', score: 8 },
            { sector: 'whicker', name: 'Planet Earth Lambda', score: 8 },
            { sector: 'whicker', name: 'Planet Mars', score: 8 },
            { sector: 'whicker', name: 'planet ', score: 7 },
            { sector: 'whicker', name: 'Docker', score: 8 },
            { sector: 'whicker', name: 'Planet1 Earth La', score: 8, desc: 'Its import' },
            { sector: 'whicker', name: 'Plan1e11t Mars', score: 8 },
            { sector: 'whicker', name: 'planet ', score: 7 },
            { sector: 'whicker', name: 'Docke1r', score: 8 },
            { sector: 'whicker', name: 'Plan1et Earthda', score: 8 },
            { sector: 'whicker', name: 'Planet Mars', score: 8 },

            { sector: 'UPAS', name: 'XO', score: 8, desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit'},
            { sector: 'UPAS', name: 'Measured', score: 7 },
            { sector: 'UPAS', name: 'With', score: 6 },
          ]
        }
      },
      timelineData: {
        ranges: [
          {
            from: '2012-07',
            to: '2014-03',
            desc: 'hello, world'
          },
          {
            from: '2014-03',
            to: '2017-01',
            desc: 'world, hello'
          },
        ]
      }
    }
  }

  render() {
    const { classes } = this.props
    const { radarData, timelineData } = this.state
    return (
      <div className={classes.root}>
        <Timeline data={timelineData}/>
      </div>
    )
  }
}


export default withStyles(styles)(Test)
