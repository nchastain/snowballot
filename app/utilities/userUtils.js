import React from 'react'
import FA from 'react-fontawesome'

export const getAccountItem = function (message) {
  return (
    <div>
      <FA name='check' className='fa fa-fw' />
      ${message}
    </div>
  )
}
