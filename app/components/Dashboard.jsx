import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { logout } from '../firebase/auth'
import * as actions from '../actions'
import SharePanel from './SharePanel'
import FA from 'react-fontawesome'

let createHandlers = function (dispatch) {
  let findUserSbs = function (userId) {
    dispatch(actions.findUserSbs(userId))
  }
  return {
    findUserSbs
  }
}

export class Dashboard extends Component {
  constructor (props) {
    super(props)
    this.handlers = createHandlers(this.props.dispatch)
    this.state = {
      favoriteSbs: []
    }
  }

  onLogout (e) {
    const { dispatch } = this.props
    e.preventDefault()
    dispatch(actions.logout())
  }

  componentDidMount () {
    this.handlers.findUserSbs(this.props.user.uid)
    this.props.dispatch(actions.findPublicSbs())
  }

  componentWillReceiveProps (nextProps) {
    this.getFavorites(nextProps)
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

  getVoteSum (choices) {
    let voteTotal = 0
    choices.forEach(function (choice) { voteTotal += choice.votes })
    return voteTotal
  }

  renderSbs () {
    if (!this.props.user.sbs || Object.keys(this.props.user.sbs).length === 0) return
    const sortedSbs = this.props.user.sbs.sort(function (a, b) { return b.createdAt - a.createdAt })
    return sortedSbs.map((sb, idx) => (
      <span key={`sb-${sb.createdAt}`} className='total-sb-container'>
        <Link to={`/sbs/${sb.alias}`} className='snowballot-container'>
          <h5>{sb.title}</h5>
          <span className='vote-total'><span className='number'>{this.getVoteSum(sb.choices)}</span> votes</span>
        </Link>
        <span className='share-panel-outer-container'>
          <span className='dashboard-share-panel-outer-container'><SharePanel altText={false} iconSize='small' /></span>
        </span>
      </span>
    ))
  }

  renderNone () {
    return <div>You have not yet created any snowballots. To create one, <Link to='/sbs/add' authed={this.props.user.uid}>click here</Link></div>
  }

  render () {
    const photoLogout = <div id='dashboard-profile-image' ><img className='right' src={this.props.user.photoURL} /></div>
    const favorites = this.state.favoriteSbs.map((sb) => <div className='favorite-row' key={sb.id}><FA name='star' className='fa fa-fw' /><Link to={`/sbs/${sb.alias}`}><h5>{sb.title}</h5></Link></div>)
    return (
      <span id='dashboard'>
        <div className='dashboard-outer'>
          <div className='snowballots-section'>
            {typeof this.props.user.sbs !== 'undefined' && this.props.user.sbs.length > 0 ? this.renderSbs() : this.renderNone() }
          </div>
          <div className='favorites-section'>
            <div>Favorites</div>
            {favorites}
          </div>
          <div
            id='logout-button'
            className='button secondary'
            onClick={(evt) => {
              this.onLogout(evt)
              logout()
            }}
          >
            <span id='logout-text'>logout</span>
            {this.props.user.photoURL && photoLogout }
          </div>
        </div>
      </span>
    )
  }
}

export default connect(state => state)(Dashboard)
