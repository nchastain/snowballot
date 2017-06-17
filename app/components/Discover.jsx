import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import * as actions from '../actions'
import SearchInput from 'react-search-input'
import FA from 'react-fontawesome'
import { getSearchResults } from '.././utilities/sbUtils'
import ListItem from './ListItem'

class Discover extends React.Component {
  constructor (props) {
    super(props)
    this.itemsPerPage = 16
    this.state = {
      images: {},
      sbs: [],
      searchTerm: this.getSearchTermFromURL(props.history.location.search) || ''
    }
  }

  componentWillMount () {
    this.props.dispatch(actions.findPublicSbs())
    getSearchResults(this.state.searchTerm, this.props.sbs)
  }

  componentWillReceiveProps (nextProps) {
    this.setState({searchTerm: this.getSearchTermFromURL(nextProps.history.location.search), sbs: nextProps.sbs})
  }

  componentDidMount () {
    this.props.dispatch(actions.findPublicSbs())
  }

  getSearchTermFromURL (searchStr) {
    let pageStr = searchStr.substr(searchStr.lastIndexOf('=') + 1)
    return pageStr
  }

  searchUpdated (term) {
    this.props.history.push(`/discover?q=${term}`)
    this.setState({searchTerm: term || ''})
  }

  renderSbsOrLoader (sbs) {
    if (sbs.length === 0) {
      return (
        <span>
          <FA className="fa fa-spin fa-3x fa-fw" name='spinner' />
          <span className="sr-only">Loading...</span>
        </span>
      )
    }
    else {
      return this.renderSbs(getSearchResults(this.state.searchTerm, sbs))
    }
  }

  renderSearch () {
    return (
      <span>
        <div id='discover-search-bar'>
          <FA
            name='search'
            className='fa-2x fa-fw search-icon'
          />
          <SearchInput
            className='search-input'
            value={this.state.searchTerm}
            onChange={(e) => this.searchUpdated(e)}
          />
        </div>
        <div id='discover-body-container'>
          <div id='discover-grid'>
            {this.renderSbsOrLoader(this.state.sbs)}
          </div>
        </div>
      </span>
    )
  }

  renderSbs (sbs) {
    let startIdx = this.state.currentPage === 1 ? 0 : (this.state.currentPage - 1) * this.state.itemsPerPage
    if (document.querySelector('#discover-body-container')) {
      document.querySelector('#discover-body-container').style.paddingBottom =
        sbs.length - startIdx < (this.state.itemsPerPage / 2)
        ? 'calc(75% + 0.5rem - 12px)'
        : '0.5rem'
    }
    if (sbs.length === 0 && this.state.searchTerm) return <div className='empty-search-results'>Sorry, no snowballots found for that search</div>
    let sortedSbs = sbs.sort((a, b) => b.createdAt - a.createdAt)
    return sortedSbs.map((sb, idx) => (
      <div key={`sb-${sb.createdAt}`} >
        <Link to={`/sbs/${sb.alias}`}>
          <ListItem sb={sb} />
        </Link>
      </div>
    ))
  }

  render () {
    return <div id='accent-container'><div id='discover'>{this.renderSearch()}</div></div>
  }
}

export default connect(state => state)(Discover)
