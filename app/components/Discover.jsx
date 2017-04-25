import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import * as actions from '../actions'

let createHandlers = function (dispatch) {
  let findPublicSbs = function () {
    dispatch(actions.findPublicSbs())
  }
  return {
    findPublicSbs
  }
}

class Discover extends React.Component {

  constructor (props) {
    super(props)
    this.handlers = createHandlers(this.props.dispatch)
  }

  componentDidMount () {
    this.handlers.findPublicSbs()
  }

  renderSbs () {
    if (!this.props.sbs || this.props.sbs.length === 0) return
    const sortedSbs = this.props.sbs.sort((a, b) => b.createdAt - a.createdAt)
    return sortedSbs.map((sb, idx) => (
      <Link to={`/sbs/${sb.alias}`} key={`sb-${sb.createdAt}`}>
        <div className='discover-snowballot-container'><h4 className='snowballot-square-text'>{sb.title}</h4></div>
      </Link>
    ))
  }

  render () {
    return (
      <div className='discover-container'>
        {this.renderSbs()}
      </div>
    )
  }
}

export default connect(state => state)(Discover)
