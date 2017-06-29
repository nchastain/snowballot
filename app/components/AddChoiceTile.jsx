import React from 'react'

const AddChoiceTile = (props) => (
  <div className='box-header clearfix' id='add-choice-tile' onClick={() => props.onAdd()} >
    <div className='center-cell'>
      <img className='add-tile-image' src='.././addtile.png' />
    </div>
  </div>
)

export default AddChoiceTile