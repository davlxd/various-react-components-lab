import React from 'react';
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import Timemline from '../index'
import { rangesToMonthDiff } from '../d3/axis-in-d3'

Enzyme.configure({ adapter: new Adapter() })

describe('<Timeline />, axis data transformation', () => {
  it('can extractYearSeries correctly with ranges in single year', () => {
    const ranges = [
      { from: '2012-01', to: '2012-02' },
      { from: '2012-01', to: '2012-02' },
    ]
    const wrapper = shallow(<Timemline data={{ ranges }} />, { disableLifecycleMethods: true })
    expect(wrapper.dive().instance().extractYearSeries(ranges)).toEqual([2012, 2013])
  })

  it('can extractYearSeries correctly with ranges in 2 consecutive years', () => {
    const ranges = [
      { from: '2011-01', to: '2012-02' },
      { from: '2012-01', to: '2011-02' },
    ]
    const wrapper = shallow(<Timemline data={{ ranges }} />, { disableLifecycleMethods: true })
    expect(wrapper.dive().instance().extractYearSeries(ranges)).toEqual([2011, 2012, 2013])
  })

  it('can extractYearSeries correctly with ranges across multiple years', () => {
    const ranges = [
      { from: '2011-01', to: '2017-02' },
      { from: '2012-01', to: '2018-02' },
    ]
    const wrapper = shallow(<Timemline data={{ ranges }} />, { disableLifecycleMethods: true })
    expect(wrapper.dive().instance().extractYearSeries(ranges)).toEqual([2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019])
  })
})

describe('rangesToMonthDiff(), axis data transformation', () => {
  it('rangesToMonthDiff can calc relative months difference correctly', () => {
    const ranges = [
      { from: '2019-12', to: '2019-12' },
      { from: '2019-10', to: '2019-10' },
      { from: '2018-01', to: '2018-10' },
    ]
    expect(
      rangesToMonthDiff(ranges, 2020)).toEqual([
        {
          'monthDiffWithMaxYear': 1,
          'monthDiffWithEachOther': 0,
        },
        {
          'monthDiffWithMaxYear': 3,
          'monthDiffWithEachOther': 0,
        },
        {
          'monthDiffWithMaxYear': 15,
          'monthDiffWithEachOther': 9,
        },
    ])
  })
})
