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

export const manipulateDOMonVote = (e, choiceId, expires, choices, userChoice) => {
  let oldDOMRefs = setDOMReferences(e)
  const {selected, votedBox, plusText, voteCount} = oldDOMRefs
  if (doesExpire(expires)) return
  if (!selected) {
    e.currentTarget.querySelector('.selection-icon.selected').style.display = 'inline-block'
    e.currentTarget.querySelector('.selection-icon.unselected').style.display = 'none'
    if (votedBox) {
      votedBox.style.backgroundColor = 'white'
      votedBox.querySelector('.selection-icon.selected').style.display = 'none'
      votedBox.querySelector('.selection-icon.unselected').style.display = 'inline-block'
    }
  }
  if (selected) {
    e.currentTarget.querySelector('.selection-icon.selected').style.display = 'none'
    e.currentTarget.querySelector('.selection-icon.unselected').style.display = 'inline-block'
  }
  if (plusText && voteCount) {
    plusText.style.visibility = 'hidden'
    plusText.style.opacity = '0'
    voteCount.style.marginRight = '-35px'
  } else if (plusText && voteCount) {
    plusText.style.visibility = 'visible'
    plusText.style.opacity = '1'
    voteCount.style.marginRight = '10px'
  }
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
    }
    else if (choice.id === userChoice) choice.votes--
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

export const handleVoteHover = function (e, userID, expires) {
  if (!userID || doesExpire(expires)) return
  let DOMRefs = setDOMReferences(e)
  const {selected, plusText, voteCount} = DOMRefs
  const offset = 10
  const show = `-${offset}px`
  const hide = `-${offset + 25}px`
  const currentVoteCount = e.currentTarget.querySelector('.vote-count')
  const currentPlus = e.currentTarget.querySelector('.plus')
  const currentContainer = e.currentTarget
  if (e.type === 'mouseenter') {
    currentVoteCount.style.marginRight = show
    currentPlus.style.visibility = 'visible'
    currentPlus.style.opacity = '1'
    currentContainer.style.cursor = 'pointer'
    currentContainer.style.backgroundColor = 'rgba(66, 103, 178, 0.1)'
  } else if (e.type === 'mouseleave') {
    currentVoteCount.style.marginRight = hide
    currentPlus.style.visibility = 'hidden'
    currentPlus.style.opacity = '0'
    currentContainer.style.backgroundColor = selected ? 'rgba(66, 103, 178, 0.2)' : 'white'
  }
  if (plusText && voteCount) {
    if (e.type === 'mouseenter') {
      plusText.style.visibility = 'visible'
      plusText.style.opacity = '1'
      voteCount.style.marginRight = show
    } else if (e.type === 'mouseleave') {
      plusText.style.visibility = 'hidden'
      plusText.style.opacity = '0'
      voteCount.style.marginRight = hide
    }
  }
}

export const createStateFromProps = function (prevProps, nextProps) {
  let newState = {}
  for (const prop in nextProps) {
    if (nextProps[prop] !== prevProps[prop]) newState[prop] = nextProps[prop]
  }
  return newState
}
