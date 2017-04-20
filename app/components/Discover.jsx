import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

class Discover extends React.Component {
  renderSbs () {
    if (!this.props.sbs || this.props.sbs.length === 0) return
    const sortedSbs = this.props.sbs.sort((a, b) => b.createdAt - a.createdAt)
    return sortedSbs.map((sb, idx) => (
      <Link to={`/sbs/${sb.alias}`} key={`sb-${sb.createdAt}`} className='discover-snowballot-container'>
        <h4 className='snowballot-square-text'>{sb.title}</h4>
      </Link>
    ))
  }

  render () {
    return (
      <div>
        {this.renderSbs()}
      </div>
    )
  }
}

export default connect(state => state)(Discover)
