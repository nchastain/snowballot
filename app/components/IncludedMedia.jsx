import React from 'react'
import ReactPlayer from 'react-player'
import classnames from 'classnames'
import FA from 'react-fontawesome'
import { connect } from 'react-redux'

const IncludedMedia = ({included, onDelete, showDelete}) => {
  const imgClasses = (type) => { return {'included-GIF': type === 'GIF', 'gallery-image': true, 'included-content': true} }
  const deleteButton = (type) => (
    <span className='fa-stack fa-md delete-button' id={type} onClick={() => onDelete(type)}>
      <FA name='circle' className='fa fa-stack-2x' />
      <FA name='times-circle' className='fa-stack-2x fa-fw delete-x' />
    </span>
  )
  const container = (type) => <div className='included-content'>{included[type]}</div>
  const img = (type) => <img className={classnames(imgClasses(type))} src={included[type]} />
  const link = <div className='included-content'><a href={included.link}>{included.link}</a></div>
  const youtube = <div className='video-container'><ReactPlayer width='100%' url={included.youtube} controls /></div>
  const more = <div className='included-content'>Click on an icon below to view additional media for this choice.</div>
  const displayMedia = (mediaType) => {
    let media
    switch (mediaType) {
      case 'photo':
      case 'GIF': media = img(mediaType) ; break
      case 'youtube': media = youtube ; break
      case 'link': media = link ; break
      case 'more': media = more ; break
      default: media = container(mediaType) ; break
    }
    return media
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
