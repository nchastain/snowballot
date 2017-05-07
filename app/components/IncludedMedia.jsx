import React from 'react'
import ReactPlayer from 'react-player'
import classnames from 'classnames'
import FA from 'react-fontawesome'
import * as actions from '.././actions'
import { connect } from 'react-redux'

const IncludedMedia = (props) => {
  const { included, id, onDelete } = props
  const imgClasses = (type) => { return {'included-GIF': type === 'GIF', 'gallery-image': true, 'included-content': true} }
  const deleteButton = (type) => (
    <span className='fa-stack fa-md delete-button' id={type} onClick={() => onDelete(type)}>
      <FA name='circle' className='fa fa-stack-2x' />
      <FA name='times-circle' className='fa-stack-2x fa-fw delete-x' />
    </span>
  )

  const container = (type) => <div className='included-content'>{included[type]}</div>
  const img = (type) => <img className={classnames(imgClasses(type))} src={included[type]} />

  const link = (
    <div className='included-content'>
      <a href={included.link}>{included.link}</a>
    </div>
  )

  const youtube = (
    <div className='video-container'>
      <ReactPlayer url={included.youtube} height={270} width={480} controls />
    </div>
  )

  const displayMedia = (mediaType) => {
    switch (mediaType) {
      case 'photo':
      case 'GIF': return img(mediaType)
      case 'youtube': return youtube
      case 'link': return link
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
              {deleteButton(mediaType)}
              {displayMedia(mediaType)}
            </div>
          )
        }
      })}
    </div>
  )
}

export default connect(state => state)(IncludedMedia)
