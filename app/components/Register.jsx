import React, { Component } from 'react'
import { auth } from '../firebase/auth'

export default class Register extends Component {
  constructor (props) {
    super(props)
    this.state = {
      registerError: null,
      password: '',
      email: ''
    }
  }

  // componentWillUnmount () {
  //   this.setState({registerError: null, password: '', email: ''})
  // }

  componentWillMount () {
    window.scrollTo(0, 0)
  }

  setErrorMsg (err) { return { registerError: err.message } }

  handleSubmit (e) {
    e.preventDefault()
    if (!this.state.email || !this.state.password) return
    auth(this.state.email, this.state.password)
      .catch(e => this.setState(this.setErrorMsg(e)))
  }

  changeField (e, type) {
    this.setState({[type]: e.target.value})
  }

  render () {
    return (
      <div id='register-accent'>
        <div id='register' className='col-sm-6 col-sm-offset-3'>
          <h1>Register</h1>
          <form onSubmit={(e) => this.handleSubmit(e)}>
            <div className='form-group'>
              <label>Email</label>
              <input className='form-control' value={this.state.email} onChange={(e) => this.changeField(e, 'email')} placeholder='Email' />
            </div>
            <div className='form-group'>
              <label>Password</label>
              <input type='password' className='form-control' placeholder='Password' value={this.state.password} onChange={(e) => this.changeField(e, 'password')} />
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
      </div>
    )
  }
}
