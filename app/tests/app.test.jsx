import expect from 'expect'
import SbChoices from '.././components/SbChoices'
import AccountControl from '.././components/AccountControl'
import TestUtils from 'react-addons-test-utils'
import shallowTestUtils from 'react-shallow-testutils'
import chai from 'chai'
import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import Main from '.././components/Main'
import configure from '.././store/configureStore'

describe('App', () => {
  it('should be true', () => {
    expect(3).toBe(3)
  })
})