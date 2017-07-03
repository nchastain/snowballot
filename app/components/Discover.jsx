import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import * as actions from '../actions'
import SearchInput from 'react-search-input'
import FA from 'react-fontawesome'
import classnames from 'classnames'
import { getSearchResults, findLeader, popularityFilter } from '.././utilities/ballotUtils'
import { pluralize } from '.././utilities/markupUtils'
import BallotListItem from './BallotListItem'
import LoadingSpinner from './LoadingSpinner'

class Discover extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      images: {},
      sbs: [],
      searchTerm: this.getSearchTermFromURL(props.history.location.search) || '',
      sortType: 'new',
      itemsPerPage: 10,
      currentPage: 1
    }
  }

  componentWillMount () {
    window.scrollTo(0, 0)
    this.props.dispatch(actions.findPublicSbs())
    getSearchResults(this.state.searchTerm, this.props.sbs)
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      searchTerm: this.getSearchTermFromURL(nextProps.history.location.search),
      sbs: nextProps.sbs,
      currentPage: this.getCurrentPage(nextProps.history.location.pathname) > 0 ? this.getCurrentPage(nextProps.history.location.pathname) : 1
    })
  }

  componentDidMount () {
    this.props.dispatch(actions.findPublicSbs())
    getSearchResults(this.state.searchTerm, this.props.sbs)
  }

  getSearchTermFromURL (searchStr) {
    let pageStr = searchStr.substr(searchStr.lastIndexOf('=') + 1)
    return pageStr
  }

  searchUpdated (term) {
    this.props.history.push(`/discover/page=1?q=${term}`)
    if (this.state.currentPage === 1) {
      const filteredSbs = getSearchResults(term)
      const newNumPages = Math.ceil(filteredSbs.length / this.state.itemsPerPage)
      const parsedNumPages = newNumPages !== 0 ? newNumPages : 1
      this.setState({currentPage: 1, searchTerm: term || '', numPages: parsedNumPages || 1})
    }
  }

  renderSbsOrLoader (sbs) {
    if (sbs.length === 0) return <LoadingSpinner color='white' />
    else {
      return (
        <div id='discover-body-container'>
          <div id='discover-grid'>
            {this.renderSbs(getSearchResults(this.state.searchTerm, sbs))}
          </div>
        </div>
      )
    }
  }

  renderSearch () {
    const sortClasses = (sortType) => {
      return {
        'sort-option': true,
        'active': sortActive(sortType)
      }
    }
    const sortActive = (sortType) => sortType === this.state.sortType
    return (
      <span>
        {this.state.sbs.length !== 0 &&
        <span id='above-discover-section'>
          <div id='sort-ballots-content'>
            <div id='sort-ballots-key'>
              sort by:&nbsp;&nbsp;
              <div className={classnames(sortClasses('new'))} onClick={() => this.setState({sortType: 'new'})}>newest</div>
              <div className={classnames(sortClasses('popular'))} onClick={() => this.setState({sortType: 'popular'})}>most popular</div>
            </div>
          </div>
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
        </span>}
        {this.renderSbsOrLoader(this.state.sbs)}
      </span>
    )
  }

  renderSbs (sbs) {
    let startIdx = this.state.currentPage === 1 ? 0 : (this.state.currentPage - 1) * this.state.itemsPerPage
    let endIdx = startIdx + this.state.itemsPerPage
    if (sbs.length === 0 && this.state.searchTerm) return <div className='empty-search-results'>Sorry, no snowballots found for that search</div>
    let sortedSbs = sbs.slice(startIdx, endIdx)
    if (this.state.sortType === 'new') sortedSbs = sortedSbs.sort((a, b) => b.createdAt - a.createdAt)
    if (this.state.sortType === 'popular') sortedSbs = sortedSbs.sort((a, b) => popularityFilter(b) - popularityFilter(a))
    return sortedSbs.map((sb, idx) => (
      <div key={`sb-${sb.createdAt}`} >
        <Link to={`/sbs/${sb.alias}`}>
          <BallotListItem sb={sb} idx={idx} />
        </Link>
        <div className='leading-choice-container' style={{background: `${sb.color}`}}>
          <div className='leading-choice-label' style={{background: `${sb.lightColor}`, color: `${sb.color}`}}>leading</div>
          <div className='leading-choice-content'>{findLeader(sb.choices) ? findLeader(sb.choices).title : sb.choices[0].title}</div>
          <div className='leading-choice-votes' style={{
            color: `${sb.lightColor}`
          }}>
            {findLeader(sb.choices) ? findLeader(sb.choices).votes : '0'} vote{pluralize(findLeader(sb.choices))}
          </div>
        </div>
      </div>
    ))
  }

  getCurrentPage (fullURL) {
    let queryStr = fullURL.substr(fullURL.lastIndexOf('/') + 1)
    let pageStr = queryStr.substr(queryStr.lastIndexOf('=') + 1)
    if (pageStr === 'discover') return 1
    let pageNum = parseInt(pageStr)
    return pageNum
  }

  renderPages () {
    const pages = []
    const fullPath = this.props.history.location.pathname
    const query = this.state.searchTerm !== '' ? `q=${this.state.searchTerm}` : ''
    const searchResults = this.state.searchTerm ? getSearchResults(this.state.searchTerm, this.props.sbs) : this.props.sbs
    const numPages = Math.ceil(searchResults.length / this.state.itemsPerPage)
    for (let i = 1; i < numPages + 1; i++) {
      pages.push(
        <Link
          className={i === this.getCurrentPage(fullPath) ? 'active-page' : ''}
          key={i}
          id={`page-${i}`}
          to={`/discover/page=${i}?${query}`}>{i}
        </Link>
      )
    }

    const leftArrowClasses = {
      'page-arrow': true,
      'disabled-arrow': this.getCurrentPage(fullPath) === 1
    }

    const rightArrowClasses = {
      'page-arrow': true,
      'disabled-arrow': this.getCurrentPage(fullPath) === numPages
    }

    const withPages = (
      <span>
        <div className='pagination'>
          <div id='search-results-icons'>
            <Link
              className={classnames(leftArrowClasses)}
              to={`/discover/page=${this.getCurrentPage(fullPath) - 1}?q=${query}`}
            >
              &lsaquo;
            </Link>
            {pages}
            <Link
              className={classnames(rightArrowClasses)}
              to={`/discover/page=${this.getCurrentPage(fullPath) + 1}?q=${query}`}
            >
              &rsaquo;
            </Link>
          </div>
        </div>
      </span>
    )

    return (
      <span>
        {pages.length > 1 ? withPages : <div className='pagination' />}
      </span>
    )
  }

  render () {
    return (
      <div id='discover'>
        {this.renderSearch()}
        <div id='discover-pages'>{this.state.sbs.length > 0 && this.renderPages()}</div>
      </div>
    )
  }
}

export default connect(state => state)(Discover)
