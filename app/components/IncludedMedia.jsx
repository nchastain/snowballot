import React from 'react'
import ReactPlayer from 'react-player'

const IncludedMedia = ({included}) => {
  const displayMedia = (mediaType) => {
    switch (mediaType) {
      case 'photo':
        return <img className='gallery-image' src={included.photo} />
      case 'youtube':
        return <div className='video-container'><ReactPlayer url={included.youtube} height={270} width={480} controls /></div>
      default:
        return <div className='included-content'>{included[mediaType]}</div>
    }
  }

  return (
    <div id='included-media'>
      {Object.keys(included).map(mediaType => {
        if (mediaType !== 'photoFile') {
          return (
            <div className='included-media-item' key={mediaType}>
              <div className='key-container'><div className='included-key'>{mediaType}</div></div>
              {displayMedia(mediaType)}
            </div>
          )
        }
      })}
    </div>
  )
}

export default IncludedMedia
