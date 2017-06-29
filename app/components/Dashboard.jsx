import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { connect } from 'react-redux'
import * as actions from '../actions'
import AccountPanel from './AccountPanel'
import LoadingSpinner from './LoadingSpinner'
import BallotListItem from './BallotListItem'
import FA from 'react-fontawesome'

export class Dashboard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      favoriteSbs: [],
      linkCopied: '',
      showCreated: false,
      showFavorited: false,
      showAll: true,
      showAccountPanel: false
    }
  }

  componentWillMount () {
    window.scrollTo(0, 0)
  }

  componentWillReceiveProps (nextProps) {
    this.getFavorites(nextProps)
  }

  componentDidMount () {
    this.props.dispatch(actions.findUserSbs(this.props.user.uid))
    this.props.dispatch(actions.findPublicSbs())
  }

  onLogout (e) {
    const { dispatch } = this.props
    e.preventDefault()
    dispatch(actions.logout())
  }

  getFavorites (props) {
    let favoriteIDs = []
    let favoriteSbs = []
    if (props.user.favorites) {
      Object.keys(props.user.favorites).forEach(function (favorite) {
        if (props.user.favorites[favorite]) favoriteIDs.push(favorite)
      })
      props.sbs.forEach(function (sb) {
        if (favoriteIDs.indexOf(sb.id) !== -1) {
          favoriteSbs.push(sb)
        }
      })
    }
    this.setState({ favoriteSbs })
  }

  renderSbs () {
    if (!this.props.user.sbs || Object.keys(this.props.user.sbs).length === 0) return
    const sortedSbs = this.props.user.sbs.sort((a, b) => b.createdAt - a.createdAt)
    return sortedSbs.map((sb, idx) => (
      <span key={`sb-${sb.createdAt}`} className='total-sb-container'>
        <Link to={`/sbs/${sb.alias}`} className='snowballot-container'>
          <BallotListItem sb={sb} sharePanel />
        </Link>
      </span>
    ))
  }

  previewImage () {
    const that = this
    const file = document.querySelector('#photo-file-input').files[0]
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function (e) {
      that.setState({photo: e.target.result, accountPanel: ''})
    }
  }

  renderNone () {
    if (!this.props.user || !this.props.user.sbs) return <LoadingSpinner />
    else {
      return (
        <div id='create-first-sb-text'>You have not yet created any snowballots.
          <Link to='/sbs/new' authed={this.props.user.uid}><FA name='plus' className='fa fa-fw' /> add a snowballot</Link>
        </div>
      )
    }
  }

  render () {
    const that = this
    const favorites = this.state.favoriteSbs.map((sb) => {
      return <div key={sb.id}>
        <Link to={`/sbs/${sb.alias}`}><ListItem type='favorite' sb={sb} sharePanel={false} /></Link>
      </div>
    })
    const filterClasses = (filterName) => {
      if (filterName === 'showAll') {
        return {
          'sb-filter': true,
          'active': this.state.showAll
        }
      }
      return {
        'sb-filter': true,
        'active': this.state[filterName] && !this.state.showAll
      }
    }
    const sbContent = function () {
      if (!that.state.showCreated && !that.state.showAll) return null
      return typeof that.props.user.sbs !== 'undefined' && that.props.user.sbs.length > 0 ? that.renderSbs() : that.renderNone()
    }
    const showFavoritedContent = () => that.state.showFavorited || that.state.showAll
    return (
      <div id='accent-container'>
        <span id='dashboard'>
          <div className='dashboard-outer'>
            <div id='account-settings-button-outer' className={this.state.showAccountPanel ? 'active' : ''}>
              <div id='account-settings-button' onClick={() => this.setState({showAccountPanel: !this.state.showAccountPanel})}>
                <FA name='gear' className='fa fa-fw' />{this.state.showAccountPanel ? 'Hide ' : ''}Account Settings
              </div>
            </div>
            {this.state.showAccountPanel && <AccountPanel />}
            {typeof that.props.user.sbs !== 'undefined' && that.props.user.sbs.length > 0 && <div id='dashboard-view-filter'>
              <span className={classnames(filterClasses('showCreated'))} onClick={() => this.setState({showCreated: true, showFavorited: false, showAll: false})}>My Snowballots</span>
              <span className={classnames(filterClasses('showFavorited'))} onClick={() => this.setState({showCreated: false, showFavorited: true, showAll: false})}>Favorites</span>
              <span className={classnames(filterClasses('showAll'))} onClick={() => this.setState({showCreated: true, showFavorited: true, showAll: true})}>All</span>
            </div>}
            <div className='snowballots-section'>
              {sbContent()}
            </div>
            {showFavoritedContent() && this.state.favoriteSbs && this.state.favoriteSbs.length > 0 && <span><div id='favorites-header'><FA name='star' className='fa fa-fw' />Favorites</div>
              <div className='favorites-section'>
                {favorites}
              </div>
            </span>}
          </div>
        </span>
      </div>
    )
  }
}

export default connect(state => state)(Dashboard)
