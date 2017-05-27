import React from 'react'
import FA from 'react-fontawesome'
import Tagger from './Tagger'
import { DatePicker } from '.././utilities/generalUtils'

const OptionUnit = function (props) {
  const { name, doesExpire, isPrivate, description, alias, expires, extensible, tagAdd, tagDelete, tags, suggestions, toggle, setDate } = props
  const optionUnits = {
    expire: {
      icon: 'calendar-times-o',
      text: 'Lock voting on snowballot after certain time?',
      selector: (
        <FA
          id='doesExpire'
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
          id='isPrivate'
          name={isPrivate ? 'check-circle' : 'circle'}
          className='fa fa-fw custom-check'
          onClick={(e) => toggle(e)}
        />
      )
    },
    extend: {
      icon: 'users',
      text: 'Allow voters to add new choices?',
      selector: (
        <FA
          id='isExtensible'
          name={extensible ? 'check-circle' : 'circle'}
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
          id='tagger'
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
