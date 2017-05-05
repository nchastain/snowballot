import React from 'react'

const IncludedMedia = ({included}) => {
  return (
    <div id='included-media'>
      {Object.keys(included).map(incSection =>
        <div className='included-media-item' key={incSection}>
          <span className='included-key'>{incSection}</span>{included[incSection]}</div>
      )}
    </div>
  )
}

export default IncludedMedia
