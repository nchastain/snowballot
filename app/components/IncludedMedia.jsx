import React from 'react'
import ReactPlayer from 'react-player'
import classnames from 'classnames'
import FA from 'react-fontawesome'
import { connect } from 'react-redux'

const IncludedMedia = ({included, onDelete, showDelete = true}) => {
  const imgClasses = (type) => { return {'gallery-image': true, 'included-content': true} }

  const deleteButton = (type) => (
    <span className='fa-stack fa-md delete-button' id={type} onClick={() => onDelete(type)}>
      <FA name='circle' className='fa fa-stack-2x' />
      <FA
        name='times-circle'
        className='fa-stack-2x fa-fw delete-x'
        style={{
          backgroundColor: 'rgba(0,0,0,0) !important',
          color: '#d44950 !important'
        }}
      />
    </span>
  )

  const img = (type) => <img className={classnames(imgClasses(type))} src={included[type]} />
  const youtube = <div className='video-container' ><ReactPlayer width={'621px'} height={'349px'} style={{margin: 'auto'}} url={included.youtube} controls id='react-player-youtube' /></div>
  const link = <div className='included-content'><a href={included.link}>{included.link}</a></div>
  const more = <div className='included-content'>Click on an icon below to view additional media for this choice.</div>
  const container = (type) => <div className='included-content'>{included[type]}</div>

  const displayMedia = mediaType => {
    switch (mediaType) {
      case 'photo': return img(mediaType)
      case 'youtube': return youtube
      case 'link': return link
      case 'more': return more
      default: return container(mediaType)
    }
  }

  return (
    <div id='included-media'>
      {Object.keys(included).map(mediaType => {
        if (mediaType !== 'photoFile') {
          return (
            <div className='included-media-item' key={mediaType} id={mediaType}>
              <div className='key-container'><div className='included-key'>{mediaType}</div></div>
              {showDelete && deleteButton(mediaType)}
              {displayMedia(mediaType)}
            </div>
          )
        }
      })}
    </div>
  )
}

export default connect(state => state)(IncludedMedia)
