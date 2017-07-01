import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import * as actions from '../actions'
import SearchInput from 'react-search-input'
import FA from 'react-fontawesome'
import { getSearchResults, findLeader } from '.././utilities/ballotUtils'
import { pluralize } from '.././utilities/markupUtils'
import BallotListItem from './BallotListItem'
import LoadingSpinner from './LoadingSpinner'

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
    window.scrollTo(0, 0)
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
    return (
      <span>
        {this.state.sbs.length !== 0 &&
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
        </div>}
        {this.renderSbsOrLoader(this.state.sbs)}
      </span>
    )
  }

  sample (input) {
    console.log(input)
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

  render () {
    return <div id='discover'>{this.renderSearch()}</div>
  }
}

export default connect(state => state)(Discover)
