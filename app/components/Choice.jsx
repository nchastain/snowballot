import React from 'react'
import FA from 'react-fontawesome'

const Choice = ({ choice, toggleChoiceOptions, checkKey, choicesExpanded, choiceUpdate, deleteChoice }) => (
  <span id='choice'>
    <div
      id={`choice-container-choice-${choice.id}`}
      className='choice-container input-group'
    >
      <div
        id={`choice-${choice.id}`}
        className='options-button input-group-button choice-expand'
        onClick={(e) => toggleChoiceOptions(e, choicesExpanded)}
      >Options</div>
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
