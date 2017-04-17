import React from 'react'
import { Link } from 'react-router-dom'
import { logout } from '../firebase/auth'
import { connect } from 'react-redux'
import * as actions from '.././actions'

class AccountControl extends React.Component {
  constructor (props) {
    super(props)
    this.onLogout = this.onLogout.bind(this)
  }

  onLogout (e) {
    const { dispatch } = this.props
    e.preventDefault()
    dispatch(actions.startLogout())
  }

  render () {
    return this.props.authed
    ? <ul className='right'>
        <li><Link to='/dashboard' className='navbar-brand right'>Dashboard</Link></li>
        <li
        style={{border: 'none', background: 'transparent'}}
        onClick={(evt) => {
          this.onLogout(evt)
          logout()
        }}
        className='navbar-brand right logout-button'>Logout</li>
      </ul>
    : <ul className='right'>
        <li className='right'><Link to='/login'>Login</Link></li>
        <li className='right'><Link to='/register'>Register</Link></li>
      </ul>
  }
}

export default connect()(AccountControl)
