import React from 'react'
import FA from 'react-fontawesome'
import classnames from 'classnames'

const FavoritePanel = (props) => {
  const starClasses = {'fa-2x': true, 'fa-fw': true, 'favorited': props.favorited}
  return (
    <div id='favorite-panel'>
      <FA
        id='favorite-star'
        name={props.favorited ? 'star' : 'star-o'}
        className={classnames(starClasses)}
        onClick={() => props.onClick()}
      />
    </div>
  )
}

export default FavoritePanel
