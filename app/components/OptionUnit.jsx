import React from 'react'
import FA from 'react-fontawesome'

class OptionUnit extends React.Component {
  render () {
    const { iconName, label, selector, rest } = this.props
    return (
      <span id='option-unit'>
        <div className='options-unit'>
          <div className='options-icon'><FA name={iconName} className='fa-2x fa-fw' /></div>
          <div className='options-unit-text'>{ label }</div>
          <div className='options-selector'>{ selector }</div>
          <div className='options-rest'>{ rest }</div>
        </div>
      </span>
    )
  }
}

export default OptionUnit
