import React from 'react'
import DateTime from 'react-datetime'
import { didExpire } from 'utilities/sbUtils'
import { setDOMReferences } from 'utilities/markupUtils'

export const DatePicker = ({setDate, expires}) => {
  return (
    <div>
      <DateTime
        inputProps={{placeholder: 'Enter an expiration date'}}
        value={expires || ''}
        onChange={(data) => setDate(data)}
        closeOnSelect
      />
    </div>
  )
}

export const modalStyles = {
  content: {
    top: '25%',
    bottom: 'calc(75% - 125px)',
    left: '300px',
    right: '300px'
  }
}

export const addCommas = (num) => (num + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,')

export const createStateFromProps = function (prevProps, nextProps) {
  let newState = {}
  for (const prop in nextProps) {
    if (nextProps[prop] !== prevProps[prop]) newState[prop] = nextProps[prop]
  }
  return newState
}
