import React from 'react'
import FA from 'react-fontawesome'
import classnames from 'classnames'
import * as actions from '.././actions'
import { connect } from 'react-redux'

class FavoritePanel extends React.Component {
  constructor (props) {
    super(props)
    this.state = {favorited: false, favorites: 0}
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.sb.favorites && nextProps.sb.favorites !== this.state.favorites) this.setState({favorites: nextProps.sb.favorites})
    if (nextProps.user.favorites && nextProps.user.favorites[nextProps.sb.id] && nextProps.user.favorites[nextProps.sb.id] !== this.state.favorited) this.setState({favorited: nextProps.user.favorites[nextProps.sb.id]})
  }

  toggleFavorite () {
    this.setState({favorited: !this.state.favorited}, function () {
      const initial = this.props.sb.favorited ? this.props.sb.favorited : 0
      const delta = this.state.favorited ? 1 : -1
      this.props.dispatch(actions.startUpdateSb(this.props.sb.id, {favorites: initial + delta}))
      this.props.dispatch(actions.startUpdateUserAll('favorites', {[this.props.sb.id]: this.state.favorited}))
    })
  }

  render () {
    const { favorited, favorites } = this.state
    return (
      <div id='favorite-panel'>
        <div id='favorite-panel-content' className={favorited ? 'favorited' : ''} onClick={() => this.toggleFavorite()}>
          <FA id='favorite-star' name={favorited ? 'star' : 'star-o'} className={classnames({'fa-fw': true, 'favorited': favorited})} style={{verticalAlign: 'middle'}} />
          <span className='favorite-text'>{favorites}</span>
        </div>
      </div>
    )
  }
}

export default connect(state => state)(FavoritePanel)
