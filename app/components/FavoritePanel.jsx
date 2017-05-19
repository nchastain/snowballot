import React from 'react'
import FA from 'react-fontawesome'
import classnames from 'classnames'

const FavoritePanel = ({ favorited, onClick }) => (
  <div id='favorite-panel'>
    <FA
      id='favorite-star'
      name={favorited ? 'star' : 'star-o'}
      className={classnames({'fa-2x': true, 'fa-fw': true, 'favorited': favorited})}
      onClick={() => onClick()}
    />
  </div>
)

export default FavoritePanel
