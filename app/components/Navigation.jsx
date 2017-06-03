import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import AccountControl from './AccountControl'
import { firebaseAuth } from '../firebase/constants'
import FA from 'react-fontawesome'

export class Navigation extends Component {
  constructor (props) {
    super(props)
    this.state = {
      authed: false,
      loading: true,
      searchTerm: ''
    }
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

  isActive (navLink) {
    if (navLink === '/discover') {
      let discoverActive = this.props.active.indexOf(navLink) !== -1 ? 'active' : ''
      return discoverActive
    }
    return navLink === this.props.active ? 'active' : ''
  }

  checkForEnter (e) {
    if (e.keyCode === 13) document.getElementById('search-link').click()
  }

  render () {
    const navclasses = 'navbar-brand link-container left '
    return (
      <span id='navigation'>
        <div className='bar'>
          <img className='logo' src='.././assets/logo.png' />
          <Link to='/discover' className={navclasses + this.isActive('/discover')}>
            Discover
          </Link>
          <div className='left' id='nav-search'>
            <input
              placeholder='Search for snowballots'
              value={this.state.searchTerm}
              onChange={(e) => this.setState({searchTerm: e.currentTarget.value})}
              onKeyDown={(e) => this.checkForEnter(e)}
            />
            <Link id='search-link' to={`/discover/page=1?q=${this.state.searchTerm}`}>
              <div id='nav-magnifying-glass'><FA name='search' className='fa fa-fw' /></div>
            </Link>
          </div>
          <AccountControl className='right' active={this.props.active} authed={this.state.authed} />
        </div>
      </span>
    )
  }
}

export default connect(state => state)(Navigation)
