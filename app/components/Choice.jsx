import React from 'react'
import FA from 'react-fontawesome'

const Choice = ({ choice, toggleChoiceOptions, checkKey, choicesExpanded, choiceUpdate, deleteChoice }) => (
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
      <FA
        key={`delete-${choice.id}`}
        id={`delete-${choice.id}`}
        className='fa fa-fw delete-choice-button button input-group-button'
        name='close'
        onClick={deleteChoice}
      />
      <input
        className='choice-input input-group-field'
        id={choice.id}
        value={choice.title}
        placeholder={choice.id === 1 ? 'enter first choice here' : choice.id === 2 ? 'press "tab" to add more choices' : ''}
        type='text'
        onKeyDown={checkKey}
        onChange={(e) => choiceUpdate(e)}
        maxLength={140}
      />
    </div>
  </span>
)

export default Choice
