import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import * as actions from '../actions'
import SearchInput, {createFilter} from 'react-search-input'
import FA from 'react-fontawesome'
import classnames from 'classnames'

let createHandlers = function (dispatch) {
  let findPublicSbs = function () {
    dispatch(actions.findPublicSbs())
  }
  let startSearchSbs = function (searchTerm) {
    dispatch(actions.startSearchSbs(searchTerm))
  }
  return {
    findPublicSbs,
    startSearchSbs
  }
}

class Discover extends React.Component {
  constructor (props) {
    super(props)
    this.handlers = createHandlers(this.props.dispatch)
    this.state = {
      searchTerm: '',
      numPages: 1,
      currentPage: this.getCurrentPage(this.props.history.location.pathname)
    }
  }

  // setNumPages () {
  //   if (this.props.sbs && this.props.sbs.length > 0 && this.state.searchTerm !== '') {
  //     const KEYS_TO_FILTERS = ['title']
  //     const filteredSbs = this.props.sbs.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
  //     const numPages = Math.floor(filteredSbs / 5) === 0 ? 1 : Math.floor(filteredSbs / 5)
  //     this.setState({numPages})
  //   }
  // }

  // findNumPages () {
  //   const KEYS_TO_FILTERS = ['title']
  //   const filteredSbs = this.props.sbs.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
  //   const numPages = Math.floor(filteredSbs / 5) === 0 ? 1 : Math.floor(filteredSbs / 5)
  //   return numPages
  // }

  componentWillReceiveProps () {
    // let numPages = this.findNumPages()
    this.setState({
      currentPage: this.getCurrentPage(this.props.history.location.pathname),
      numPages: this.props.sbs.length === 0 ? 1 : Math.floor(this.props.sbs.length / 5)
    })
  }

  componentDidMount () {
    this.handlers.findPublicSbs()
  }

  renderSbs (sbs, page) {
    if (sbs.length === 0) return <div>Sorry, no snowballots found for that search</div>
    const startIdx = parseInt(this.state.currentPage) === 1 ? 0 : parseInt(this.state.currentPage) * 5
    const endIdx = startIdx + 5
    console.log(startIdx, endIdx)
    const sortedSbs = sbs.slice(startIdx, endIdx).sort((a, b) => b.createdAt - a.createdAt)
    return sortedSbs.map((sb, idx) => (
      <Link to={`/sbs/${sb.alias}`} key={`sb-${sb.createdAt}`}>
        <div className='discover-snowballot-container'><h4 className='snowballot-square-text'>{sb.title}</h4></div>
      </Link>
    ))
  }

  searchUpdated (term) {
    // this.handlers.startSearchSbs(term)
    this.setState({searchTerm: term})
  }

  renderSidebar () {
    return (
      <span>
        <div id='header'>Filters</div>
      </span>
    )
  }

  getCurrentPage (fullURL) {
    let queryStr = fullURL.substr(fullURL.lastIndexOf('/') + 1)
    let pageStr = queryStr.substr(queryStr.lastIndexOf('=') + 1)
    if (pageStr === 'discover') return 1
    let pageNum = parseInt(pageStr)
    return pageNum
  }

  renderSearch () {
    if (!this.props.sbs || this.props.sbs.length === 0) return
    const KEYS_TO_FILTERS = ['title']
    const filteredSbs = this.props.sbs.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
    return (
      <span>
        <div id='discover-search-bar'>
          <FA name='search' className='fa-2x fa-fw search-icon' /><SearchInput className='search-input' onChange={(e) => this.searchUpdated(e)} />
        </div>
        <div id='discover-body-container'>
          <div id='discover-sidebar'>
            {this.renderSidebar()}
          </div>
          <div id='discover-grid'>
            {this.renderSbs(filteredSbs)}
          </div>
        </div>
      </span>
    )
  }

  renderPages () {
    const pages = []
    const fullPath = this.props.history.location.pathname
    for (let i = 1; i < this.state.numPages + 1; i++) {
      pages.push(
        <Link
          className={i === this.getCurrentPage(fullPath) ? 'active-page' : ''}
          key={i}
          id={`page-${i}`}
          to={`/discover/page=${i}`}>{i}
        </Link>
      )
    }

    const leftArrowClasses = {
      'page-arrow': true,
      'disabled-arrow': this.getCurrentPage(fullPath) === 1
    }

    const rightArrowClasses = {
      'page-arrow': true,
      'disabled-arrow': this.getCurrentPage(fullPath) === this.state.numPages
    }

    return (
      <span>
        <div className='pagination'>
          <Link className={classnames(leftArrowClasses)} to={`/discover/page=${this.getCurrentPage(fullPath) - 1}`}>&lsaquo;</Link>
          {pages}
          <Link className={classnames(rightArrowClasses)} to={`/discover/page=${this.getCurrentPage(fullPath) + 1}`}>&rsaquo;</Link>
        </div>
      </span>
    )
  }

  render () {
    return (
      <div className='discover-container'>
        {this.renderSearch()}
        <div id='discover-pages'>
          {this.renderPages()}
        </div>
      </div>
    )
  }
}

export default connect(state => state)(Discover)
