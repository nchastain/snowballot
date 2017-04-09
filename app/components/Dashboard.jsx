import React, { Component } from 'react'
import {connect} from 'react-redux'
import * as actions from 'actions'

let createHandlers = function (dispatch) {
  let handleSubmit = function (title, choices) {
    dispatch(actions.startAddSb(title, choices))
  }
  return {
    handleSubmit
  }
}

export class Dashboard extends Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.addChoice = this.addChoice.bind(this)
    this.choiceUpdate = this.choiceUpdate.bind(this)
    this.validateSb = this.validateSb.bind(this)
    this.deleteChoice = this.deleteChoice.bind(this)
    this.checkTab = this.checkTab.bind(this)
    this.handlers = createHandlers(this.props.dispatch)
    this.state = {
      title: '',
      choices: [
        {title: '', votes: 0, id: 1},
        {title: '', votes: 0, id: 2}
      ]
    }
  }

  validateSb () {
    const title = this.refs.sbtitle.value
    if (title.length === 0) throw new Error('Snowballots must have a title.')
    const dupesObj = {}
    const filteredChoices = this.state.choices.filter(function (choice) {
      let duplicate = false
      dupesObj[choice.title.toLowerCase()] ? duplicate = true : dupesObj[choice.title.toLowerCase()] = choice
      return choice.title.length > 0 && !duplicate
    })
    if (filteredChoices.length < 2) throw new Error('Snowballots must have at least 2 choices.')
    return {title, filteredChoices}
  }

  handleSubmit (e) {
    e.preventDefault()
    const validSb = this.validateSb()
    this.handlers.handleSubmit(validSb.title, validSb.filteredChoices)
    this.setState({
      title: '',
      choices: [
        {
          title: '',
          votes: 0,
          id: 1
        },
        {
          title: '',
          votes: 0,
          id: 2
        }
      ]
    })
  }

  renderChoices () {
    return this.state.choices.map((choice) => (
      <div key={`choice-container-${choice.id}`} className='choice-container input-group'>
        <input
          key={`choice-${choice.id}`}
          className='choice-input input-group-field'
          id={`choice-${choice.id}`}
          value={choice.title}
          type='text'
          placeholder={`Enter name of Choice ${choice.id}`}
          onKeyDown={this.checkTab}
          onChange={this.choiceUpdate}
        />
        <div
          key={`delete-${choice.id}`}
          id={`delete-${choice.id}`}
          className='delete-choice-button button alert input-group-button'
          onClick={this.deleteChoice}
        >
          &times;
        </div>
      </div>
    ))
  }

  renderSbs () {
    if (!this.props.sbs || this.props.sbs.length === 0) return
    return this.props.sbs.reverse().map((sb, idx) => (
      <div key={sb.title + idx} className='snowballot-container'>
        <h4>{sb.title}</h4>
        <ul>
          {sb.choices.map((choice, idx) => (
            <li key={sb.title + idx}>{choice.votes} votes, {choice.title}</li>
          ))}
        </ul>
      </div>
    ))
  }

  choiceUpdate (e) {
    const position = parseInt(e.target.id.match(/\d+$/).join(''))
    const updatedChoices = this.state.choices.map((choice) => {
      if (choice.id === position) choice.title = e.target.value
      return choice
    })
    this.setState({
      choices: updatedChoices
    })
  }

  checkTab (e) {
    // checks if user pressed tab key and on last input
    const idx = parseInt(e.target.id.match(/\d+$/).join(''))
    if (e.keyCode === 9 && idx === this.state.choices.length) {
      this.addChoice()
    }
  }

  addChoice () {
    const newChoice = {
      title: '',
      votes: 0,
      id: this.state.choices.length + 1
    }
    this.setState({
      choices: [...this.state.choices, newChoice]
    })
  }

  deleteChoice (e) {
    const idx = parseInt(e.target.id.match(/\d+$/).join(''))
    const updatedChoices = this.state.choices.filter((choice) => {
      return choice.id !== idx
    })
    this.setState({choices: updatedChoices})
  }

  render () {
    return (
      <div>
        <div className='snowballots-section'>
          <h1 className='text-center'>My Snowballots</h1>
          {this.renderSbs()}
        </div>
        <div className='newSnowballot-section'>
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
            <button id='newSnowballot' className='button primary expanded'> + create a new snowballot</button>
          </form>
        </div>
      </div>
    )
  }
}

export default connect(state => state)(Dashboard)
