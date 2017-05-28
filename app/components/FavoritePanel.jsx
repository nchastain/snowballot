import React from 'react'
import FA from 'react-fontawesome'
import classnames from 'classnames'

const FavoritePanel = ({ favorites = 0, favorited, onClick }) => (
  <div id='favorite-panel'>
    <div id='favorite-panel-content' className={favorited ? 'favorited' : ''} onClick={() => onClick()}>
      <FA id='favorite-star' name={favorited ? 'star' : 'star-o'} className={classnames({'fa-fw': true, 'favorited': favorited})} onClick={() => onClick()} style={{verticalAlign: 'middle'}} />
      <span className='favorite-text'>{favorites}</span>
    </div>
  </div>
)

export default FavoritePanel
