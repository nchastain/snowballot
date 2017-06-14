import React from 'react'
import IncludedMedia from './IncludedMedia'
import FA from 'react-fontawesome'
import ReactTooltip from 'react-tooltip'
import omit from 'object.omit'
import { connect } from 'react-redux'
import * as actions from '.././actions'
import classnames from 'classnames'
import ReactModal from 'react-modal'
import { didExpire, getVoteSum, findLeader } from 'utilities/sbUtils'
import { createStateFromProps, addCommas } from 'utilities/generalUtils'

class SbChoices extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      choices: [],
      userID: props.userID,
      expires: undefined,
      userVote: null,
      viewingMedia: false,
      modalOpen: null
    }
  }

  componentWillReceiveProps (nextProps) {
    let newState = createStateFromProps(this.props, nextProps)
    newState.userVote = nextProps.user.votes && nextProps.user.votes[nextProps.sb.id] ? nextProps.user.votes[nextProps.sb.id] : null
    this.setState(newState)
  }

  sbClasses (choice) {
    return classnames({
      'box-header': true,
      'clearfix': true
    })
  }

  vote (choiceId, e) {
    if (e.target.className === 'extra-media-button' || e.target.className.indexOf('fa') !== -1) return
    const previousVote = this.props.user.votes && this.props.user.votes[this.props.sb.id] !== undefined && this.props.user.votes[this.props.sb.id] !== null ? this.props.user.votes[this.props.sb.id] : null
    this.setState({userVote: previousVote === choiceId ? null : choiceId}, function () {
      const updatedChoices = this.updateChoicesOnVote(this.props.sb.choices, choiceId, previousVote)
      this.props.dispatch(actions.startUpdateSb(this.props.sb.id, {choices: updatedChoices}))
      this.props.dispatch(actions.startUpdateUserAll('votes', {[this.props.sb.id]: this.state.userVote}))
    })
  }

  updateChoicesOnVote (choices, newVote, previousVote) {
    return choices.map((choice) => {
      if (choice.id === previousVote) choice.votes-- // decrement previous choice's votes
      else if (choice.id === newVote && previousVote !== newVote) choice.votes++ // increment new choice's votes
      return choice
    })
  }

  buildModal (choice, name) {
    this.setState({modalOpen: name, [`${name}ModalOpen`]: true, viewingChoice: choice, viewingSection: name})
  }

  render () {
    const backgrounds = ['#54D19F', '#5192E8', '#DE80FF', '#E83442', '#FFAC59', 'coral', '#F19BA1']
    const lightBackgrounds = ['#87FFD2', '#84C5FF', '#FFD1FF', '#FF6775', '#FFDF8C', '#FFB283', '#FFCED4']
    const mediaIcon = (name, icon, choice) => {
      return (
        <span>
          {choice[name] && <span className='icon-wrapper'>
            <span className={`icon-${name}`} id={`icon-${name}-${choice.id}`} onClick={() => this.buildModal(choice, name)}>
              <span>{choice[name] && <span className='extra-media-button' style={{color: 'white', backgroundColor: lightBackgrounds[choice.id % lightBackgrounds.length]}} data-tip data-for={`${name}-tooltip-${choice.id}`}><FA name={icon} className='fa fa-fw' /></span>}</span>
              <ReactTooltip id={`${name}-tooltip-${choice.id}`} effect='solid'><span>View {name === 'youtube' ? 'YouTube link' : name}</span></ReactTooltip>
            </span>
          </span>}
        </span>
      )
    }
    const hasExtraMedia = choice => choice.GIF || choice.photo || choice.info || choice.link || choice.youtube
    const addExtraMedia = (choice) => {
      return (
        <span>
          {choice.info && mediaIcon('info', 'file-text-o', choice)}
          {choice.photo && mediaIcon('photo', 'picture-o', choice)}
          {choice.youtube && mediaIcon('youtube', 'youtube', choice)}
          {choice.link && mediaIcon('link', 'link', choice)}
          {choice.GIF && mediaIcon('GIF', 'film', choice)}
          {hasExtraMedia(choice) && <span id={`icon-more-${choice.id}`} onClick={() => this.buildModal(choice, 'more')}>
            <span><span className='more-media-button' style={{color: 'white', backgroundColor: lightBackgrounds[choice.id % lightBackgrounds.length]}} data-tip data-for={`more-tooltip-${choice.id}`}><FA name='ellipsis-h' className='fa fa-fw' /></span></span>
            <ReactTooltip id={`more-tooltip-${choice.id}`} effect='solid'><span>View more media</span></ReactTooltip>
          </span>}
        </span>
      )
    }
    const mediaClassNames = (section) => {
      return {
        'inner-media-icon': true,
        'active': this.state.viewingSection === section
      }
    }
    const addModalIcon = (name) => {
      if (!this.state.viewingChoice[name]) return
      const iconMap = {link: 'link', youtube: 'youtube', info: 'file-text-o', GIF: 'film', photo: 'photo'}
      return <div className={classnames(mediaClassNames(name))} onClick={() => this.buildModal(this.state.viewingChoice, name)} style={{marginLeft: '20px', marginBottom: '20px', display: 'inline-block'}}><FA name={iconMap[name]} className='fa fa-fw inner-media-real-icon' style={{display: 'inline-block', fontSize: '36px'}} /></div>
    }
    const that = this
    const isLeader = function (choice) { return didExpire(that.state.expires) && getVoteSum(that.props.choices) > 0 && choice.id === findLeader(that.props.choices).id }
    return (
        <span>
          <ReactModal contentLabel='delete-sb' isOpen={this.state.modalOpen !== null} className='Modal' overlayClassName='Overlay media-modal'>
            <div id='close-modal' onClick={() => this.setState({modalOpen: null})}><FA className='fa-2x fa-fw' name='times-circle' /></div>
            <div id='modal-top-container'>
              <div id='modal-top'>{this.state.viewingChoice && this.state.viewingSection ? `${this.state.viewingChoice.title} - Additional Media` : null}</div>
            </div>
            <span id='included-media-container'>
              <IncludedMedia included={this.state.viewingSection && this.state.viewingChoice ? {[this.state.viewingSection]: this.state.viewingChoice[this.state.viewingSection]} : {}} id={that.props.sb.id} onDelete={(type) => console.log(type)} showDelete={false} />
            </span>
            <div id='other-media-container'>
              {this.state.viewingChoice &&
              <span>
                {addModalIcon('info')}
                {addModalIcon('photo')}
                {addModalIcon('youtube')}
                {addModalIcon('link')}
                {addModalIcon('GIF')}
              </span>}
            </div>
          </ReactModal>
          <div id='sb-choices' className='sb-choices'>
            {this.state.choices && this.state.choices.map((choice, idx) =>
              <span key={choice.id}>
                <div
                  id={`choice-container-${choice.id}`}
                  key={choice.title + idx}
                  className={this.sbClasses(choice)}
                  onClick={(e) => !this.props.userID || didExpire(this.state.expires) ? null : this.vote(choice.id, e)}
                  style={{background: `${choice.photo ? `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)), url(${choice.photo})` : ''}`, backgroundSize: '40%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundColor: backgrounds[choice.id % backgrounds.length]}}
                >
                  <div className={choice.photo ? 'photo-title' : 'title'} style={{backgroundColor: `${choice.photo ? 'rgba(0,0,0,0.3)' : ''}`}}>{choice.title}</div>
                  <span className='vote-count' style={{color: backgrounds[choice.id % backgrounds.length]}}>{addCommas(choice.votes)}</span>
                  <div className='center-cell'>
                    {choice.id === this.state.userVote && <img className='check' src='.././check.png' />}
                  </div>
                  <div className='top-right-cell'>
                    {isLeader(choice) && <FA name='trophy' className='fa fa-fw' />}
                  </div>
                  <div className='bottom-left-cell'>
                    {addExtraMedia(choice)}
                  </div>
                </div>
              </span>
            )}
            {this.props.isExtensible && <div className='box-header clearfix' id='add-tile' onClick={() => this.props.onAdd()} >
              <div className='center-cell'>
                <img className='add-tile-image' src='.././addtile.png' />
              </div>
            </div>}
          </div>
        </span>
    )
  }
}

export default connect(state => state)(SbChoices)
