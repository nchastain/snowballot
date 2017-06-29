import React from 'react'
import FA from 'react-fontawesome'

const LoadingSpinner = (props) => (
  <div id='loading-spinner'>
    <img className='logo' src='.././logo.png' id='loading-spinner-icon' />
    <div className={props.color === 'white' ? 'white' : ''}>Loading...</div>
  </div>
)

export default LoadingSpinner
          