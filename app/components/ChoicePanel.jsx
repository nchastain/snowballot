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
  const checkTab = (e) => {
    if (e.keyCode === 9 && getChoiceNumber(e) === choices.length) addChoice()
  }
  const addChoice = () => {
    const newChoice = {title: '', votes: 0, id: choices.length + 1}
    update('choices', [...choices, newChoice])
  }
  const deleteChoice = (e) => {
    const updatedChoices = choices.filter(choice => choice.id !== getChoiceNumber(e))
    update('choices', updatedChoices)
  }
  const toggleChoiceOptions = (e) => {
    const infoSection = document.querySelector(`#choice-more-info-${e.target.id}`)
    const expandState = Boolean(!choicesExpanded[e.target.id])
    infoSection.classList.toggle('choice-more-info-expanded')
    update('choicesExpanded', {...choicesExpanded, [e.target.id]: expandState})
  }
  const choiceList = choices.map(choice => (
    <span key={`choice-container-${choice.id}`}>
      <Choice
        choice={choice}
        choicesExpanded={choicesExpanded}
        toggleChoiceOptions={(e) => toggleChoiceOptions(e, choicesExpanded)}
        checkTab={(e) => checkTab(e)}
        choiceUpdate={(e) => choiceUpdate(e)}
        deleteChoice={(e) => deleteChoice(e)}
      />
      <ChoiceMediaPane id={choice.id} choices={choices} />
    </span>
  ))
  return (
    <span id='choice-panel'>
      <div className='newSbSection newSbChoices'>
        <div className='header'>Choices</div>
        {choiceList}
        <div id='add-choice' className='button secondary' onClick={() => addChoice()}>
          <FA name='plus' className='fa fa-fw' /> add choice
        </div>
      </div>
    </span>
  )
}

export default ChoicePanel
