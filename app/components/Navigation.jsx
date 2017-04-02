import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { logout } from '../firebase/auth'

export default class Navigation extends Component {
  render () {
    return (
      <div className='top-bar' data-topbar={true} role='navigation'>
        <div className='container'>
          <section class='top-bar-section'>
            <ul className='left'>
              <li>
                <Link to='/' className='navbar-brand'>Home</Link>
              </li>
              <li>
                <Link to='/dashboard' className='navbar-brand'>Dashboard</Link>
              </li>
            </ul>
            <ul className='right'>
              {this.props.authed
                ? <button
                  style={{border: 'none', background: 'transparent'}}
                  onClick={() => {
                    logout()
                  }}
                  className='navbar-brand'>Logout</button>
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
