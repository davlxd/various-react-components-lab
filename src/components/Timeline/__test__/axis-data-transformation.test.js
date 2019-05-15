import React from 'react';
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import Timemline from '../index'

Enzyme.configure({ adapter: new Adapter() })

describe('<Timeline />, axis data transformation', () => {
  it('can extractYearSeries correctly with ranges in single year', () => {
    const wrapper = shallow(<Timemline data={{}} />)
    expect(
      wrapper.dive().instance().extractYearSeries([
        {from: '2012-01', to: '2012-02'},
        {from: '2012-01', to: '2012-02'},
      ])).toEqual([2012, 2013])
  })

  it('can extractYearSeries correctly with ranges in 2 consecutive years', () => {
    const wrapper = shallow(<Timemline data={{}} />)
    expect(
      wrapper.dive().instance().extractYearSeries([
        {from: '2011-01', to: '2012-02'},
        {from: '2012-01', to: '2011-02'},
      ])).toEqual([2011, 2012, 2013])
  })

  it('can extractYearSeries correctly with ranges across multiple years', () => {
    const wrapper = shallow(<Timemline data={{}} />)
    expect(
      wrapper.dive().instance().extractYearSeries([
        {from: '2011-01', to: '2017-02'},
        {from: '2012-01', to: '2018-02'},
      ])).toEqual([2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019])
  })
})
