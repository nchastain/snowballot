import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import * as actions from '../actions'

let createHandlers = function (dispatch) {
  let findUserSbs = function (userId) {
    dispatch(actions.findUserSbs(userId))
  }
  return {
    findUserSbs
  }
}

export class Dashboard extends Component {
  constructor (props) {
    super(props)
    this.handlers = createHandlers(this.props.dispatch)
  }

  componentDidMount () {
    this.handlers.findUserSbs(this.props.user.uid)
  }

  getVoteSum (choices) {
    let voteTotal = 0
    choices.forEach(function (choice) { voteTotal += choice.votes })
    return voteTotal
  }

  renderSbs () {
    if (!this.props.user.sbs || Object.keys(this.props.user.sbs).length === 0) return
    const sortedSbs = this.props.user.sbs.sort(function (a, b) { return b.createdAt - a.createdAt })
    return sortedSbs.map((sb, idx) => (
      <Link to={`/sbs/${sb.alias}`} key={`sb-${sb.createdAt}`} className='snowballot-container'>
        <h5>{sb.title}</h5>
        <span className='vote-total'><span className='number'>{this.getVoteSum(sb.choices)}</span> votes</span>
      </Link>
    ))
  }

  render () {
    return (
      <div className='snowballots-section'>
        {this.renderSbs()}
      </div>
    )
  }
}

export default connect(state => state)(Dashboard)
