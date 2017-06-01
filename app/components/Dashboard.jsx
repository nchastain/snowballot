import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import * as actions from '../actions'
import SharePanel from './SharePanel'
import AccountPanel from './AccountPanel'
import FA from 'react-fontawesome'
import { getVoteSum } from '.././utilities/sbUtils'
import ReactTooltip from 'react-tooltip'
import { ShareButtons } from 'react-share'

export class Dashboard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      favoriteSbs: [],
      linkCopied: ''
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
    const { FacebookShareButton, TwitterShareButton } = ShareButtons
    const description = 'Please click the link to vote on this.'
    const copyToClipboard = (alias) => {
      var aux = document.createElement('input')
      aux.setAttribute('value', `http://localhost:3003/sbs/${alias}`)
      document.body.appendChild(aux)
      aux.select()
      document.execCommand('copy')
      document.body.removeChild(aux)
      this.setState({linkCopied: alias})
    }
    const linkCopied = alias => this.state.linkCopied === alias
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
          <span className='button action-button' data-tip data-for='copy-tooltip' onClick={() => copyToClipboard(sb.alias)}>
            <FA name={linkCopied(sb.alias) ? 'check-circle' : 'clipboard'} className='fa fa-fw' />
          </span>
          <ReactTooltip id='copy-tooltip' effect='solid'><span>Copy snowballot link</span></ReactTooltip>
          <span className='button action-button' data-tip data-for='twitter-share-tooltip'>
            <TwitterShareButton
              children={<FA name='twitter' className='fa fa-fw' />}
              url={`http://www.snowballot.com/sbs/${sb.alias}`}
              title={sb.title}
              description={description}
            />
          </span>
          <ReactTooltip id='twitter-share-tooltip' effect='solid'><span>Share on Twitter</span></ReactTooltip>
          <span className='button action-button' data-tip data-for='facebook-share-tooltip'>
            <FacebookShareButton
              children={<FA name='facebook' className='fa fa-fw' />}
              url={`http://www.snowballot.com/sbs/${sb.alias}`}
              title={sb.title}
              description={description}
            />
          </span>
          <ReactTooltip id='facebook-share-tooltip' effect='solid'><span>Share on Facebook</span></ReactTooltip>
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
