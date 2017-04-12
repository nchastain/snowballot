import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'
import * as actions from 'actions'
import Redux from 'redux'

let createHandlers = function (dispatch) {
  let vote = function (sbId, choiceId) {
    dispatch(actions.addVote(sbId, choiceId))
  }
  return {
    vote
  }
}

export class SbDetail extends Component {
  constructor (props) {
    super(props)
    this.handlers = createHandlers(this.props.dispatch)
  }

  vote (sbId, choiceId) {
    this.handlers.vote(sbId, choiceId)
    console.log(sbId, choiceId)
  }

  renderSb () {
    if (!this.props.sbs || this.props.sbs.length === 0) return
    const matchedSb = this.props.sbs.filter((sb) => sb.alias === this.props.match.params.alias)
    return matchedSb.map((sb, idx) => (
      <div key={sb.id}>
        <h4 className='sb-title'>{sb.title}</h4>
        <ul className='sb-choices'>
          {sb.choices.map((choice, idx) =>
            <div key={choice.title + idx} className='box-header clearfix' onClick={() => this.vote(sb.id, choice.id)}>
              <div className='left-cell'>
                <div className='button tiny' onClick={() => this.vote(sb.id, choice.id)}><FA name='arrow-up fa-3x' /></div>
              </div>
              <div className='right-cell'>
                <li key={sb.id + choice.title + idx}>{choice.title}</li>
              </div>
              <div className='right-cell'>
                <span className='vote-count'>{choice.votes} votes</span>
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
