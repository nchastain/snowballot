import React, { Component } from 'react'
import { connect } from 'react-redux'

class SbDetail extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sb: this.props.sbs.filter((sb) => (
      sb.id === this.props.match.params.id
    ))[0]
    }
    this.getChoices = this.getChoices.bind(this)
  }

  getChoices () {
    return this.state.sb.choices.map((choice) => (
      <div key={choice.id}>{choice.title}, {choice.votes} votes</div>
    ))
  }

  render () {
    return (
      <div>
        <h1>SbDetail for {this.state.sb.title}</h1>
        {this.getChoices()}
      </div>
    )
  }
}

export default connect(state => state)(SbDetail)
