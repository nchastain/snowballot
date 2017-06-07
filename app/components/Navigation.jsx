import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { WindowResizeListener } from 'react-window-resize-listener'
import AccountControl from './AccountControl'
import { firebaseAuth } from '../firebase/constants'
import FA from 'react-fontawesome'

export class Navigation extends Component {
  constructor (props) {
    super(props)
    this.state = {
      authed: false,
      loading: true,
      searchTerm: '',
      hamburgerOpen: false
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

  checkForLargeScreen () {
    if (window.innerWidth > 800) this.setState({hamburgerOpen: false})
  }

  render () {
    const navclasses = 'navbar-brand link-container left hide-for-mobile '
    return (
      <span id='navigation'>
        <WindowResizeListener onResize={() => this.checkForLargeScreen()} />
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
          <FA name={this.state.hamburgerOpen ? 'window-close' : 'bars'} id='nav-menu-hamburger' className='right display-for-mobile' onClick={() => this.setState({hamburgerOpen: !this.state.hamburgerOpen})} />
          <AccountControl className='right hide-for-mobile' active={this.props.active} authed={this.state.authed} />
          <div id='open-nav-menu' className={this.state.hamburgerOpen ? '' : 'hidden'}>
            <Link to='/discover' className='open-nav-menu-item'>
              Discover
            </Link>
            {this.state.authed &&
            <Link to='/dashboard' className='open-nav-menu-item'>
              Dashboard
            </Link>}
            {this.state.authed &&
            <Link to='/sbs/add' className='open-nav-menu-item'>
              <FA className='addButton fa fa-fw' name='plus' />Add
            </Link>}
            {!this.state.authed && <Link to='/login' className='open-nav-menu-item'>
              Login
            </Link>}
            {!this.state.authed && <Link to='/register' className='open-nav-menu-item'>
              Register
            </Link>}
          </div>
        </div>
      </span>
    )
  }
}

export default connect(state => state)(Navigation)
