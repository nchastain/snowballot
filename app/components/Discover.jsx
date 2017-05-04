import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import * as actions from '../actions'
import SearchInput, {createFilter} from 'react-search-input'
import FA from 'react-fontawesome'
import classnames from 'classnames'
import { imagesRef } from '../firebase/constants'

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
    this.itemsPerPage = 16
    this.handlers = createHandlers(props.dispatch)
    this.state = {
      images: {},
      searchTerm: this.getSearchTermFromURL(props.history.location.search),
      itemsPerPage: this.itemsPerPage,
      numPages: props.sbs.length === 0
        ? 1
        : Math.ceil(props.sbs.length / this.itemsPerPage),
      currentPage: this.getCurrentPage(props.history.location.pathname)
    }
  }

  componentWillMount () {
    this.handlers.findPublicSbs()
    this.getSearchResults(this.state.searchTerm)
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      currentPage: this.getCurrentPage(nextProps.history.location.pathname),
      searchTerm: this.getSearchTermFromURL(nextProps.history.location.search),
      numPages: nextProps.sbs.length === 0
        ? 1
        : Math.ceil(this.getSearchResults(this.state.searchTerm).length / this.state.itemsPerPage)
    })
  }

  componentDidMount () {
    this.handlers.findPublicSbs()
  }

  getSearchTermFromURL (searchStr) {
    let pageStr = searchStr.substr(searchStr.lastIndexOf('=') + 1)
    return pageStr
  }

  getSearchResults (term) {
    const KEYS_TO_FILTERS = ['title']
    const filteredSbs = term !== ''
      ? this.props.sbs.filter(createFilter(term, KEYS_TO_FILTERS))
      : this.props.sbs
    return filteredSbs
  }

  searchUpdated (term) {
    if (this.state.currentPage !== 1) this.props.history.push(`/discover/page=1?q=${term}`)
    else {
      this.props.history.push(`/discover/page=1?q=${term}`)
      const filteredSbs = this.getSearchResults(term)
      const newNumPages = Math.ceil(filteredSbs.length / this.state.itemsPerPage)
      const parsedNumPages = newNumPages !== 0 ? newNumPages : 1
      this.setState({currentPage: 1, searchTerm: term || '', numPages: parsedNumPages || 1})
    }
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
            {this.renderSbs(this.getSearchResults(this.state.searchTerm))}
          </div>
        </div>
      </span>
    )
  }

  applyImageStyles (sb) {
    if (sb.hasMainImage) {
      let imageUrl = imagesRef.child(`${sb.privateAlias}/main`)
      let sbAlias = sb.privateAlias
      const that = this
      imageUrl.getDownloadURL().then(function (imageUrl) {
        that.setState({images: {...that.state.images, [sbAlias]: imageUrl}})
      })
    }
    return sb
  }

  renderSbs (sbs) {
    let startIdx = this.state.currentPage === 1 ? 0 : (this.state.currentPage - 1) * this.state.itemsPerPage
    let endIdx = startIdx + this.state.itemsPerPage
    if (document.querySelector('#discover-body-container')) {
      document.querySelector('#discover-body-container').style.paddingBottom =
        sbs.length - startIdx < (this.state.itemsPerPage / 2)
        ? 'calc(75% + 0.5rem - 12px)' // 4px per row appears to be the inline-block addition
        : '0.5rem'
    }
    const getBoxClasses = function (sb) {
      return {
        'sb-inner-container': true,
        'sb-with-image': sb.hasMainImage || false
      }
    }
    if (sbs.length === 0) return <div className='empty-search-results'>Sorry, no snowballots found for that search</div>
    let sortedSbs = sbs.slice(startIdx, endIdx).sort((a, b) => b.createdAt - a.createdAt)
    const that = this
    sortedSbs = sortedSbs.map(sb => this.applyImageStyles(sb))
    const getStyleObject = function (sb) {
      const imageUrl = `url('${that.state.images[sb.privateAlias]}')`
      if (sb.hasMainImage && imageUrl !== "url('undefined')") {
        return { 'backgroundImage': `${imageUrl}`, 'backgroundSize': 'cover' }
      } else return {}
    }
    return sortedSbs.map((sb, idx) => (
      <div className='sb-outer-container' key={`sb-${sb.createdAt}`} >
        <Link to={`/sbs/${sb.alias}`} className={classnames(getBoxClasses(sb))} style={getStyleObject(sb)}>
          <div><h4 className='snowballot-square-text'>{sb.title}</h4></div>
        </Link>
      </div>
    ))
  }

  renderPages () {
    const pages = []
    const fullPath = this.props.history.location.pathname
    const query = this.state.searchTerm !== '' ? `q=${this.state.searchTerm}` : ''
    for (let i = 1; i < this.state.numPages + 1; i++) {
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
      'disabled-arrow': this.getCurrentPage(fullPath) === this.state.numPages
    }

    const withPages = (
      <span>
        <div id='search-results-message'>{this.state.searchTerm !== '' ? `${this.getSearchResults(this.state.searchTerm).length} snowballots found` : ''}</div>
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
