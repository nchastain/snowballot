import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'
import * as actions from '.././actions'
import Redux from 'redux'

let createHandlers = function (dispatch) {
  let handleSubmit = function (title, alias, isPrivate, choices) {
    dispatch(actions.startAddSb(title, alias, isPrivate, choices))
  }
  return {
    handleSubmit
  }
}

class AddForm extends React.Component {
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
      adding: false,
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
    const alias = this.refs.sbalias.value.length > 0 ? this.refs.sbalias.value : title.replace(/\s+/g, '').substring(0, 10)
    const filteredChoices = this.state.choices.filter(function (choice) {
      let duplicate = false
      dupesObj[choice.title.toLowerCase()] ? duplicate = true : dupesObj[choice.title.toLowerCase()] = choice
      return choice.title.length > 0 && !duplicate
    })
    const isPrivate = this.refs.sbprivate.checked
    if (filteredChoices.length < 2) throw new Error('Snowballots must have at least 2 choices.')
    return {title, alias, isPrivate, filteredChoices}
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

  handleSubmit (e) {
    e.preventDefault()
    const validSb = this.validateSb()
    this.handlers.handleSubmit(validSb.title, validSb.alias, validSb.isPrivate, validSb.filteredChoices)
    this.setState({
      adding: false,
      isPrivate: false,
      title: '',
      alias: '',
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
          <input
            ref='sbalias'
            type='text'
            value={this.state.alias}
            placeholder='Enter custom URL of new snowballot - ex. foo => snowballot.com/foo'
            onChange={(e) => this.setState({alias: e.target.value})}
          />
          Make private?
          <input
            id='privateCheckbox'
            ref='sbprivate'
            type='checkbox'
            value={this.state.isPrivate}
            onChange={(e) => this.setState({isPrivate: e.target.checked})}
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
}

export default connect(state => state)(AddForm)