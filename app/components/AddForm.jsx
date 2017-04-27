import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'
import * as actions from '.././actions'
import Redux from 'redux'
import DateTime from 'react-datetime'
import uuid from 'uuid'
import Tagger from './Tagger'
import classnames from 'classnames'

let createHandlers = function (dispatch) {
  let handleSubmit = function (options, choices) {
    dispatch(actions.startAddSb(options, choices))
  }
  return {
    handleSubmit
  }
}

const initialState = {
  optionsExpanded: false,
  title: '',
  alias: '',
  doesExpire: false,
  isPrivate: false,
  isExtensible: false,
  choices: [
    {title: '', votes: 0, id: 1},
    {title: '', votes: 0, id: 2}
  ],
  tags: [],
  suggestions: []
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
    this.handleAdd = this.handleAdd.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handlers = createHandlers(this.props.dispatch)
    this.state = initialState
  }

  validateSb () {
    if (this.state.title.length === 0) throw new Error('Snowballots must have a title.')
    const title = this.state.title
    const privateAlias = uuid.v4().replace(/-/g, '').substring(0, 10)
    const publicAlias = this.state.alias.length > 0 ? this.state.alias : title.replace(/\s+/g, '').substring(0, 10)
    const alias = this.state.isPrivate ? privateAlias : publicAlias
    const dupesObj = {}
    const filteredChoices = this.state.choices.filter(function (choice) {
      let duplicate = false
      dupesObj[choice.title.toLowerCase()] ? duplicate = true : dupesObj[choice.title.toLowerCase()] = choice
      return choice.title.length > 0 && !duplicate
    })
    const isPrivate = this.state.isPrivate
    const expires = this.state.expires || null
    const isExtensible = this.state.isExtensible || false
    const description = this.state.description || ''
    const tags = this.state.tags || []
    if (filteredChoices.length < 2) throw new Error('Snowballots must have at least 2 choices.')
    const options = {
      title: title,
      alias: alias,
      isPrivate: isPrivate,
      expires: expires,
      isExtensible: isExtensible,
      tags: tags,
      description: description
    }
    return {options, filteredChoices}
  }

  handleDelete (i) {
    let tags = this.state.tags
    tags.splice(i, 1)
    this.setState({tags: tags})
  }

  handleAdd (tag) {
    let tags = this.state.tags
    tags.push({
        id: tags.length + 1,
        text: tag
    })
    this.setState({tags: tags})
  }

  renderChoices () {
    return this.state.choices.map((choice) => (
      <div key={`choice-container-${choice.id}`} className='choice-container input-group'>
        <input
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
    this.setState(initialState, function () {
      this.setState({choices: [ //  not only do I have to inexplicably use a callback here, but I have to specify this piece of state.
        {title: '', votes: 0, id: 1},
        {title: '', votes: 0, id: 2}
      ]})
    })
    this.handlers.handleSubmit(validSb.options, validSb.filteredChoices)
    this.props.history.push(`/sbs/${validSb.options.alias}`)
  }

  choiceUpdate (e) {
    const position = parseInt(e.target.id.match(/\d+$/).join(''))
    const updatedChoices = this.state.choices.map((choice) => {
      if (choice.id === position) choice.title = e.target.value
      return choice
    })
    this.setState({ choices: updatedChoices })
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

  toggleOptionsMenu () {
    this.setState({optionsExpanded: !this.state.optionsExpanded})
    console.log('optionsExpanded is now' + this.state.optionsExpanded)
  }

  render () {
    const showToggleText = <div>SHOW<FA name='caret-right' className='fa-2x fa-fw' /></div>
    const hideToggleText = <div>HIDE<FA name='caret-down' className='fa-2x fa-fw' /></div>
    const optionsClass = {
      expanded: this.state.optionsExpanded
    }
    return <div className='newSnowballot-section'>
      <form id='newSnowballotForm' ref='addSnowballotForm' onSubmit={this.handleSubmit}>
        <input
          type='text'
          value={this.state.title}
          placeholder='Enter title of new snowballot'
          onChange={(e) => this.setState({title: e.target.value})}
        />
        <div className='newSbOptions newSbSection'>
          <div id='options-top' onClick={() => this.toggleOptionsMenu()}>
            <div className='header'>Options</div>
            <div id='toggleOptionsMenu' onClick={() => this.toggleOptionsMenu()}>{this.state.optionsExpanded ? hideToggleText : showToggleText}</div>
          </div>
          <div id='real-options-section' className={classnames(optionsClass)}>
            <span className='option-section expire-section'>
              <FA name='calendar-times-o' className='fa-2x fa-fw' /> Make snowballot expire at a certain time?
              <input
                id='expireCheckbox'
                type='checkbox'
                value={this.state.doesExpire}
                onChange={(e) => this.setState({doesExpire: e.target.checked})}
              />
              {this.state.doesExpire
                ? <span className='date-selector'>
                    <div className='date-holder'>
                      <DateTime
                        inputProps={{placeholder: 'Enter an expiration date'}}
                        value={this.state.expires || ''}
                        onChange={(data) => this.setState({expires: DateTime.moment(data).format('MM/DD/YYYY h:mm a')})}
                        closeOnSelect={true}
                      />
                    </div>
                    <br />
                  </span>
                : <br /> }
            </span>
            <span className='option-section'>
              <FA name='eye-slash' className='fa-2x fa-fw' /> Make snowballot private?
              <input
                id='privateCheckbox'
                type='checkbox'
                checked={this.state.isPrivate}
                onChange={(e) => this.setState({isPrivate: e.target.checked})}
              />
            </span>

            <span className='option-section'>
              { !this.state.isPrivate
              ? <span className='custom-url'>
                  <FA name='snowflake-o' className='fa-2x fa-fw' /><span>Add a custom URL?&#58; snowballot.com&#47;sbs&#47;</span>
                  <input
                    type='text'
                    value={this.state.alias}
                    onChange={(e) => this.setState({alias: e.target.value})}
                  />
                </span>
              : <span className='custom-url' style={{opacity: '0.5'}} >
                  <FA name='snowflake-o' className='fa-2x fa-fw' /><span className='private-hex-text'>(Sorry, custom URLs unavailable for private snowballots)</span>
                </span>
              }
            </span>

            <span className='option-section'>
              <FA name='users' className='fa-2x fa-fw' /> Allow others to add new choices?
              <input
                id='extensibleCheckbox'
                type='checkbox'
                checked={this.state.isExtensible}
                onChange={(e) => this.setState({isExtensible: e.target.checked})}
              />
            </span>

            <span className='option-section' >
              <FA name='pencil' className='fa-2x fa-fw' /> Add a description for this snowballot?
              <textarea
                id='sbDescription'
                value={this.state.description}
                onChange={(e) => this.setState({description: e.target.value})}
              />
            </span>

            <span className='option-section' id='tag-section'>
              <FA name='tags' className='fa-2x fa-fw' /> Add tags to this snowballot?
              <Tagger
                className='tag-holder'
                handleAdd={this.handleAdd}
                handleDelete={this.handleDelete}
                tags={this.state.tags}
                suggestions={this.state.suggestions}
              />
            </span>
          </div>
        </div>
        <div className='newSbSection newSbChoices'>
          <div className='header'>Choices</div>
          {this.renderChoices()}
          <div id='addchoice' className='button secondary' onClick={this.addChoice}><FA name='plus' className='fa fa-fw' /> add choice</div>
        </div>
        <div id='submitSnowballot' className='button primary' onClick={this.handleSubmit}><FA name='plus' className='fa fa-fw' /> create snowballot</div>
      </form>
    </div>
  }
}

export default connect(state => state)(AddForm)
