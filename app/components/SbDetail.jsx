import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'
import * as actions from 'actions'
import Redux from 'redux'

let createHandlers = function (dispatch) {
  let updateSb = function (id, updatedSb) {
    dispatch(actions.startUpdateSb(id, updatedSb))
  }
  return {
    updateSb
  }
}

export class SbDetail extends Component {
  constructor (props) {
    super(props)
    this.handlers = createHandlers(this.props.dispatch)
  }

  vote (sb, choiceId) {
    var updatedChoices = sb.choices.map((choice) => {
      if (choice.id === choiceId) choice.votes++
      return choice
    })
    var updatedSb = {
      ...sb,
      choices: updatedChoices
    }
    this.handlers.updateSb(sb.id, updatedSb)
    console.log(sb.id, updatedSb)
  }

  renderSb () {
    if (!this.props.sbs || this.props.sbs.length === 0) return
    const matchedSb = this.props.sbs.filter((sb) => sb.alias === this.props.match.params.alias)
    return matchedSb.map((sb, idx) => (
      <div key={sb.id}>
        <h4 className='sb-title'>{sb.title}</h4>
        <ul className='sb-choices'>
          {sb.choices.map((choice, idx) =>
            <div key={choice.title + idx} className='box-header clearfix' onClick={() => this.vote(sb, choice.id)}>
              <div className='left-cell'>
                <span className='circle'><FA name='circle-o' /></span>
                <span className='circle-full'><FA name='check-circle' /></span>
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
            <Link to='/dashboard/snowballots'>Back to dashboard</Link>
          </div>
        </div>
        <div className='snowballots-section'>
          {this.renderSb()}
        </div>
      </div>
    )
  }
}

export default connect(state => state)(SbDetail)
