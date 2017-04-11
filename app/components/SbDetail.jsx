import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import * as actions from '../actions'

let createHandlers = function (dispatch) {
  let handleSubmit = function (title, choices) {
    dispatch(actions.startAddSb(title, choices))
  }
  return {
    handleSubmit
  }
}

export class SbDetail extends Component {
  constructor (props) {
    super(props)
    this.handlers = createHandlers(this.props.dispatch)
    this.state = {
      title: '',
      adding: false,
      choices: [
        {title: '', votes: 0, id: 1},
        {title: '', votes: 0, id: 2}
      ]
    }
  }

  renderAdd () {
    return this.state.adding
      ? <div className='newSnowballot-section'>
        <form id='newSnowballotForm' ref='addSnowballotForm' onSubmit={this.handleSubmit}>
          <input
            ref='sbtitle'
            type='text'
            value={this.state.title}
            placeholder='Enter title of new snowballot'
            onChange={(e) => this.setState({title: e.target.value})}
          />
          {this.renderChoices()}
          <div id='addchoice' className='button secondary' onClick={this.addChoice}>+ add choice</div>
          <div id='submitSnowballot' className='button primary' onClick={this.handleSubmit}>+ create snowballot</div>
        </form>
      </div>
      : <button
          id='newSnowballot'
          className='button primary expanded'
          onClick={() => this.setState({ adding: true })}
        >
          + create a new snowballot
        </button>
  }

  renderSb () {
    if (!this.props.sbs || this.props.sbs.length === 0) return
    const matchedSb = this.props.sbs.filter((sb) => sb.id === this.props.match.params.id)
    return matchedSb.map((sb, idx) => (
      <div>
        <h4>{sb.title}</h4>
        <ul>
        {sb.choices.map((choice) => <li>{choice.votes} votes, {choice.title}</li>)}
        </ul>
      </div>
    ))
  }

  render () {
    return (
      <div>
        <Link to='/dashboard/snowballots'>Back to dashboard</Link>
        <br />
        <br />
        <div className='snowballots-section'>
          {this.renderSb()}
        </div>
      </div>
    )
  }
}

export default connect(state => state)(SbDetail)
