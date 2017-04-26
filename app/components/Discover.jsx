import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import * as actions from '../actions'
import SearchInput, {createFilter} from 'react-search-input'
import FA from 'react-fontawesome'

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
    this.state = {
      searchTerm: ''
    }
  }

  componentDidMount () {
    this.handlers.findPublicSbs()
  }

  renderSbs (sbs) {
    const sortedSbs = sbs.sort((a, b) => b.createdAt - a.createdAt)
    return sortedSbs.map((sb, idx) => (
      <Link to={`/sbs/${sb.alias}`} key={`sb-${sb.createdAt}`}>
        <div className='discover-snowballot-container'><h4 className='snowballot-square-text'>{sb.title}</h4></div>
      </Link>
    ))
  }

  renderSearch () {
    if (!this.props.sbs || this.props.sbs.length === 0) return
    const KEYS_TO_FILTERS = ['title']
    const filteredSbs = this.props.sbs.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
    return (
      <span>
        <div>
          <FA name='search' className='fa-2x fa-fw search-icon' /><SearchInput className='search-input' onChange={(e) => this.searchUpdated(e)} />
        </div>
        {this.renderSbs(filteredSbs)}
      </span>
    )
  }

  searchUpdated (term) {
    this.setState({searchTerm: term})
  }

  render () {
    return (
      <div className='discover-container'>
        {this.renderSearch()}
      </div>
    )
  }
}

export default connect(state => state)(Discover)
