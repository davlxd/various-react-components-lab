import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'

import * as d3 from 'd3'
import * as topojson from 'topojson-client'

import timezones from './data/timezones'
import worldMapCountryColor from './data/cia-world-map-country-color'

const moment = require('moment-timezone')

const styles = theme => ({
  root: {
    backgroundColor: '#dae0e4',
    display: 'flex',
    justifyContent: 'center',
    // position: 'absolute',
    // top: '100px',
    // left: '100px',
  },
  boundary: {
    fill: 'none',
    stroke: '#b0bec5',
    strokeWidth: '.5px',
    pointerEvents: 'none',
  }
})

const tzidToUTCOffset = tzid => {
  if (tzid === 'Asia/Qostanay') {
    return -6
  }
  if (moment.tz.zone(tzid) == null) {
    console.log('moment.tz cannot map', tzid)
    return 0
  }
  return moment.tz.zone(tzid).utcOffset(moment()) / 60
}

class WorldMap extends Component {

  drawMap() {
    const { classes } = this.props

    const worldMapMinHeightRatio = 0.9
    const width = window.innerWidth <= window.innerHeight ? window.innerWidth : (window.innerHeight * worldMapMinHeightRatio) / (500 / 960)
    // const width = 960
    const height = width * (500 / 960)
    const projection = d3.geoMercator()
                         .scale(width / 2 / Math.PI)
                         .translate([width / 2, height * 0.6])
                         .precision(.1);
    const path = d3.geoPath()
                   .projection(projection)

    const svg = d3.select('#worldmap-svg')
                  .attr('width', width)
                  .attr('height', height)

    const countries = [...new Set(timezones.objects.timezones.geometries.map(geometry => geometry.properties.country))]
    const smallCountryColorScheme = d3.scaleOrdinal(['#FFCB4E','#F9F4A8','#FCF69F','#89C562','#D3E15B','#8FCEBC','#FFF798','#3BBA9A','#88BE67',])
    const colorScheme = country => worldMapCountryColor[country] || smallCountryColorScheme(countries.indexOf(country))

    svg.insert('g')
        .selectAll('path')
          .data(topojson.feature(timezones, timezones.objects.timezones).features)
        .enter().append('path')
          .attr('class', 'tz-region')
          .attr('ocean', d => d.properties.isOcean)
          .attr('utf-offset', d => tzidToUTCOffset(d.id))
          .attr('d', path)
          .style('fill', d => d.properties.isOcean ? '#aadaff' : '#ffffd9')
          .on('mouseover', function(d) {
            console.log(this, d3.select(this).attr('ocean'), this.getBBox(), d)
          })
          .on('mouseover', function(d){ d3.select(this).style('fill', 'blue') ; console.log(this.getBBox(), d)  })
          .on('mouseout', function(d){ d3.select(this).style('fill', d => d.properties.isOcean ? '#aadaff' : '#ffffd9')  })
          .append('title').text( d => d.properties.country )

     svg.select('g').insert('path')
          .datum(topojson.mesh(timezones, timezones.objects.timezones, (a, b) => a.properties.country !== b.properties.country))
          .attr('class', classes.boundary)
          .attr('d', path)

     const peoplePerPixel = 50000
     const shanghai_population = 22315474
     const rScale = d3.scaleSqrt().domain([0, shanghai_population]).range([0, Math.sqrt(shanghai_population / (peoplePerPixel * Math.PI))])
     d3.csv('/geonames_cities100000.csv', d => {
       svg.select('g').append('circle')
                        .attr("cx", projection([d.longitude, d.latitude])[0])
                        .attr("cy", projection([d.longitude, d.latitude])[1])
                        .attr("r",  rScale(d.population))
                        .style('fill', '#c34a04')
                        .style('opacity', '0.5')
     })
  }
  componentDidMount() {
    this.drawMap()
  }

  componentWillMount() {
  }

  render() {
    const { classes } = this.props
    return (
      <div id='worldmap-wrapper' className={classes.root}>
        <svg id='worldmap-svg'></svg>
      </div>
    )
  }
}


export default withStyles(styles)(WorldMap)
