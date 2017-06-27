import React from 'react'
import FA from 'react-fontawesome'
import { ShareButtons } from 'react-share'
import ReactTooltip from 'react-tooltip'
import LoadingSpinner from './LoadingSpinner'
import {
  creatorMessage,
  expiresMessage,
  authMessage,
  votesMessage,
  linkMessage,
  winnerMessage
} from 'utilities/markupUtils'

const BallotInfoPanel = (props) => {
  if (Object.keys(props.sb).length === 0) return <LoadingSpinner />
  const editMessage = props.editMessage
  const {alias, choices, creator, createdAt, expires = null, id, title} = props.sb
  const pageUrl = `http://www.snowballot.com/sbs/${alias}`
  const pageTitle = title
  const description = 'Please click the link to vote on this.'
  const { FacebookShareButton, TwitterShareButton } = ShareButtons

  return (
    <div className='above-sb-container'>
      <div id='sb-info'>
        <ul>
            {creatorMessage(props.user.uid, creator, createdAt, alias)}
            {expiresMessage(expires)}
            {votesMessage(choices, id, props.user, expires)}
            {winnerMessage(expires, choices)}
            {linkMessage(alias)}
            {authMessage(props.user.uid)}
        </ul>
      </div>
      <div id='sb-actions'>
        {editMessage()}
        <span className='button action-button' data-tip data-for='twitter-share-tooltip'>
          <TwitterShareButton
            children={<FA name='twitter' className='fa fa-fw' />}
            url={pageUrl}
            title={pageTitle}
            description={description}
          />
        </span>
        <ReactTooltip id='twitter-share-tooltip' effect='solid'><span>Share on Twitter</span></ReactTooltip>
        <span className='button action-button' data-tip data-for='facebook-share-tooltip'>
          <FacebookShareButton
            children={<FA name='facebook' className='fa fa-fw' />}
            url={pageUrl}
            title={pageTitle}
            description={description}
          />
        </span>
        <ReactTooltip id='facebook-share-tooltip' effect='solid'><span>Share on Facebook</span></ReactTooltip>
      </div>
    </div>
  )
}

export default BallotInfoPanel
