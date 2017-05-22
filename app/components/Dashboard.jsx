import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import * as actions from '../actions'
import SharePanel from './SharePanel'
import AccountPanel from './AccountPanel'
import FA from 'react-fontawesome'
import { getVoteSum } from '.././utilities/sbUtils'

export class Dashboard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      favoriteSbs: []
    }
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
          <h5>{sb.title}</h5>
          <span className='vote-total'>
            <span className='number'>{getVoteSum(sb.choices)}</span> votes
          </span>
        </Link>
        <span className='share-panel-outer-container'>
          <span className='dashboard-share-panel-outer-container'>
            <SharePanel altText={false} iconSize='small' sb={sb} alias={sb.alias} />
          </span>
        </span>
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
    return (
      <div>You have not yet created any snowballots. To create one,
        <Link to='/sbs/add' authed={this.props.user.uid}> click here</Link>
      </div>
    )
  }

  render () {
    const favorites = this.state.favoriteSbs.map((sb) => {
      return <div className='favorite-row' key={sb.id}>
        <FA name='star' className='fa fa-fw' />
        <Link to={`/sbs/${sb.alias}`}><h5>{sb.title}</h5></Link>
      </div>
    })
    return (
      <span id='dashboard'>
        <div className='dashboard-outer'>
          <AccountPanel />
          <div className='snowballots-section'>
            {typeof this.props.user.sbs !== 'undefined' && this.props.user.sbs.length > 0
            ? this.renderSbs()
            : this.renderNone() }
          </div>
          <div className='favorites-section'>
            <div>Favorites</div>
            {favorites}
          </div>
        </div>
      </span>
    )
  }
}

export default connect(state => state)(Dashboard)
