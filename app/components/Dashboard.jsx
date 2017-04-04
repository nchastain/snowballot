import React, { Component } from 'react'
import {connect} from 'react-redux'
import * as actions from 'actions'

let createHandlers = function (dispatch) {
  let handleSubmit = function (title, choice1, choice2) {
    dispatch(actions.startAddSb(title, choice1, choice2))
  }
  return {
    handleSubmit
  }
}

export class Dashboard extends Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handlers = createHandlers(this.props.dispatch)
  }

  handleSubmit (e) {
    e.preventDefault()
    let sbTitle = this.refs.sbtitle.value
    let sbChoice1 = this.refs.sbchoice1.value
    let sbChoice2 = this.refs.sbchoice2.value

    if (sbTitle.length > 0 && sbChoice1.length > 0 && sbChoice2.length > 0) {
      this.refs.sbtitle = ''
      this.refs.sbChoice1 = ''
      this.refs.sbChoice2 = ''
      this.handlers.handleSubmit(sbTitle, sbChoice1, sbChoice2)
    } else {
      this.refs.sbtitle.focus()
    }
  }

  render () {
    return (
      <div>
        <div className='snowballots-section'>
          <h1 className='text-center'>My Snowballots</h1>
        </div>
        <div className='newSnowballot-section'>
          <form ref='addSnowballotForm' onSubmit={this.handleSubmit}>
            <input ref='sbtitle' type='text' placeholder='Enter title of new snowballot' />
            <input ref='sbchoice1' type='text' placeholder='Enter name of Choice 1' />
            <input ref='sbchoice2' type='text' placeholder='Enter name of Choice 2' />
            <button id='newSnowballot' className='button primary expanded'> + create a new snowballot</button>
          </form>
        </div>
      </div>
    )
  }
}

export default connect()(Dashboard)
