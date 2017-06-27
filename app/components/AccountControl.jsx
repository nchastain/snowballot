import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'

export const AccountControl = props => {
  const isActive = navLink => navLink === props.active ? 'active' : ''
  
  const navclasses = 'navbar-brand link-container right '
  
  const photoLink = (
    <Link className={navclasses} to='/dashboard'>
      <img id='profile-image' className='right' src={props.user.photoURL} />
    </Link>
  )

  const userNav = (
    <span className='right'>
      {props.user.photoURL && photoLink}
      <Link className={navclasses + isActive('/dashboard')} to='/dashboard'>
        Dashboard
      </Link>
      <Link to='/sbs/new' className={isActive('/sbs/new') + ' ' + navclasses + 'addLink'}>
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
  
  return (
    <span id='account-control'>
      <span className='hide-for-mobile'>{props.authed ? userNav : noUserNav}</span>
    </span>
  )

}

export default connect(state => state)(AccountControl)
