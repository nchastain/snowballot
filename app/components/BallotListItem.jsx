import React from 'react'
import FA from 'react-fontawesome'
import classnames from 'classnames'
import ReactTooltip from 'react-tooltip'
import { ShareButtons } from 'react-share'
import { getVoteSum, findLeader } from '.././utilities/ballotUtils'
import { pluralize } from '.././utilities/markupUtils'

class BallotListItem extends React.Component {
  constructor (props) {
    super(props)
    this.state = {linkCopied: ''}
  }

  render () {
    const linkCopied = alias => this.state.linkCopied === alias
    const sb = this.props.sb
    const taglist = sb.tags && sb.tags.length > 0 ? sb.tags.map((tag) => <span className='tag' key={tag.text}>{tag.text}</span>) : null
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
    const sharePanelClasses = {
      hasFavorites: sb.favorites && sb.favorites > 0,
      hasTags: taglist !== null,
      'hide-for-mobile': true
    }
    return (
      <span className={this.props.type === 'favorite' ? 'favorite-item' : ''} id='ballot-list-item'>
        <div id='ballot-list-item-vote-container'>
          <div id='inner-vote-container'>
            <div id='ballot-list-item-vote-count' style={{background: `${sb.color}`}}>{getVoteSum(sb.choices)}</div>
            <div id='ballot-list-item-vote-label' style={{color: `${sb.color}`}}>{`vote${pluralize(getVoteSum(sb.choices))}`}</div>
          </div>
        </div>
        <div className='list-item-information'>
          <div id='expiration'>{sb.expires && sb.expires !== '' && <span><FA name='clock-o' className='fa fa-fw' />expires: {sb.expires}</span>}</div>
          <div className={classnames(sb.expires && sb.expires !== '' ? {hasExpiration: true, 'ballot-list-item': true} : {'ballot-list-item': true})}>
            <div id='ballot-list-item-title-container'>
              <div id='ballot-list-item-title' style={{color: `${sb.color}`}}>{sb.title}</div>
              {sb.description && <div id='ballot-list-item-description' className={classnames(taglist !== null ? {hasTags: true} : {})}>
                {sb.description.length > 250 ? sb.description.substr(0,250).trim() + '...' : sb.description}</div>}
            </div>
            {sb.favorites !== 0 && <div id='ballot-list-item-favorites'>
              <FA name='star' className='fa fa-fw' />{sb.favorites}<span className='hide-for-mobile'> favorite{pluralize(sb.favorites)}</span>
            </div>}
            {this.props.sharePanel &&
              <div id='share-panel' className={classnames(sharePanelClasses)}>
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
              </div>
            }
          </div>
          {sb.tags && <div id='ballot-list-item-tags'>
            <FA name='tags' className='fa fa-fw' />{taglist}
          </div>}
        </div>
        <div className='list-item-leader' style={{background: `${sb.color}`}}>
          <div className='leading-choice-content'>
            <div className='leading-choice-label' style={{color: `${sb.lightColor}`}}>leading</div>
            <span className='leading-choice-title'>{findLeader(sb.choices) ? findLeader(sb.choices).title : 'N/A'}</span>
            <div className='leading-choice-votes' style={{color: `${sb.lightColor}`}}>
              {findLeader(sb.choices) ? `${findLeader(sb.choices).votes} vote${pluralize(findLeader(sb.choices).votes)}` : ''}
            </div>
          </div>
        </div>
      </span>
    )
  }
}

export default BallotListItem
