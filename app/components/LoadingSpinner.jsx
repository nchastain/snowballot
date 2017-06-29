import React from 'react'
import FA from 'react-fontawesome'

const LoadingSpinner = (props) => (
  <div id='loading-spinner'>
    <div id='loading-spinner-icon'><FA className={`fa fa-spin fa-3x fa-fw ${props.color === 'white' ? 'white' : ''}`} name='spinner' /></div>
    <div className={props.color === 'white' ? 'white' : ''}>Loading...</div>
  </div>
)

export default LoadingSpinner
          