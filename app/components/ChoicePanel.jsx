import React from 'react'
import { getChoiceNumber } from '.././utilities/sbUtils'
import Choice from './Choice'
import ChoiceMediaPane from './ChoiceMediaPane'
import FA from 'react-fontawesome'

const ChoicePanel = ({choices, choicesExpanded, update}) => {
  const choiceUpdate = (e) => {
    const updatedChoices = choices.map((choice) => {
      if (choice.id === getChoiceNumber(e)) choice.title = e.target.value
      return choice
    })
    update('choices', updatedChoices)
  }
  const checkKey = (e) => { 
    if (e.keyCode === 9 && getChoiceNumber(e) === choices.length) addChoice()
    if (e.keyCode === 13 && choices.length >= 2 && choices[0].title.length > 0 && choices[1].title.length > 0) document.querySelector('.sbCreationButton').click()
  }
  const addChoice = () => {
    const newChoice = {title: '', votes: 0, id: choices.length + 1, added: Date.now()}
    update('choices', [...choices, newChoice])
  }
  const deleteChoice = (e, choice) => {
    if (choice.id === 1 || choice.id === 2) return
    let updatedChoices = choices.filter(choice => choice.id !== getChoiceNumber(e))
    updatedChoices = updatedChoices.map(function(choice) {
      if (choice.id > getChoiceNumber(e)) choice.id--
      return choice
    })
    update('choices', updatedChoices)
  }
  const toggleChoiceOptions = (e) => {
    const infoSection = document.querySelector(`#choice-more-info-${e.target.id}`)
    const expandState = Boolean(!choicesExpanded[e.target.id])
    infoSection.classList.toggle('choice-more-info-expanded')
    update('choicesExpanded', {...choicesExpanded, [e.target.id]: expandState})
  }
  const choiceList = choices.map(choice => (
    <span key={`choice-container-${choice.id}`} className='individual-choice'>
      <div className='gutter-indexes'>{choice.id}</div>
      <Choice
        id={choice.id}
        choice={choice}
        choicesExpanded={choicesExpanded}
        toggleChoiceOptions={(e) => toggleChoiceOptions(e, choicesExpanded)}
        checkKey={(e) => checkKey(e)}
        choiceUpdate={(e) => choiceUpdate(e, choice)}
        deleteChoice={(e) => deleteChoice(e, choice)}
      />
      <ChoiceMediaPane id={choice.id} choices={choices} />
    </span>
  ))
  return (
    <span id='choice-panel'>
      <div className='newSbSection newSbChoices'>
        <div id='choices-area'>
          <div id='choice-containers'>
            {choiceList}
          </div>
        </div>
        <div id='add-choice' className='button secondary' onClick={() => addChoice()}>
          <FA name='plus' className='fa fa-fw' /> add choice
        </div>
      </div>
    </span>
  )
}

export default ChoicePanel
