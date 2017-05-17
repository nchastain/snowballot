import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import * as actions from '../actions'
import SearchInput from 'react-search-input'
import FA from 'react-fontawesome'
import classnames from 'classnames'
import { imagesRef } from '../firebase/constants'
import PageList from './PageList'
import { getCurrentPage } from '.././utilities/generalUtils'
import { getSearchResults } from '.././utilities/sbUtils'

class Discover extends React.Component {
  constructor (props) {
    super(props)
    this.itemsPerPage = 16
    this.state = {
      images: {},
      searchTerm: this.getSearchTermFromURL(props.history.location.search) || ' ',
      itemsPerPage: this.itemsPerPage,
      numPages: props.sbs.length === 0
        ? 1
        : Math.ceil(props.sbs.length / this.itemsPerPage),
      currentPage: getCurrentPage(props.history.location.pathname) || 1
    }
  }

  componentWillMount () {
    this.props.dispatch(actions.findPublicSbs())
    getSearchResults(this.state.searchTerm, this.props.sbs)
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      currentPage: getCurrentPage(nextProps.history.location.pathname),
      searchTerm: this.getSearchTermFromURL(nextProps.history.location.search),
      numPages: nextProps.sbs.length === 0
        ? 1
        : Math.ceil(getSearchResults(this.state.searchTerm, this.props.sbs).length / this.state.itemsPerPage)
    })
    this.getImages(this.props.sbs)
  }

  componentDidMount () {
    this.props.dispatch(actions.findPublicSbs())
  }

  getSearchTermFromURL (searchStr) {
    let pageStr = searchStr.substr(searchStr.lastIndexOf('=') + 1)
    return pageStr
  }

  searchUpdated (term) {
    if (this.state.currentPage !== 1) this.props.history.push(`/discover/page=1?q=${term}`)
    else {
      this.props.history.push(`/discover/page=1?q=${term}`)
      const filteredSbs = getSearchResults(term, this.props.sbs)
      const newNumPages = Math.ceil(filteredSbs.length / this.state.itemsPerPage)
      const parsedNumPages = newNumPages !== 0 ? newNumPages : 1
      this.setState({currentPage: 1, searchTerm: term || '', numPages: parsedNumPages || 1})
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
            {this.renderSbs(getSearchResults(this.state.searchTerm, this.props.sbs))}
          </div>
        </div>
      </span>
    )
  }

  getImages (sbs) {
    const that = this
    sbs.forEach(function (sb) {
      if (sb.hasMainImage) {
        let imageUrl = imagesRef.child(`${sb.privateAlias}/main`)
        let sbAlias = sb.privateAlias
        imageUrl.getDownloadURL().then(function (imageUrl) {
          that.setState({images: {...that.state.images, [sbAlias]: imageUrl}})
        })
      }
    })
  }

  renderSbs (sbs) {
    let startIdx = this.state.currentPage === 1 ? 0 : (this.state.currentPage - 1) * this.state.itemsPerPage
    let endIdx = startIdx + this.state.itemsPerPage
    if (document.querySelector('#discover-body-container')) {
      document.querySelector('#discover-body-container').style.paddingBottom =
        sbs.length - startIdx < (this.state.itemsPerPage / 2)
        ? 'calc(75% + 0.5rem - 12px)'
        : '0.5rem'
    }
    const getBoxClasses = (sb) => {
      return {
        'sb-inner-container': true,
        'sb-with-image': sb.hasMainImage || false
      }
    }
    if (sbs.length === 0) return <div className='empty-search-results'>Sorry, no snowballots found for that search</div>
    let sortedSbs = sbs.slice(startIdx, endIdx).sort((a, b) => b.createdAt - a.createdAt)
    const that = this
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

  render () {
    return (
      <div id='discover'>
        {this.renderSearch()}
        <PageList history={this.props.history.location.pathname} searchTerm={this.state.searchTerm} numPages={this.state.numPages} sbs={this.props.sbs} />
      </div>
    )
  }
}

export default connect(state => state)(Discover)
