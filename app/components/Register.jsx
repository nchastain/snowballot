import React, { Component } from 'react'
import { auth } from '../firebase/auth'

export default class Register extends Component {
  constructor (props) {
    super(props)
    this.state = {
      registerError: null
    }
  }

  setErrorMsg (err) { return { registerError: err.message } }

  handleSubmit (e) {
    e.preventDefault()
    auth(this.email.value, this.pw.value)
      .catch(e => this.setState(this.setErrorMsg(e)))
  }
  render () {
    return (
      <div id='register' className='col-sm-6 col-sm-offset-3'>
        <h1>Register</h1>
        <form onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <label>Email</label>
            <input className='form-control' ref={function (email) { this.email = email }} placeholder='Email' />
          </div>
          <div className='form-group'>
            <label>Password</label>
            <input type='password' className='form-control' placeholder='Password' ref={function (pw) { this.pw = pw }} />
          </div>
          {
            this.state.registerError &&
            <div className='alert alert-danger' role='alert'>
              <span className='glyphicon glyphicon-exclamation-sign' aria-hidden='true' />
              <span className='sr-only'>Error:</span>
              &nbsp;{this.state.registerError}
            </div>
          }
          <button type='submit' className='btn btn-primary'>Register</button>
        </form>
      </div>
    )
  }
}
