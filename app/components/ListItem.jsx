import React from 'react'
import FA from 'react-fontawesome'
import classnames from 'classnames'
import ReactTooltip from 'react-tooltip'
import { ShareButtons } from 'react-share'
import { getVoteSum } from '.././utilities/sbUtils'

class ListItem extends React.Component {
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
      hasTags: taglist !== null
    }
    return (
      <span className={this.props.type === 'favorite' ? 'favorite-item' : ''} id='discover-list-item'>
        <div id='expiration'>{sb.expires && sb.expires !== '' && <span><FA name='clock-o' className='fa fa-fw' />expires: {sb.expires}</span>}</div>
        <div className={classnames(sb.expires && sb.expires !== '' ? {hasExpiration: true, 'discover-list-item': true} : {'discover-list-item': true})}>
          <div id='discover-list-item-vote-container' style={{ width: '1px' }}>
            <div id='inner-vote-container'>
              <div id='discover-list-item-vote-count'>{getVoteSum(sb.choices)}</div>
              <div id='discover-list-item-vote-label'>votes</div>
            </div>
          </div>
          <div id='discover-list-item-title-container'>
            <div id='discover-list-item-title'>{sb.title}</div>
            {sb.description && <div id='discover-list-item-description' className={classnames(taglist !== null ? {hasTags: true} : {})}>{sb.description}</div>}
          </div>
          {sb.favorites && <div id='discover-list-item-favorites'>
            <FA name='star' className='fa fa-fw' />{sb.favorites} favorite{sb.favorites > 1 ? 's' : ''}
          </div>}
          {sb.tags && <div id='discover-list-item-tags'>
            <FA name='tags' className='fa fa-fw' />{taglist}
          </div>}
          {this.props.sharePanel && <div id='share-panel' className={classnames(sharePanelClasses)}>
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
          </div>}
        </div>
      </span>
    )
  }
}

export default ListItem