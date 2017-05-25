import React from 'react'
import ReactDOM from 'react-dom'
import expect from 'expect'
import $ from 'jQuery'
import TestUtils, { shallowRenderer } from 'react-addons-test-utils'
import { AccountControl } from 'app/components/AccountControl'
import { shallow } from 'enzyme'

describe('AccountControl', () => {
  it('should exist', () => {
    expect(AccountControl).toExist()
  })
})