import React from 'react'
import FA from 'react-fontawesome'

const Choice = ({ choice, toggleChoiceOptions, checkTab, choicesExpanded, choiceUpdate, deleteChoice }) => (
  <span id='choice'>
    <div
      id={`choice-container-choice-${choice.id}`}
      className='choice-container input-group'
    >
      <FA
        id={`choice-${choice.id}`}
        name={choicesExpanded[`choice-${choice.id}`] ? 'compress' : 'ellipsis-h'}
        className='input-group-button fa fa-fw choice-expand'
        onClick={(e) => toggleChoiceOptions(e, choicesExpanded)}
      />
      <input
        className='choice-input input-group-field'
        id={`choice-${choice.id}`}
        value={choice.title}
        type='text'
        placeholder={`Enter name of Choice ${choice.id}`}
        onKeyDown={checkTab}
        onChange={(e) => choiceUpdate(e, 'title')}
      />
      <FA
        key={`delete-${choice.id}`}
        id={`delete-${choice.id}`}
        className='fa fa-fw delete-choice-button button input-group-button'
        name='close'
        onClick={deleteChoice}
      />
    </div>
  </span>
)

export default Choice
