import React from 'react'
import DateTime from 'react-datetime'

export const getCurrentPage = function (fullURL) {
  let queryStr = fullURL.substr(fullURL.lastIndexOf('/') + 1)
  let pageStr = queryStr.substr(queryStr.lastIndexOf('=') + 1)
  if (pageStr === 'discover') return 1
  let pageNum = parseInt(pageStr)
  return pageNum
}

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
