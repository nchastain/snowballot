import React from 'react'
import IncludedMedia from './IncludedMedia'
import FA from 'react-fontawesome'
import omit from 'object.omit'
import classnames from 'classnames'
import { doesExpire, getVoteSum, findLeader } from 'utilities/sbUtils'
import { handleVoteHover } from 'utilities/generalUtils'

const SbChoices = ({choices, userID, expires, userChoice, vote}) => {
  const iconInfo = [{class: 'unselected', name: 'circle-o'}, {class: 'selected', name: 'check-circle'}, {class: 'trophy', name: 'trophy'}]
  const sbClasses = (choice) => {
    return classnames({
      'box-header': true,
      'clearfix': true,
      'selected': !doesExpire(expires) && choice.id === userChoice,
      'leader': doesExpire(expires) && getVoteSum(choices) && choice.id === findLeader(choices).id
    })
  }
  const hasExtra = ({info, photo, GIF, youtube, link}) => info || photo || GIF || youtube || link
  return (
    <ul className='sb-choices'>
      {choices && choices.map((choice, idx) =>
        <span key={choice.id}>
          <div
            key={choice.title + idx}
            className={sbClasses(choice)}
            onClick={(e) => !userID ? null : vote(e, choice.id)}
            onMouseEnter={(e) => handleVoteHover(e, userID, expires)}
            onMouseLeave={(e) => handleVoteHover(e, userID, expires)}
          >
            <div className='left-cell'>
              {iconInfo.map((icon) => <FA key={icon.name} className={`fa-fw selection-icon ${icon.class}`} name={icon.name} />)}
            </div>
            <div className='right-cell'>
              <li>{choice.title}</li>
            </div>
            <div className='right-cell'>
              <span className='vote-count'>{choice.votes} votes {choice.id === userChoice ? <span className='plus selected'> - 1?</span> : <span className='plus'> + 1?</span>}</span>
            </div>
          </div>
          {hasExtra(choice) &&
          <div className='more-sb-info'>
            <IncludedMedia included={omit(choice, ['votes', 'title', 'id'], (val) => val !== '')} />
          </div>}
        </span>
      )}
    </ul>
  )
}

export default SbChoices
