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
        <li
        style={{border: 'none', background: 'transparent', paddingLeft: '1.5rem'}}
        onClick={(evt) => {
          this.onLogout(evt)
          logout()
        }}
        className='navbar-brand right logout-button'>Logout</li>
        <li><Link to='/dashboard' className='navbar-brand right'>Dashboard</Link></li>
      </ul>
    : <ul className='right'>
        <li className='right' activeClassName='active' style={{paddingLeft: '1.5rem'}}><Link to='/login'>Login</Link></li>
        <li className='right'><Link to='/register' activeClassName='active' className='navbar-brand right'>Register</Link></li>
      </ul>
  }
}

export default connect()(AccountControl)
