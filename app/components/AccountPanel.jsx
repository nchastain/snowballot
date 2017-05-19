import React from 'react'
import FA from 'react-fontawesome'
import * as actions from '../actions'
import { logout } from '../firebase/auth'
import { connect } from 'react-redux'
import { getAccountItem } from '.././utilities/userUtils'

class AccountPanel extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  changeInfo (type) {
    switch (type) {
      case 'email':
        this.setState({accountPanel: getAccountItem('Successfully updated email')})
        this.props.dispatch(actions.changeEmail(this.state.newEmail))
        break
      case 'password':
        this.setState({accountPanel: getAccountItem('Successfully changed password')})
        this.props.dispatch(actions.resetPassword(document.getElementById('newPassword').value))
        break
      case 'photo':
        this.setState({accountPanel: getAccountItem('Successfully changed photo'), photo: ''})
        this.props.dispatch(actions.changeProfilePhoto(this.state.photo))
        break
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
          <div id='account-deletion' >
            <div id='account-delete-text'>Delete your account (including your snowballots, favorites, etc.?)</div>
            <div id='account-delete-button' className='button' onClick={() => this.props.dispatch(actions.deleteAccount)}>Delete account</div>
          </div>
        )
        break
    }
    this.setState({accountPanel: accountItemToShow})
  }

  onLogout (e) {
    const { dispatch } = this.props
    e.preventDefault()
    dispatch(actions.logout())
  }

  render () {
    const accountButton = (setting) => {
      return <div onClick={() => this.displayAccountPanel(setting.name)}>{setting.label}</div>
    }
    const settings = [
      {name: 'email', label: 'Change email'},
      {name: 'password', label: 'Change password'},
      {name: 'photo', label: 'Change profile photo'},
      {name: 'deleteAccount', label: 'Delete account'}
    ]
    return (
      <div id='account-panel'>
        <div id='account-section'>
          <div id='account-settings'>
            {settings.map(setting => <span key={setting.name} className='button'>{accountButton(setting)}</span>)}
            <div id='logout' className='button' onClick={(evt) => {
              this.onLogout(evt)
              logout()
            }}>
              <span id='logout-text'>Log out?</span>
            </div>
          </div>
          <div id='account-panel'>
            {this.state.accountPanel}
            {this.state.photo && <img id='new-profile-photo' src={this.state.photo} />}
            {this.state.photo && <div id='save-photo-button' className='button' onClick={() => this.changeInfo('photo')}>Save photo</div>}
          </div>
        </div>
      </div>
    )
  }
}

export default connect(state => state)(AccountPanel)
