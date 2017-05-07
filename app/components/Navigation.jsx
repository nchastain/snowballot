import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { logout } from '../firebase/auth'
import * as actions from '../actions'
import { connect } from 'react-redux'
import Redux from 'redux'
import AccountControl from './AccountControl'
import { firebaseAuth } from '../firebase/constants'

export class Navigation extends Component {
  constructor (props) {
    super(props)
    this.state = {
      authed: false,
      loading: true
    }
    this.onLogout = this.onLogout.bind(this)
  }

  onLogout (e) {
    const { dispatch } = this.props
    e.preventDefault()
    dispatch(actions.logout())
  }

  isActive (navLink) {
    if (navLink === '/discover') {
      let discoverActive = this.props.active.indexOf(navLink) !== -1 ? 'active' : ''
      return discoverActive
    }
    return navLink === this.props.active ? 'active' : ''
  }

  componentDidMount () {
    this.removeListener = firebaseAuth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authed: true,
          loading: false
        })
      } else {
        this.setState({
          authed: false,
          loading: false
        })
      }
    })
  }

  componentWillUnmount () {
    this.removeListener()
  }

  render () {
    const navclasses = 'navbar-brand link-container left '
    return (
      <span id='navigation'>
        <div className='bar'>
          <Link className={navclasses} to='/discover'>
            <img className='logo' src='.././assets/logo.png' />
          </Link>
          <Link to='/discover' className={navclasses + this.isActive('/discover')}>
            Discover
          </Link>
          <AccountControl className='right' active={this.props.active} authed={this.state.authed} />
        </div>
      </span>
    )
  }
}

export default connect(state => state)(Navigation)
