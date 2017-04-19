import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'
import * as actions from '.././actions'
import Redux from 'redux'

let createHandlers = function (dispatch) {
  let updateSb = function (id, choiceId, updatedSb) {
    dispatch(actions.startUpdateSb(id, choiceId, updatedSb))
  }
  return {
    updateSb
  }
}

export class SbDetail extends Component {
  constructor (props) {
    super(props)
    let matchedSb, matchedSbItem
    let voted = false
    let votedChoiceId = ''
    if (props.sbs && props.sbs.length !== 0) {
      matchedSb = props.sbs.filter((sb) => sb.alias === props.match.params.alias)
      matchedSbItem = matchedSb[0]
      voted = Boolean(props.auth.votes[matchedSbItem.id])
      votedChoiceId = voted ? props.auth.votes[matchedSbItem.id] : ''
    }
    this.state = {
      voted,
      votedChoiceId
    }
    this.handlers = createHandlers(this.props.dispatch)
  }

  componentWillReceiveProps (nextProps) {
    let matchedSb, matchedSbItem
    let voted = false
    let votedChoiceId = ''
    if (nextProps.sbs && nextProps.sbs.length !== 0 && nextProps.auth.votes && nextProps.auth.votes.length !== 0) {
      matchedSb = nextProps.sbs.filter((sb) => sb.alias === nextProps.match.params.alias)
      matchedSbItem = matchedSb[0]
      voted = Boolean(nextProps.auth.votes[matchedSbItem.id])
      votedChoiceId = voted ? nextProps.auth.votes[matchedSbItem.id] : ''
    }
    this.setState({voted, votedChoiceId})
  }

  vote (sb, choiceId) {
    this.setState({voted: true, votedChoiceId: choiceId})
    var updatedChoices = sb.choices.map((choice) => {
      if (choice.id === choiceId) choice.votes++
      return choice
    })
    var updatedSb = {
      ...sb,
      choices: updatedChoices
    }
    this.handlers.updateSb(sb.id, choiceId, updatedSb)
  }

  renderSelectedChoice (choice) {
    return choice.id === this.state.votedChoiceId
    ? <span>
        <span
          className='circle-full selected'
        >
          <FA name='check-circle' />
        </span>
        <span
          className='circle not-selected'
        >
          <FA name='circle-o' />
        </span>
      </span>
    : <span>
        <span
          className='circle'
        >
          <FA name='circle-o' />
        </span>
        <span
          className='circle-full'
        >
          <FA name='check-circle' />
        </span>
      </span>
  }

  renderVotedSb () {
    const matchedSb = this.props.sbs.filter((sb) => sb.alias === this.props.match.params.alias)
    return matchedSb.map((sb, idx) => (
      <div key={sb.id}>
        <h4 className='sb-title'>{sb.title}</h4>
        <ul className='sb-choices'>
          {sb.choices.map((choice, idx) =>
            <div
              key={choice.title + idx}
              className={choice.id === this.state.votedChoiceId ? 'box-header-voted selected clearfix' : 'box-header-voted clearfix'}
            >
              <div className='left-cell'>
                {this.renderSelectedChoice(choice)}
              </div>
              <div className='right-cell'>
                <li key={sb.id + choice.title + idx}>{choice.title}</li>
              </div>
              <div className='right-cell'>
                <span className='vote-count'>{choice.votes} votes<span className='plus'> + 1?</span></span>
              </div>
            </div>
          )}
        </ul>
      </div>
    ))
  }

  renderSb () {
    if (!this.props.sbs || this.props.sbs.length === 0) return
    const matchedSb = this.props.sbs.filter((sb) => sb.alias === this.props.match.params.alias)
    return this.state.voted ? this.renderVotedSb() : matchedSb.map((sb, idx) => (
      <div key={sb.id}>
        <h4 className='sb-title'>{sb.title}</h4>
        <ul className='sb-choices'>
          {sb.choices.map((choice, idx) =>
            <div
              key={choice.title + idx}
              className='box-header clearfix'
              onClick={() => this.state.voted ? null : this.vote(sb, choice.id)}
            >
              <div className='left-cell'>
                <span
                  className='circle'
                >
                  <FA name='circle-o' />
                </span>
                <span
                  className='circle-full'
                >
                  <FA name='check-circle' />
                </span>
              </div>
              <div className='right-cell'>
                <li key={sb.id + choice.title + idx}>{choice.title}</li>
              </div>
              <div className='right-cell'>
                <span className='vote-count'>{choice.votes} votes<span className='plus'> + 1?</span></span>
              </div>
            </div>
          )}
        </ul>
      </div>
    ))
  }

  render () {
    return (
      <div>
        <div>
          <div className='back-button-container'>
            <FA name='arrow-left' className='back-arrow' />
            <Link to='/discover'>Back to Discover</Link>
          </div>
        </div>
        <div className='alert-container'>
          <span className={this.state.voted ? 'status-message voted' : 'status-message'}>thank you for contributing to this snowballot!</span>
        </div>
        <div className='snowballots-section'>
          {this.renderSb()}
        </div>
      </div>
    )
  }
}

export default connect(state => state)(SbDetail)
