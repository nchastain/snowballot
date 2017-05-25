import expect from 'expect'
import * as generalUtils from '.././utilities/generalUtils'

const add = function(a, b) {
  return a + b
}

describe('General Utilities', () => {
  describe ('DatePicker', () => {
    it('should be an function', () => {
      expect(generalUtils.DatePicker).toBeA('function')
    })
  })
  describe ('modalStyles', () => {
    it('should be an object', () => {
      expect(generalUtils.modalStyles).toBeA('object')
    })
  })
})