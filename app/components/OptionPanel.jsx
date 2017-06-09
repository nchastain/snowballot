import React from 'react'
import OptionUnit from './OptionUnit'
import FA from 'react-fontawesome'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import Tagger from './Tagger'

const OptionPanel = (props) => {
  const {
    didExpire,
    expires,
    handleOptionToggle,
    setDate,
    isPrivate,
    alias,
    toggleAlias,
    isExtensible,
    description,
    toggleDescription,
    handleAdd,
    handleDelete,
    tags,
    suggestions,
    save,
    showSave = false,
    optionsExpanded = true
  } = props
  return (
    <span id='options-panel' className='newSbOptions newSbSection'>
      <div id='real-options-section' className={optionsExpanded ? 'expanded' : ''}>

        <div id='isPrivate' className='option-unit-small-container' onClick={(e) => handleOptionToggle(e, true)}>
          <div className={`option-unit-item ${isPrivate ? 'active' : ''}`}>
            <div className='option-unit-text'>is private</div>
          </div>
        </div>

        <div id='isExtensible' className='option-unit-small-container' onClick={(e) => handleOptionToggle(e, true)}>
          <div className={`option-unit-item ${isExtensible ? 'active' : ''}`}>
            <div className='option-unit-text'>voters can add choices</div>
          </div>
        </div>

        <div id='didExpire' className='option-unit-small-container' onClick={(e) => handleOptionToggle(e, true)}>
          <div className={`option-unit-item ${didExpire ? 'active' : ''}`}>
            <div className='option-unit-text'>has voting deadline</div>
          </div>
        </div>
        {didExpire && <div id='deadline-header'>voting deadline</div>}
        {didExpire && <div className='option-unit-small-container' style={{width: '100%', 'text-align': 'right', 'border-left': '0px solid white !important'}}>
          <DatePicker id='option-date-picker' selected={expires ? moment(expires) : moment().add(1, 'week')} onChange={setDate} minDate={moment()} placeholderText='Select a deadline for voting' />
        </div>}

        <div className='option-unit-large-container'>
          <div id='description' className='option-unit-item'>
            <div id='description' className='option-unit-text'>
              description
            </div>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => {
                if (showSave) {
                  document.querySelector('.save-option-button#description').style.display = 'inline-block'
                  document.querySelector('.save-option-button#description').innerHTML = 'save'
                  document.querySelector('.save-option-button#description').classList.remove('saved')
                }
                toggleDescription(e)
              }}
            />
            {showSave && <div className='save-option-button' id='description' onClick={(e) => {
              if (showSave) {
                document.querySelector('.save-option-button#description').classList.add('saved')
                document.querySelector('.save-option-button#description').innerHTML = 'saved!'
                save(e)
              }
            }}
            >
              save
            </div>}
          </div>
        </div>

        <div className='option-unit-medium-container'>
          <div id='alias' className='option-unit-item'>
            <div id='alias' className='option-unit-text'>
              Custom URL: snowballot.com/sbs/
            </div>
            {!isPrivate ? null : <span className='disabled-option'>(Sorry, custom URLs are only available for public snowballots.)</span>}
            {!isPrivate && <input
            id='alias-input'
            type='text'
            value={alias}
            onChange={(e) => {
              if (showSave) document.querySelector('.save-option-button#alias').style.display = 'inline-block'
              if (showSave) document.querySelector('.save-option-button#alias').innerHTML = 'save'
              if (showSave) document.querySelector('.save-option-button#alias').classList.remove('saved')
              toggleAlias(e)
            }}
            />}
          </div>
        </div>

        <div className='option-unit-medium-container'>
          <div id='tags' className='option-unit-item'>
            <div id='tags' className='option-unit-text'>
              tags
            </div>
            <div id='tag-input'>
              <Tagger
                id='tagger'
                className='tag-holder'
                handleAdd={handleAdd}
                handleDelete={handleDelete}
                tags={tags}
                suggestions={suggestions}
              />
            </div>
          </div>
        </div>

      </div>
    </span>
  )
}

export default OptionPanel
