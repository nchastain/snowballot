import expect from 'expect'
import * as markupUtils from '.././utilities/markupUtils'

const add = function(a, b) {
  return a + b
}

describe('General Utilities', () => {
  describe ('DatePicker', () => {
    it('should be an function', () => {
      expect(markupUtils.DatePicker).toBeA('function')
    })
  })
  describe ('modalStyles', () => {
    it('should be an object', () => {
      expect(markupUtils.modalStyles).toBeA('object')
    })
  })
})