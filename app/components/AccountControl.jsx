import React from 'react'
import { Link } from 'react-router-dom'
import { logout } from '../firebase/auth'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'
import * as actions from '.././actions'

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

  render () {
    return this.props.authed
    ? <ul className='right'>
        <li
        onClick={(evt) => {
          this.onLogout(evt)
          logout()
        }}
        className='navbar-brand right logout-button link-container'
        >Logout</li>
        <Link className={this.props.active === '/dashboard'
        ? 'navbar-brand link-container active right'
        : 'navbar-brand link-container right'} to='/dashboard'>
          <li>Dashboard</li>
        </Link>
        <Link to='/sbs/add' className={this.props.active === '/sbs/add' ? 'addLink navbar-brand active right link-container' : 'addLink navbar-brand right link-container'}>
          <li><FA className='addButton fa fa-fw' name='plus' />Add</li>
        </Link>
      </ul>
    : <ul className='right'>
        <li className={this.props.active === '/login' ? 'right active' : 'right'} style={{paddingLeft: '1.5rem'}}><Link to='/login'>Login</Link></li>
        <li className={this.props.active === '/register' ? 'right active' : 'right'} ><Link to='/register' className='navbar-brand right'>Register</Link></li>
      </ul>
  }
}

export default connect()(AccountControl)
