import React from 'react'
import { Link } from 'react-router-dom'
import { logout } from '../firebase/auth'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'
import * as actions from '.././actions'
import classnames from 'classnames'

class AccountControl extends React.Component {
  constructor (props) {
    super(props)
    this.onLogout = this.onLogout.bind(this)
  }

  onLogout (e) {
    const { dispatch } = this.props
    e.preventDefault()
    dispatch(actions.logout())
  }

  getPhoto () {
    return <img src={this.props.user.photoURL} />
  }

  isActive (navLink) {
    return navLink === this.props.active ? 'active' : ''
  }

  render () {
    const navclasses = 'navbar-brand link-container right '
    const photoURL = this.props.user.photoURL
    const photoLink = (
      <Link className={navclasses} to='/dashboard'>
        <img id='profile-image' className='right' src={photoURL} />
      </Link>
    )
    if (typeof this.props.user !== 'undefined') console.log(this.props.user)
    const userNav = (
      <span className='right'>
        {photoURL && photoLink}
        <Link className={navclasses + this.isActive('/dashboard')} to='/dashboard'>
          Dashboard
        </Link>
        <Link to='/sbs/add' className={this.isActive('/sbs/add') + ' ' + navclasses + 'addLink'}>
          <FA className='addButton fa fa-fw' name='plus' />Add
        </Link>
      </span>
    )
    const noUserNav = (
      <span className='right'>
        <Link to='/login' className={navclasses + this.isActive('/login')}>
          <li>Login</li>
        </Link>
        <Link to='/register' className={navclasses + this.isActive('/register')}>
          <li>Register</li>
        </Link>
      </span>
    )
    return this.props.authed ? userNav : noUserNav
  }
}

export default connect(state => state)(AccountControl)
