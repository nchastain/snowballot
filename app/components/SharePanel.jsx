import React from 'react'
import { connect } from 'react-redux'
import { ShareButtons, ShareCounts, generateShareIcon } from 'react-share'
import PropTypes from 'prop-types'
import FA from 'react-fontawesome'

class SharePanel extends React.Component {
  copyToClipboard () {
    var aux = document.createElement('input')
    aux.setAttribute('value', `http://localhost:3000/sbs/${this.props.sb.alias}`)
    document.body.appendChild(aux)
    aux.select()
    document.execCommand('copy')
    document.body.removeChild(aux)
  }

  showAlt (e, target) {
    if (!this.props.altText) return
    let alt
    let base = e.currentTarget.parentElement
    let defaultAlt = base.querySelector('#share-alt')
    switch (target) {
      case 'copy':
        alt = base.querySelector('#copy-alt')
        break
      case 'facebook':
        alt = base.querySelector('#facebook-alt')
        break
      case 'twitter':
        alt = base.querySelector('#twitter-alt')
        break
      default:
        alt = base.querySelector('#copy-alt')
    }
    if (e.type === 'mouseenter') {
      defaultAlt.style.display = 'none'
      alt.style.opacity = '1'
      alt.style.display = 'inline-block'
    } else if (e.type === 'mouseleave') {
      alt.style.display = 'none'
      alt.style.opacity = '0'
      defaultAlt.style.display = 'inline-block'
    }
  }

  render () {
    const { FacebookShareButton, TwitterShareButton } = ShareButtons
    const FacebookIcon = generateShareIcon('facebook')
    const TwitterIcon = generateShareIcon('twitter')
    const pageUrl = `http://www.snowballot.com/sbs/${this.props.sb.alias}`
    const pageTitle = this.props.sb.title
    const description = 'Please click the link to vote on this.'

    return (
      <div className='share-panel'>
        <div className='share-icon-container' onMouseEnter={(e) => this.showAlt(e, 'facebook')} onMouseLeave={(e) => this.showAlt(e, 'facebook')}>
          <FacebookShareButton
            children={<FacebookIcon className='share-icon' size={this.props.iconSize === 'small' ? 24 : 32} round />}
            url={pageUrl}
            title={pageTitle}
            description={description}
          />
        </div>
        <div className='share-icon-container' onMouseEnter={(e) => this.showAlt(e, 'twitter')} onMouseLeave={(e) => this.showAlt(e, 'twitter')}>
          <TwitterShareButton
            onMouseEnter={(e) => this.showAlt(e, 'twitter')}
            className='share-icon'
            children={<TwitterIcon className='share-icon' size={this.props.iconSize === 'small' ? 24 : 32} round />}
            url={pageUrl}
            title={pageTitle}
            description={description}
          />
        </div>
        <div
          className='share-icon-container'
          onClick={() => this.copyToClipboard()}
          onMouseEnter={(e) => this.showAlt(e, 'copy')}
          onMouseLeave={(e) => this.showAlt(e, 'copy')}
        >
          <FA name='clipboard' className='fa-2x fa-fw share-icon' id='clipboard' style={{fontSize: this.props.iconSize === 'small' ? '24px !important' : '32px !important', width: this.props.iconSize === 'small' ? '24px' : '32px'}} />
        </div>
        {this.props.altText && <div id='alt-container'>
          <div id='share-alt' onClick={() => this.copyToClipboard()}>Share this snowballot</div>
          <div id='facebook-alt'>Share on Facebook</div>
          <div id='twitter-alt'>Share on Twitter</div>
          <div id='copy-alt'>Copy link</div>
        </div>}
      </div>
    )
  }
}

SharePanel.defaultProps = {
  altText: true,
  iconSize: 'large'
}

export default connect(state => state)(SharePanel)
