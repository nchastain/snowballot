import React from 'react'
import moment from 'moment'
import { isCreator, didExpire, findLeader } from 'utilities/ballotUtils'
import FA from 'react-fontawesome'
import { Link } from 'react-router-dom'

const addFA = (name) => <FA name={name} className='fa fa-fw' style={{verticalAlign: 'middle', marginTop: '-7px'}} />

export const creatorMessage = function (userID, creator, createdAt, alias) {
  if (!isCreator(userID, creator)) return
  return (
    <li className='creator-message'>
      <span className='creator-message-text'>
        {addFA('pencil-square-o')} You created this on {moment.unix(createdAt).format('dddd, MMMM Do, YYYY')}
      </span>
    </li>
  )
}

export const expiresMessage = function (expiration) {
  if (!expiration) return
  return (
    <li>
      {addFA('calendar')} This snowballot {didExpire(expiration) ? 'has expired.' : `expires on ${moment(expiration).format('dddd, MMMM Do, YYYY')}` }
    </li>
  )
}

export const linkMessage = function (alias) {
  const copyToClipboard = function () {
    var aux = document.createElement('input')
    aux.setAttribute('value', window.location.href)
    document.body.appendChild(aux)
    aux.select()
    document.execCommand('copy')
    document.body.removeChild(aux)
  }
  if (!alias) return
  return <li>{addFA('link')} You can find this snowballot at {window.location.href} (<span style={{cursor: 'pointer', textDecoration: 'underline'}} onClick={copyToClipboard}>click here to copy link</span>)</li>
}

export const votesMessage = function (choices, id, user, expires) {
  if (didExpire(expires) || typeof choices === 'undefined' || typeof id === 'undefined' || typeof user === 'undefined' || !user.votes || !choices[user.votes[id] - 1] || user.votes[id] !== null) return
  const leader = findLeader(choices)
  return (
    <li>{addFA('line-chart')} You voted for <span style={{fontWeight: 'bold'}}>{choices[user.votes[id] - 1].title} </span>
    and <span style={{fontWeight: 'bold'}}>{leader.title}</span> leads, with {leader.votes} vote{leader.votes === 1 ? '' : 's'}</li>
  )
}

export const winnerMessage = function (expires, choices) {
  if (!expires || !choices) return
  const winner = findLeader(choices)
  if (winner === null) return
  return didExpire(expires) ? <li>{addFA('trophy')} {winner.title} won with {winner.votes} votes</li> : null
}

export const authMessage = function (userID) {
  const loginMessage = (
    <li className='please-login-message'>
      <span className='login-message-text'>
        {addFA('sign-in')} To vote on this, <Link to='/login'>log in</Link> or <Link to='/register'>register</Link>.
      </span>
    </li>
  )
  return userID ? null : loginMessage
}

export const setDOMReferences = function (e) {
  const plusText = document.querySelector('.box-header.selected .plus')
  const voteCount = document.querySelector('.box-header.selected .vote-count')
  const selected = e.currentTarget.className.indexOf('selected') !== -1
  const votedBox = document.querySelector('.box-header.selected')
  return {selected, votedBox, plusText, voteCount}
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

export const createStateFromProps = function (prevProps, nextProps) {
  let newState = {}
  for (const prop in nextProps) {
    if (nextProps[prop] !== prevProps[prop]) newState[prop] = nextProps[prop]
  }
  return newState
}
