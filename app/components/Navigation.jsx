import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { logout } from '../firebase/auth'
import * as actions from 'actions'
import { connect } from 'react-redux'
import Redux from 'redux'
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
    dispatch(actions.startLogout())
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
        <div>
          <section className='top-bar-section'>
            <ul className='left'>
              <li>
                <Link to='/' className='navbar-brand'>Home</Link>
              </li>
              <li>
                <Link to='/dashboard' className='navbar-brand'>Dashboard</Link>
              </li>
            </ul>
            <ul className='right'>
              {this.state.authed
                ? <button
                  style={{border: 'none', background: 'transparent'}}
                  onClick={(evt) => {
                    this.onLogout(evt)
                    logout()
                  }}
                  className='navbar-brand right'>Logout</button>
                : <span>
                  <li className='right'><Link to='/login'>Login</Link></li>
                  <li className='right'><Link to='/register'>Register</Link></li>
                </span>
              }
            </ul>
          </section>
        </div>
      </div>
    )
  }
}

export default connect()(Navigation)
