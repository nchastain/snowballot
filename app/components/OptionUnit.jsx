import React from 'react'
import FA from 'react-fontawesome'
import Tagger from './Tagger'
// import { DatePicker } from '.././utilities/generalUtils'
import DatePicker from 'react-datepicker'
import moment from 'moment'

const OptionUnit = function (props) {
  const { name, didExpire, save, isPrivate, description, alias, extensible, tagAdd, tagDelete, tags, suggestions, toggle, setDate } = props
  let expires = props.expires ? props.expires : moment().add(1, 'week')
  const optionUnits = {
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
    expire: {
      icon: 'calendar-times-o',
      text: 'Set a deadline for voting?',
      selector: (
        <FA
          id='didExpire'
          name={didExpire ? 'check-circle' : 'circle'}
          className='fa fa-fw custom-check'
          value={expires}
          onClick={(e) => toggle(e)}
        />
      ),
      etc: (
        <span>
          {didExpire && <DatePicker selected={moment(expires)} onChange={setDate} minDate={moment()} placeholderText='Select a deadline for voting' />}
        </span>
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
            onChange={(e) => {
              document.querySelector('.save-option-button#alias').style.display = 'inline-block'
              document.querySelector('.save-option-button#alias').innerHTML = 'save'
              document.querySelector('.save-option-button#alias').classList.remove('saved')
              toggle(e)
            }}
          />}
        </span>
      ),
      etc: (
        <span>
          {!isPrivate && <div className='save-option-button' id='alias' onClick={(e) => {
            document.querySelector('.save-option-button#alias').innerHTML = 'saved!'
            document.querySelector('.save-option-button#alias').classList.add('saved')
            save(e)
          }
          }>save</div>}
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
            onChange={(e) => {
              document.querySelector('.save-option-button#description').style.display = 'inline-block'
              document.querySelector('.save-option-button#description').innerHTML = 'save'
              document.querySelector('.save-option-button#description').classList.remove('saved')
              toggle(e)
            }}
          />
          <div className='save-option-button' id='description' onClick={(e) => {
            document.querySelector('.save-option-button#description').classList.add('saved')
            document.querySelector('.save-option-button#description').innerHTML = 'saved!'
            save(e)
          }}
          >
            save
          </div>
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
