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
      <div className='top-bar' data-topbar={true} role='navigation'>
        <a href='/'>
          <img className='logo' src='.././assets/stylizeds.png' />
        </a>
        <div className='top-bar-section'>
          <section>
            <ul className='left'>
              <li>
                <Link to='/' activeClassName='active' className='navbar-brand'>Home</Link>
              </li>
              <li><Link to='/discover' activeClassName='active' className='navbar-brand'>Discover</Link></li>
            </ul>
            <AccountControl authed={this.state.authed} />
          </section>
        </div>
      </div>
    )
  }
}

export default connect()(Navigation)
