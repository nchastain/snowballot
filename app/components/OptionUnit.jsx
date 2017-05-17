import React from 'react'
import FA from 'react-fontawesome'
import Tagger from './Tagger'
import { DatePicker } from '.././utilities/generalUtils'

const OptionUnit = function (props) {
  const { name, doesExpire, isPrivate, description, alias, hasMainImage, expires, extensible, deletion, tagAdd, tagDelete, tags, suggestions, toggle, setDate } = props
  const optionUnits = {
    expire: {
      icon: 'calendar-times-o',
      text: 'Lock voting on snowballot after certain time?',
      selector: (
        <FA
          id='option-expire'
          name={doesExpire ? 'check-circle' : 'circle'}
          className='fa fa-fw custom-check'
          onClick={(e) => toggle(e)}
        />
      ),
      etc: (
        <span>{doesExpire && <DatePicker expires={expires} setDate={setDate} {...props} />}</span>
      )
    },
    private: {
      icon: 'eye-slash',
      text: 'Make snowballot private?',
      selector: (
        <FA
          id='option-private'
          name={isPrivate ? 'check-circle' : 'circle'}
          className='fa fa-fw custom-check'
          onClick={(e) => toggle(e)}
        />
      )
    },
    alias: {
      icon: 'snowflake-o',
      text: (
        <span>
          {!isPrivate
          ? <span>Add a custom URL?&#58; snowballot.com&#47;sbs&#47;</span>
          : <span className='disabled-option'>
              (Sorry, custom URLs are only available for public snowballots.)
            </span>
          }
        </span>
      ),
      selector: (
        <span>
          {!isPrivate && <input
            type='text'
            value={alias}
            onChange={(e) => toggle(e)}
          />}
        </span>
      )
    },
    extend: {
      icon: 'users',
      text: 'Allow voters to add new choices?',
      selector: (
        <FA
          id='option-extensible'
          name={extensible ? 'check-circle' : 'circle'}
          className='fa fa-fw custom-check'
          onClick={(e) => toggle(e)}
        />
      )
    },
    photo: {
      icon: 'photo',
      text: 'Add a photo for this snowballot?',
      etc: (
        <span>
          {!hasMainImage && <div className='photo-uploader' id='photo-upload-main'>
            <input type='file' className='file-input' id='file-input-main' style={{display: 'none'}} />
            <div id='upload-button' onClick={() => document.getElementById('file-input-main').click()}>
              <FA name='upload' className='fa fa-fw' />
              Upload a file
            </div>
          </div>
          }
          <div id='gallery-main' className={!hasMainImage ? 'hidden' : ''}>
            <img className='gallery-image' id='gallery-img-main' src='' />
            <div className='main-image-delete'>
              <span className='fa-stack fa-md delete-button' onClick={() => deletion()}>
                <FA name='circle' className='fa fa-stack-2x' />
                <FA name='times-circle' className='fa-stack-2x fa-fw delete-x' />
              </span>
            </div>
          </div>
        </span>
      )
    },
    description: {
      icon: 'pencil',
      text: 'Add a description for this snowballot?',
      etc: (
        <span>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => toggle(e)}
            style={{width: '500px'}}
          />
        </span>
      )
    },
    tags: {
      icon: 'tags',
      text: 'Add tags to this snowballot?',
      etc: (
        <Tagger
          className='tag-holder'
          handleAdd={tagAdd}
          handleDelete={tagDelete}
          tags={tags}
          suggestions={suggestions}
        />
      )
    }
  }
  const { icon, text, selector, etc } = optionUnits[name]
  return (
    <div id='option-unit' className='options-unit'>
      <div className='options-icon'>
        <FA name={icon} className='fa-2x fa-fw' />
      </div>
      <div className='options-unit-text'>
        {text}
      </div>
      {selector && <div className='options-selector'>
        {selector}
      </div>}
      {etc && <div className='options-etc'>
        {etc}
      </div>}
    </div>
  )
}

export default OptionUnit
