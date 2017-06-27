import React from 'react'
import FA from 'react-fontawesome'

const NewBallotChoice = ({ choice, toggleChoiceOptions, checkKey, choicesExpanded, choiceUpdate, deleteChoice }) => (
  <span id='new-ballot-choice'>
    <div
      id={`choice-container-choice-${choice.id}`}
      className='choice-container input-group'
    >
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
      <div
        id={`choice-${choice.id}`}
        className={`options-button input-group-button choice-expand ${choice.id !== 1 && choice.id !== 2 ? '' : 'no-delete'}`}
        onClick={(e) => toggleChoiceOptions(e, choicesExpanded)}
      >Options</div>
      {choice.id !== 1 && choice.id !== 2 && <FA
        key={`delete-${choice.id}`}
        id={`delete-${choice.id}`}
        className='fa fa-fw delete-choice-button button input-group-button'
        name='close'
        onClick={deleteChoice}
      />}
    </div>
  </span>
)

export default NewBallotChoice
