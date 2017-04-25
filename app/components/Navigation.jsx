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
    return (
        <span>
        <Link className='navbar-brand left logo-container' to='/'>
          <img className='logo' src='.././assets/stylizeds.png' />
        </Link>
        <div className='top-bar-section top-bar'>
          <section>
            <ul className='left'>
              <Link to='/' className={this.props.active === '/' ? 'navbar-brand active link-container left' : 'navbar-brand link-container left'}>
                <li>
                  Home
                </li>
              </Link>
              <Link to='/discover' className={this.props.active === '/discover' ? 'navbar-brand active link-container left' : 'navbar-brand link-container left'}>
                <li>Discover</li>
              </Link>
            </ul>
            <AccountControl active={this.props.active} authed={this.state.authed} />
          </section>
        </div>
        </span>
    )
  }
}

export default connect()(Navigation)
