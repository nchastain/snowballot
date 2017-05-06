import React from 'react'
import ReactPlayer from 'react-player'
import classnames from 'classnames'

const IncludedMedia = ({included}) => {
  const imgClasses = (type) => {
    return {
      'gallery-image': true,
      'included-content': true,
      'included-GIF': type === 'GIF'
    }
  }
  const imgToShow = (type) => <img className={classnames(imgClasses(type))} src={included[type]} />
  const displayMedia = (mediaType) => {
    switch (mediaType) {
      case 'photo':
      case 'GIF':
        return imgToShow(mediaType)
      case 'youtube':
        return <div className='video-container'><ReactPlayer url={included.youtube} height={270} width={480} controls /></div>
      case 'link':
        return <div className='included-content'><a href={included.link}>{included.link}</a></div>
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
