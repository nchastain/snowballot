import React from 'react'
import FA from 'react-fontawesome'

const LoadingSpinner = () => (
  <div id='loading-spinner'>
    <div id='loading-spinner-icon'><FA className='fa fa-spin fa-3x fa-fw' name='spinner' /></div>
    <div>Loading...</div>
  </div>
)

export default LoadingSpinner
          