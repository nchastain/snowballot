import React from 'react'
import moment from 'moment'
import { isCreator, didExpire } from 'utilities/sbUtils'
import FA from 'react-fontawesome'
import { Link } from 'react-router-dom'

export const creatorMessage = function (userID, creator, createdAt, alias) {
  if (!isCreator(userID, creator)) return
  return (
    <li className='creator-message'>
      <span className='creator-message-text'>
      You created this snowballot on {moment.unix(createdAt).format('dddd, MMMM Do, YYYY')}
      </span>
    </li>
  )
}

export const expiresMessage = function (expiration) {
  if (!expiration) return
  return (
    <li>
      This snowballot {didExpire(expiration) ? 'has expired.' : `expires after ${expiration}` }
    </li>
  )
}

export const authMessage = function (userID) {
  const loginMessage = (
    <div className='please-login-message'>
      <FA name='warning' />
      <span className='login-message-text'>
      To vote on this, <Link to='/login'>log</Link> in or <Link to='/register'>register</Link>. It's how we stop stage moms from rigging children's beauty pageants.</span>
    </div>
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
