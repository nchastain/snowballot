import React, { Component } from 'react'
import firebase from 'firebase'
import { connect } from 'react-redux'
import * as actions from '../actions'
import { login, fbLogin, googleLogin, resetPassword } from '../firebase/auth'
import FA from 'react-fontawesome'

export class Login extends Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {
      loginMessage: null,
      emailLogin: false
    }
  }

  componentWillMount () {
    window.scrollTo(0, 0)
  }
  
  setErrorMsg (err) { return { loginMessage: err } }
  
  handleSubmit (e) {
    e.preventDefault()
    login(this.email.value, this.pw.value)
      .then(function (){
        const user = firebase.auth().currentUser
        actions.login(user.uid)
      })
      .catch((err) => {
        this.setState(this.setErrorMsg('Invalid username/password.'))
      })
  }

  resetPassword () {
    resetPassword(this.email.value)
      .then(() => this.setState(this.setErrorMsg(`Password reset email sent to ${this.email.value}.`)))
      .catch((err) => this.setState(this.setErrorMsg(`Email address not found.`)))
  }

  render () {
    const emailForm = (
      <span id='login-form'>
        <form onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <input className='form-control' ref={(email) => this.email = email} placeholder='Email'/>
          </div>
          <div className='form-group'>
            <input type='password' className='form-control' placeholder='Password' ref={(pw) => this.pw = pw} />
          </div>
          {
            this.state.loginMessage &&
            <div className='alert alert-danger' role='alert'>
              <span className='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>
              <span className='sr-only'>Error:</span>
              &nbsp;{this.state.loginMessage} <a href='#' onClick={this.resetPassword} className='alert-link'>Forgot Password?</a>
            </div>
          }
          <button type='submit' id='login-submit' className='button button-primary'>Login</button>
        </form>
      </span>
    )

    return (
      <div id='login' className='col-sm-6 col-sm-offset-3'>
        <div id='icons-container'>
          <div className='login-page-button' onClick={() => fbLogin()}>
            <div id='fb-button' className='fa-icon-holder'>
              <FA name='facebook' className='fa-2x fa-fw' />
            </div>
            <span className='login-text'>
              Log in with Facebook
            </span>
          </div>
          <div className='login-page-button' onClick={() => googleLogin()}>
            <div id='google-button' className='fa-icon-holder'>
              <FA name='google' className='fa-2x fa-fw' />
            </div>
            <span className='login-text'>
              Log in with Google
            </span>
          </div>
          <div className='login-page-button' onClick={() => this.setState({emailLogin: true})}>
            <div id='email-button' className='fa-icon-holder'>
              <FA name='envelope-o' className='fa-2x fa-fw' />
            </div>
            <span className='login-text'>
              Log in with e-mail
            </span>
          </div>
          {this.state.emailLogin && emailForm}
        </div>
      </div>
    )
  }
}

export default connect()(Login)
