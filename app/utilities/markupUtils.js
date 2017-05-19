import React from 'react'
import moment from 'moment'
import { isCreator, doesExpire } from './sbUtils'
import FA from 'react-fontawesome'
import { Link } from 'react-router-dom'

export const creatorMessage = function (userID, creator, createdAt, alias) {
  if (!isCreator(userID, creator)) return
  const justCreated = moment.unix(createdAt).subtract(1, 'hours').isBefore(moment().unix())
  const newMsg = (
    <div className='creator-message'>
      <span className='creator-message-text'>
      You just created this snowballot! Now <a href={`/sbs/${alias}`}>send it to people</a> and bask in the wisdom of crowds.
      </span>
    </div>
  )
  const oldMsg = (
    <div className='creator-message'>
      <span className='creator-message-text'>
      You created this snowballot on {moment.unix(createdAt).format('dddd, MMMM Do, YYYY')}
      </span>
    </div>
  )
  return justCreated ? newMsg : oldMsg
}

export const expiresMessage = function (expiration) {
  if (!expiration) return
  return (
    <span className='expiration-info'>
      <FA name='clock-o' className='fa fa-fw' />This snowballot {doesExpire(expiration) ? 'has expired.' : `expires after ${expiration}` }
    </span>
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
