import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'

export const AccountControl = props => {
  const isActive = navLink => navLink === props.active ? 'active' : ''
  const navclasses = 'navbar-brand link-container right '
  const photoURL = props.user.photoURL
  const photoLink = (
    <Link className={navclasses} to='/dashboard'>
      <img id='profile-image' className='right' src={photoURL} />
    </Link>
  )
  const userNav = (
    <span className='right'>
      {photoURL && photoLink}
      <Link className={navclasses + isActive('/dashboard')} to='/dashboard'>
        Dashboard
      </Link>
      <Link to='/sbs/add' className={isActive('/sbs/add') + ' ' + navclasses + 'addLink'}>
        <FA className='addButton fa fa-fw' name='plus' />Add
      </Link>
    </span>
  )
  const noUserNav = (
    <span className='right'>
      <Link to='/login' className={navclasses + isActive('/login')}>
        <li>Login</li>
      </Link>
      <Link to='/register' className={navclasses + isActive('/register')}>
        <li>Register</li>
      </Link>
    </span>
  )
  return <span id='account-control'>{props.authed ? userNav : noUserNav}</span>
}

export default connect(state => state)(AccountControl)
