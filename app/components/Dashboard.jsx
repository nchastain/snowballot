import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { logout } from '../firebase/auth'
import * as actions from '../actions'
import SharePanel from './SharePanel'
import FA from 'react-fontawesome'

let createHandlers = function (dispatch) {
  let findUserSbs = function (userId) {
    dispatch(actions.findUserSbs(userId))
  }
  return {
    findUserSbs
  }
}

export class Dashboard extends Component {
  constructor (props) {
    super(props)
    this.handlers = createHandlers(this.props.dispatch)
    this.state = {
      favoriteSbs: []
    }
  }

  onLogout (e) {
    const { dispatch } = this.props
    e.preventDefault()
    dispatch(actions.logout())
  }

  componentDidMount () {
    this.handlers.findUserSbs(this.props.user.uid)
    this.props.dispatch(actions.findPublicSbs())
  }

  componentWillReceiveProps (nextProps) {
    this.getFavorites(nextProps)
  }

  getFavorites (props) {
    let favoriteIDs = []
    let favoriteSbs = []
    if (props.user.favorites) {
      Object.keys(props.user.favorites).forEach(function (favorite) {
        if (props.user.favorites[favorite]) favoriteIDs.push(favorite)
      })
      props.sbs.forEach(function (sb) {
        if (favoriteIDs.indexOf(sb.id) !== -1) {
          favoriteSbs.push(sb)
        }
      })
    }
    this.setState({ favoriteSbs })
  }

  getVoteSum (choices) {
    let voteTotal = 0
    choices.forEach(function (choice) { voteTotal += choice.votes })
    return voteTotal
  }

  renderSbs () {
    if (!this.props.user.sbs || Object.keys(this.props.user.sbs).length === 0) return
    const sortedSbs = this.props.user.sbs.sort(function (a, b) { return b.createdAt - a.createdAt })
    return sortedSbs.map((sb, idx) => (
      <span key={`sb-${sb.createdAt}`} className='total-sb-container'>
        <Link to={`/sbs/${sb.alias}`} className='snowballot-container'>
          <h5>{sb.title}</h5>
          <span className='vote-total'><span className='number'>{this.getVoteSum(sb.choices)}</span> votes</span>
        </Link>
        <span className='share-panel-outer-container'>
          <span className='dashboard-share-panel-outer-container'><SharePanel altText={false} iconSize='small' /></span>
        </span>
      </span>
    ))
  }

  changeInfo (type) {
    let accountItem = ''
    switch (type) {
      case 'email':
        accountItem = (
          <div>
            <FA name='check' className='fa fa-fw' />
            Successfully updated email
          </div>
        )
        this.setState({accountPanel: accountItem})
        this.props.dispatch(actions.changeEmail(this.state.newEmail))
        break
      case 'password':
        accountItem = (
          <div>
            <FA name='check' className='fa fa-fw' />
            Successfully changed password
          </div>
        )
        this.setState({accountPanel: accountItem})
        this.props.dispatch(actions.resetPassword(document.getElementById('newPassword').value))
        break
      case 'photo':
        accountItem = (
          <div>
            <FA name='check' className='fa fa-fw' />
            Successfully changed photo
          </div>
        )
        this.setState({accountPanel: accountItem, photo: ''})
        this.props.dispatch(actions.changeProfilePhoto(this.state.photo))
        break
    }
  }

  previewImage () {
    const that = this
    const file = document.querySelector('#photo-file-input').files[0]
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function (e) {
      that.setState({photo: e.target.result, accountPanel: ''})
    }
  }

  displayAccountPanel (accountItem) {
    let accountItemToShow = ''
    switch (accountItem) {
      case 'email':
        accountItemToShow = (
          <div>
            <input type='text' placeholder='Enter a new email' value={this.state.newEmail} onChange={(e) => this.setState({newEmail: e.currentTarget.value})} />
            <div className='button' onClick={() => this.changeInfo('email')}>Save e-mail address</div>
          </div>
        )
        break
      case 'password':
        accountItemToShow = (
          <div>
            <input type='password' id='newPassword' placeholder='Enter a new password' />
            <div className='button' onClick={() => this.changeInfo('password')}>Save new password</div>
          </div>
        )
        break
      case 'photo':
        accountItemToShow = (
          <div>
            <input type='file' className='photo-file-input' id='photo-file-input' onChange={() => this.previewImage()} style={{display: 'none'}} />
            {!this.state.photo && <div id='upload-button' onClick={() => document.getElementById('photo-file-input').click()}><FA name='upload' className='fa fa-fw' />Upload a photo</div>}
          </div>
        )
        break
      case 'deleteAccount':
        accountItemToShow = (
          <div>
            <div>Delete your account (including your snowballots, favorites, etc.?)</div>
            <div className='button' onClick={() => this.props.dispatch(actions.deleteAccount)}>Delete account</div>
          </div>
        )
        break
    }
    this.setState({accountPanel: accountItemToShow})
  }

  renderNone () {
    return <div>You have not yet created any snowballots. To create one, <Link to='/sbs/add' authed={this.props.user.uid}>click here</Link></div>
  }

  render () {
    const favorites = this.state.favoriteSbs.map((sb) => {
      return <div className='favorite-row' key={sb.id}>
        <FA name='star' className='fa fa-fw' />
        <Link to={`/sbs/${sb.alias}`}><h5>{sb.title}</h5></Link>
      </div>
    })
    const accountButton = (setting) => {
      return <div className='button' onClick={() => this.displayAccountPanel(setting.name)}>{setting.label}</div>
    }
    const settings = [
      {name: 'email', label: 'Change email'},
      {name: 'password', label: 'Change password'},
      {name: 'photo', label: 'Change profile photo'},
      {name: 'deleteAccount', label: 'Delete account'}
    ]
    return (
      <span id='dashboard'>
        <div className='dashboard-outer'>
          <div id='account-settings'>
            {settings.map(setting => accountButton(setting))}
          </div>
          <div id='account-panel'>
            {this.state.accountPanel}
            {this.state.photo && <img id='new-profile-photo' src={this.state.photo} />}
            {this.state.photo && <div id='save-photo-button' className='button' onClick={() => this.changeInfo('photo')}>Save photo</div>}
          </div>
          <div className='snowballots-section'>
            {typeof this.props.user.sbs !== 'undefined' && this.props.user.sbs.length > 0 ? this.renderSbs() : this.renderNone() }
          </div>
          <div className='favorites-section'>
            <div>Favorites</div>
            {favorites}
          </div>
          <div
            id='logout-button'
            className='button secondary'
            onClick={(evt) => {
              this.onLogout(evt)
              logout()
            }}
          >
            <span id='logout-text'>logout</span>
          </div>
        </div>
      </span>
    )
  }
}

export default connect(state => state)(Dashboard)
