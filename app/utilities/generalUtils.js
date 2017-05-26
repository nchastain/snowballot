import React from 'react'
import DateTime from 'react-datetime'
import { doesExpire } from 'utilities/sbUtils'
import { setDOMReferences } from 'utilities/markupUtils'

export const DatePicker = ({setDate, expires}) => {
  return (
    <div>
      <DateTime
        inputProps={{placeholder: 'Enter an expiration date'}}
        value={expires || ''}
        onChange={(data) => setDate(data)}
        closeOnSelect
      />
    </div>
  )
}

export const modalStyles = {
  content: {
    top: '25%',
    bottom: 'calc(75% - 125px)',
    left: '300px',
    right: '300px'
  }
}

export const addCommas = (num) => (num + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,')

export const manipulateDOMonVote = (e, choiceId, expires, choices, userChoice) => {
  let freshVote
  var updatedChoices = choices.map((choice) => {
    if (choice.id === choiceId) {
      if (choiceId === userChoice) {
        choice.votes--
        freshVote = false
      } else {
        choice.votes++
        freshVote = true
      }
    } else if (choice.id === userChoice) choice.votes--
    return choice
  })
  var updates = {
    userVoted: freshVote,
    userChoice: freshVote ? choiceId : null,
    choices: updatedChoices
  }
  var options = {
    choiceId,
    freshVote
  }
  return {updates, options}
}

export const createStateFromProps = function (prevProps, nextProps) {
  let newState = {}
  for (const prop in nextProps) {
    if (nextProps[prop] !== prevProps[prop]) newState[prop] = nextProps[prop]
  }
  return newState
}
