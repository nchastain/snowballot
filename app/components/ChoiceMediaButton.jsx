import React from 'react'
import FA from 'react-fontawesome'

const ChoiceMediaButton = ({ iconName, clickHandler, label }) => (
  <div id='choice-media-button' className='button' onClick={(e) => clickHandler(e)}>
    <FA name={`${iconName}`} className='fa fa-fw more-info-icon' />
    {label}
  </div>
)

export default ChoiceMediaButton
