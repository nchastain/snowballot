import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import * as actions from '../actions'
import AddForm from './AddForm'

export class Dashboard extends Component {
  constructor (props) {
    super(props)
  }

  renderSbs () {
    if (!this.props.sbs || this.props.sbs.length === 0) return
    const mySbs = this.props.sbs.filter((sb) => {
      return sb.creator === this.props.auth.uid
    })
    const sortedSbs = mySbs.sort(function (a, b) { return b.createdAt - a.createdAt })
    return sortedSbs.map((sb, idx) => (
      <Link to={`/sbs/${sb.alias}`} key={`sb-${sb.createdAt}`} className='snowballot-container'>
        <h4>{sb.title}</h4>
      </Link>
    ))
  }

  render () {
    return (
      <div>
        <div className='snowballots-section'>
          {this.renderSbs()}
        </div>
        <AddForm />
      </div>
    )
  }
}

export default connect(state=>state)(Dashboard)
